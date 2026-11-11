import { useEffect, useRef, type CSSProperties } from 'react';

interface GalaxyProps {
  density?: number;
  glowIntensity?: number;
  flareIntensity?: number;
  starSpeed?: number;
  mouseRepulsion?: boolean;
  clickWarp?: boolean;
  starColors?: string[];
  hueShift?: number;
  saturation?: number;
  starSize?: number;
  twinkleIntensity?: number;
  speed?: number;
  rotationSpeed?: number;
  layers?: number;
  direction?: 'forward' | 'backward';
  repulsionStrength?: number;
  mouseInteraction?: boolean;
  intro?: boolean;
  lightMode?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface Star {
  x: number;
  y: number;
  layer: number;
  radius: number;
  phase: number;
  hue: number;
}

export default function Galaxy({
  density = 1,
  glowIntensity = 0.3,
  flareIntensity = 1,
  starSpeed = 0.5,
  mouseRepulsion = true,
  clickWarp = true,
  starColors = [],
  hueShift = 140,
  saturation = 0,
  starSize = 1,
  twinkleIntensity = 0.7,
  speed = 1.8,
  rotationSpeed = 0.1,
  layers = 4,
  direction = 'forward',
  repulsionStrength = 2,
  mouseInteraction = true,
  intro = false,
  lightMode = false,
  className,
  style,
}: GalaxyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !parent || !ctx) return;

    const pointer = { x: -1000, y: -1000 };
    const warp = { x: 0, y: 0, strength: 0 };
    const layerCount = Math.max(1, Math.floor(layers));
    let width = 0;
    let height = 0;
    let frame = 0;
    let animationId = 0;
    let lastTime = 0;
    let stars: Star[] = [];
    let rotation = 0;

    const resize = () => {
      const bounds = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(1200, Math.max(160, Math.round((width * height / 5200) * density)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        layer: Math.random() * layerCount,
        radius: (0.45 + Math.random() * 1.15) * starSize,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() * 65 - 32,
      }));
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = parent.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
    };

    const onClick = (event: MouseEvent) => {
      if (!clickWarp) return;
      const bounds = parent.getBoundingClientRect();
      warp.x = event.clientX - bounds.left;
      warp.y = event.clientY - bounds.top;
      warp.strength = 1;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('click', onClick);

    const draw = (time: number) => {
      const delta = lastTime ? Math.min((time - lastTime) / 16.67, 2) : 1;
      lastTime = time;
      frame += delta;
      rotation += rotationSpeed * 0.0008 * delta;
      warp.strength *= 0.94;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(rotation);
      ctx.translate(-width / 2, -height / 2);

      for (const star of stars) {
        const layerFactor = 0.35 + (star.layer / layerCount) * 0.9;
        const velocity = starSpeed * speed * layerFactor * 0.42 * (direction === 'forward' ? 1 : -1);
        const dx = ((star.x - width / 2) / Math.max(width, height)) * velocity * delta;
        const dy = ((star.y - height / 2) / Math.max(width, height)) * velocity * delta;
        star.x += dx;
        star.y += dy;

        if (warp.strength > 0.015) {
          const wx = star.x - warp.x;
          const wy = star.y - warp.y;
          const distance = Math.max(20, Math.hypot(wx, wy));
          star.x += (wx / distance) * warp.strength * 17 * delta;
          star.y += (wy / distance) * warp.strength * 17 * delta;
        }

        if (mouseInteraction && mouseRepulsion) {
          const mx = star.x - pointer.x;
          const my = star.y - pointer.y;
          const distance = Math.hypot(mx, my);
          if (distance < 115 && distance > 0) {
            const force = ((115 - distance) / 115) * repulsionStrength * 0.32;
            star.x += (mx / distance) * force * delta;
            star.y += (my / distance) * force * delta;
          }
        }

        if (star.x < -5 || star.x > width + 5 || star.y < -5 || star.y > height + 5) {
          star.x = Math.random() * width;
          star.y = Math.random() * height;
        }

        const twinkle = 1 - twinkleIntensity * (0.5 + 0.5 * Math.sin(frame * 0.08 + star.phase));
        const alpha = Math.min(1, (0.45 + layerFactor * 0.45) * twinkle);
        const color = starColors.length
          ? starColors[Math.abs(Math.floor(star.phase)) % starColors.length]
          : lightMode
            ? `hsl(${(hueShift + star.hue + 360) % 360}, ${Math.max(10, saturation)}%, 30%)`
            : `hsl(${(hueShift + star.hue + 360) % 360}, ${Math.max(26, saturation)}%, 82%)`;
        const radius = star.radius * layerFactor;

        if (glowIntensity > 0 && radius > 0.9) {
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.globalAlpha = alpha * glowIntensity * 0.5;
          ctx.shadowBlur = 8 * glowIntensity * flareIntensity;
          ctx.shadowColor = color;
          ctx.arc(star.x, star.y, radius * (1.5 + flareIntensity * 0.3), 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        if (Math.abs(dx) + Math.abs(dy) > 0.12 || warp.strength > 0.05) {
          const trail = 3 + warp.strength * 18;
          ctx.strokeStyle = color;
          ctx.globalAlpha = alpha * (0.25 + warp.strength * 0.55);
          ctx.lineWidth = Math.max(0.5, radius * 0.65);
          ctx.beginPath();
          ctx.moveTo(star.x - dx * trail, star.y - dy * trail);
          ctx.lineTo(star.x, star.y);
          ctx.stroke();
          ctx.globalAlpha = alpha;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      ctx.globalAlpha = 1;
      canvas.style.opacity = intro ? String(Math.min(1, frame / 35)) : '1';
      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('click', onClick);
    };
  }, [density, glowIntensity, flareIntensity, starSpeed, mouseRepulsion, clickWarp, starColors, hueShift, saturation, starSize, twinkleIntensity, speed, rotationSpeed, layers, direction, repulsionStrength, mouseInteraction, intro, lightMode]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }} />;
}
