import { useEffect, useRef } from 'react';
import type { CursorStyle } from '../types';

interface Props { style: CursorStyle }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; size: number; hue: number; spin: number }

export default function CursorEffects({ style }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || style === 'default') return;

    const pointer = { x: -100, y: -100, px: -100, py: -100, angle: 0, active: false };
    const history: { x: number; y: number; t: number }[] = [];
    const particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;
    let lastSpawn = 0;
    let tick = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      pointer.px = pointer.x;
      pointer.py = pointer.y;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
      const dx = pointer.x - pointer.px;
      const dy = pointer.y - pointer.py;
      if (Math.hypot(dx, dy) > 0.5) pointer.angle = Math.atan2(dy, dx);
      history.push({ x: pointer.x, y: pointer.y, t: performance.now() });
      if (history.length > 12) history.shift();

      if (style === 'celebration' && performance.now() - lastSpawn > 28) {
        lastSpawn = performance.now();
        for (let i = 0; i < 2; i++) spawnParticle(pointer.x, pointer.y, 0.7);
      }
    };

    const spawnParticle = (x: number, y: number, power: number) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = (1 + Math.random() * 4) * power;
      particles.push({
        x, y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - (power > 0.9 ? 1 : 0),
        life: 1,
        size: 3 + Math.random() * 5,
        hue: Math.random() * 360,
        spin: Math.random() * Math.PI,
      });
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      if (style === 'celebration') {
        for (let i = 0; i < 36; i++) spawnParticle(event.clientX, event.clientY, 2.2);
      }
    };
    const onLeave = () => { pointer.active = false; };

    const drawArc = () => {
      if (!pointer.active || history.length < 2) return;
      const now = performance.now();
      const visible = history.filter(point => now - point.t < 180);
      for (let i = 1; i < visible.length; i++) {
        const a = visible[i - 1];
        const b = visible[i];
        const age = (now - b.t) / 180;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.hypot(dx, dy);
        const segments = Math.max(2, Math.ceil(distance / 13));
        const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        gradient.addColorStop(0, `rgba(92,225,255,${(1 - age) * 0.08})`);
        gradient.addColorStop(0.5, `rgba(184,129,255,${(1 - age) * 0.9})`);
        gradient.addColorStop(1, `rgba(255,255,255,${(1 - age) * 0.85})`);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        for (let segment = 1; segment < segments; segment++) {
          const t = segment / segments;
          const offset = Math.sin(t * Math.PI) * (Math.sin(tick * 0.21 + segment * 7 + i) * 5 + (Math.random() - 0.5) * 4);
          ctx.lineTo(a.x + dx * t - (dy / Math.max(distance, 1)) * offset, a.y + dy * t + (dx / Math.max(distance, 1)) * offset);
        }
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1 + (1 - age) * 1.8;
        ctx.shadowColor = '#9c8cff';
        ctx.shadowBlur = 12;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 4 + Math.sin(tick * 0.12) * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#7cecff';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawCelebration = (delta: number) => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        p.vy += 0.045 * delta;
        p.vx *= 0.99;
        p.life -= 0.012 * delta;
        p.spin += 0.12 * delta;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.spin);
        ctx.globalAlpha = Math.min(1, p.life * 1.6);
        ctx.fillStyle = `hsl(${p.hue}, 95%, 66%)`;
        ctx.shadowColor = `hsl(${p.hue}, 95%, 65%)`;
        ctx.shadowBlur = 10;
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
        ctx.restore();
      }
    };

    const drawGyroscope = () => {
      if (!pointer.active) return;
      const x = pointer.x;
      const y = pointer.y;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(pointer.angle);
      ctx.strokeStyle = 'rgba(135,225,255,0.82)';
      ctx.lineWidth = 1.4;
      ctx.shadowColor = '#7dd3fc';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.ellipse(0, 0, 17, 7, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.rotate(Math.PI / 2 + tick * 0.035);
      ctx.strokeStyle = 'rgba(222,155,255,0.84)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 17, 7, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.rotate(-Math.PI / 2 - tick * 0.035);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(1, -10);
      ctx.lineTo(7, 7);
      ctx.lineTo(1, 4);
      ctx.lineTo(-4, 8);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.shadowBlur = 0;
    };

    const render = (time: number) => {
      const delta = last ? Math.min((time - last) / 16.67, 2) : 1;
      last = time;
      tick += delta;
      ctx.clearRect(0, 0, width, height);
      if (style === 'arc') drawArc();
      if (style === 'celebration') drawCelebration(delta);
      if (style === 'gyroscope') drawGyroscope();
      raf = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [style]);

  if (style === 'default') return null;
  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 z-[10000] h-screen w-screen pointer-events-none" />;
}
