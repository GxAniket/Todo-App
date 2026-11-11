import { useState } from 'react';
import type { ThemeId } from '../types';

interface Props {
  onComplete: (name: string, theme: ThemeId) => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [name, setName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('dark');
  const [step, setStep] = useState<'name' | 'theme'>('name');

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #07071a 0%, #0d0d2e 50%, #120830 100%)',
        fontFamily: 'Outfit, sans-serif',
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background:
              'radial-gradient(circle, #8b5cf6, transparent)',
            top: '-10%',
            right: '5%',
            filter: 'blur(80px)',
          }}
        />

        <div
          className="absolute w-96 h-96 rounded-full opacity-12"
          style={{
            background:
              'radial-gradient(circle, #ec4899, transparent)',
            bottom: '0%',
            left: '0%',
            filter: 'blur(70px)',
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 animate-slide-up">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-3">
            <img
              src="/todo-logo.png"
              alt="Todo - GxAniket"
              className="h-16 sm:h-20 w-auto max-w-[280px] sm:max-w-[320px] object-contain"
            />
          </div>

          {/* Premium Productivity Planner removed */}
        </div>

        {/* Main Card */}
        <div
          className="glass rounded-3xl p-8"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border:
              '1px solid rgba(139,92,246,0.22)',
            boxShadow:
              '0 0 60px rgba(139,92,246,0.1), 0 30px 60px rgba(0,0,0,0.6)',
          }}
        >

          {/* ================= NAME ================= */}
          {step === 'name' && (
            <div className="animate-fade-in">

              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome, Sir or Mam 👋
              </h2>

              <p
                style={{ color: '#8888b0' }}
                className="text-sm mb-8"
              >
                Let's personalize your productivity journey
              </p>

              <label
                className="block text-xs font-bold tracking-[0.2em] uppercase mb-3"
                style={{ color: '#a78bfa' }}
              >
                Your Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' &&
                    name.trim()
                  ) {
                    setStep('theme');
                  }
                }}
                placeholder="Enter your name..."
                autoFocus
                className="w-full rounded-xl px-4 py-4 text-white text-lg outline-none transition-all"
                style={{
                  background:
                    'rgba(255,255,255,0.06)',
                  border: `1px solid ${
                    name.trim()
                      ? 'rgba(139,92,246,0.6)'
                      : 'rgba(139,92,246,0.2)'
                  }`,
                  fontFamily: 'Outfit, sans-serif',
                }}
              />

              <button
                onClick={() => {
                  if (name.trim()) {
                    setStep('theme');
                  }
                }}
                disabled={!name.trim()}
                className="w-full mt-6 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: name.trim()
                    ? 'linear-gradient(135deg,#8b5cf6,#ec4899)'
                    : 'rgba(255,255,255,0.08)',
                  boxShadow: name.trim()
                    ? '0 0 35px rgba(139,92,246,0.45)'
                    : 'none',
                }}
              >
                Continue →
              </button>
            </div>
          )}

          {/* ================= THEME ================= */}
          {step === 'theme' && (
            <div className="animate-fade-in">

              {/* Back */}
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setStep('name')}
                  className="text-xs px-3 py-1.5 rounded-full transition-all font-medium"
                  style={{
                    color: '#8888b0',
                    background:
                      'rgba(255,255,255,0.05)',
                    border:
                      '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  ← Back
                </button>

                <div
                  className="h-px flex-1"
                  style={{
                    background:
                      'rgba(255,255,255,0.06)',
                  }}
                />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                Choose Your Theme 🎨
              </h2>

              <p
                style={{ color: '#8888b0' }}
                className="text-sm mb-6"
              >
                Choose your preferred appearance
              </p>

              {/* Only Dark + Light */}
              <div className="grid grid-cols-2 gap-4 mb-6">

                {/* DARK */}
                <button
                  onClick={() =>
                    setSelectedTheme('dark')
                  }
                  className="relative rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    border:
                      selectedTheme === 'dark'
                        ? '2px solid #8b5cf6'
                        : '2px solid rgba(255,255,255,0.08)',
                    boxShadow:
                      selectedTheme === 'dark'
                        ? '0 0 25px rgba(139,92,246,0.4)'
                        : 'none',
                    transform:
                      selectedTheme === 'dark'
                        ? 'scale(1.03)'
                        : 'scale(1)',
                  }}
                >
                  <div
                    className="h-24"
                    style={{
                      background:
                        'linear-gradient(135deg,#07071a,#24104f,#111827)',
                    }}
                  />

                  <div
                    className="py-3"
                    style={{
                      background:
                        'rgba(0,0,0,0.7)',
                    }}
                  >
                    <span className="text-xl">
                      🌌
                    </span>

                    <p
                      className="text-sm font-semibold mt-1"
                      style={{
                        color:
                          selectedTheme === 'dark'
                            ? '#a78bfa'
                            : '#7070a0',
                      }}
                    >
                      Dark Mode
                    </p>
                  </div>

                  {selectedTheme === 'dark' && (
                    <div
                      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{
                        background: '#8b5cf6',
                      }}
                    >
                      ✓
                    </div>
                  )}
                </button>

                {/* LIGHT */}
                <button
                  onClick={() =>
                    setSelectedTheme('light')
                  }
                  className="relative rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    border:
                      selectedTheme === 'light'
                        ? '2px solid #ec4899'
                        : '2px solid rgba(255,255,255,0.08)',
                    boxShadow:
                      selectedTheme === 'light'
                        ? '0 0 25px rgba(236,72,153,0.35)'
                        : 'none',
                    transform:
                      selectedTheme === 'light'
                        ? 'scale(1.03)'
                        : 'scale(1)',
                  }}
                >
                  <div
                    className="h-24"
                    style={{
                      background:
                        'linear-gradient(135deg,#ffffff,#eef2ff,#fce7f3)',
                    }}
                  />

                  <div
                    className="py-3"
                    style={{
                      background:
                        'rgba(255,255,255,0.92)',
                    }}
                  >
                    <span className="text-xl">
                      ☀️
                    </span>

                    <p
                      className="text-sm font-semibold mt-1"
                      style={{
                        color:
                          selectedTheme === 'light'
                            ? '#ec4899'
                            : '#7070a0',
                      }}
                    >
                      Light Mode
                    </p>
                  </div>

                  {selectedTheme === 'light' && (
                    <div
                      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{
                        background: '#ec4899',
                      }}
                    >
                      ✓
                    </div>
                  )}
                </button>
              </div>

              {/* Selected Theme */}
              <div
                className="rounded-2xl px-4 py-4 mb-5 flex items-center gap-3"
                style={{
                  background:
                    'rgba(255,255,255,0.04)',
                  border:
                    '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <span className="text-2xl">
                  {selectedTheme === 'dark'
                    ? '🌌'
                    : '☀️'}
                </span>

                <div>
                  <p className="text-white text-sm font-semibold">
                    {selectedTheme === 'dark'
                      ? 'Dark Mode'
                      : 'Light Mode'}
                  </p>

                  <p
                    className="text-xs"
                    style={{
                      color: '#7070a0',
                    }}
                  >
                    {selectedTheme === 'dark'
                      ? 'Dark interface with a modern neon appearance'
                      : 'Clean and bright interface for daytime use'}
                  </p>
                </div>
              </div>

              {/* Start */}
              <button
                onClick={() =>
                  onComplete(
                    name.trim(),
                    selectedTheme
                  )
                }
                className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300"
                style={{
                  background:
                    'linear-gradient(135deg,#8b5cf6,#ec4899)',
                  boxShadow:
                    '0 0 35px rgba(139,92,246,0.4)',
                }}
              >
                Start Your Journey ✨
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p
          className="text-center text-xs mt-6"
          style={{ color: '#555577' }}
        >
          <span>Todo Application version - 2.5</span>
          <br />
          © 2026 - 2027 Aniket Sundriyal. All rights reserved.
        </p>
      </div>
    </div>
  );
}
