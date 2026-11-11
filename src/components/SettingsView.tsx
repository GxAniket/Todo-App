import { useState } from 'react';
import { useApp } from '../App';
import { themes } from '../themes';
import type { CursorStyle } from '../types';

const CURSOR_OPTIONS: { id: CursorStyle; label: string; description: string; icon: string }[] = [
  { id: 'default', label: 'Default', description: 'Use the normal pointer', icon: '↖' },
  { id: 'arc', label: 'Arc Cursor', description: 'Electric light trail', icon: '⚡' },
  { id: 'celebration', label: 'Celebration Cursor', description: 'Confetti trail and bursts', icon: '🎉' },
  { id: 'gyroscope', label: 'Gyroscope Cursor', description: 'Orbiting rings and arrow', icon: '◎' },
];

const PROFILE_IMAGES = [
  { src: '/aniket.jpg', label: 'Aniket' },
  ...Array.from({ length: 8 }, (_, index) => ({ src: `/${index + 1}.jpg`, label: `Avatar ${index + 1}` })),
];

export default function SettingsView() {
  const {
    userName,
    setUserName,
    profileImage,
    setProfileImage,
    theme,
    setTheme,
    tasks,
    clearSavedData,
    cursorStyle,
    setCursorStyle,
    remindersEnabled,
    setRemindersEnabled,
    soundEnabled,
    setSoundEnabled,
    testReminderSound,
  } = useApp();
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(userName);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');

  const completedTasks = tasks.filter(
    (task) => task.completed && !task.deleted
  ).length;

  const totalTasks = tasks.filter(
    (task) => !task.deleted
  ).length;

  const importantTasks = tasks.filter(
    (task) =>
      task.important && !task.deleted
  ).length;

  const initials = userName
    ? userName.charAt(0).toUpperCase()
    : 'U';

  return (
    <div className="p-6 pb-28 md:p-8 md:pb-8 max-w-5xl mx-auto">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold mb-8">
        Settings
      </h1>

      {/* ================= PROFILE ================= */}
      <section
        className="rounded-3xl p-6 mb-6"
        style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
        }}
      >
        <p
          className="text-xs font-bold tracking-[0.2em] uppercase mb-5"
          style={{ color: theme.accent1 }}
        >
          Profile
        </p>

        <div className="flex items-center gap-4 mb-6">

          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg,#8b5cf6,#ec4899)',
              boxShadow:
                '0 0 25px rgba(139,92,246,0.3)',
            }}
          >
            {profileImage ? (
              <img src={profileImage} alt={`${userName}'s profile`} className="w-full h-full object-cover" />
            ) : initials}
          </div>

          <div>
            <h2 className="text-xl font-bold">
              {userName || 'User'}
            </h2>

            <p
              className="text-sm"
              style={{ color: theme.textSecondary }}
            >
              Todo User
            </p>
          </div>
        </div>

        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowImagePicker((show) => !show)}
            className="rounded-xl px-3 py-2 text-sm font-semibold"
            style={{ background: `${theme.accent1}18`, color: theme.accent1 }}
          >
            {showImagePicker ? 'Hide profile images' : 'Choose profile image'}
          </button>
          {showImagePicker && (
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
              <button
                type="button"
                onClick={() => { setProfileImage(''); setShowImagePicker(false); }}
                aria-label="Use initials instead of a profile image"
                aria-pressed={!profileImage}
                className="aspect-square rounded-full flex items-center justify-center text-xl font-bold"
                style={{
                  color: theme.textPrimary,
                  background: `linear-gradient(135deg,${theme.accent1},${theme.accent2})`,
                  border: `2px solid ${!profileImage ? theme.accent1 : theme.cardBorder}`,
                }}
              >{initials}</button>
              {PROFILE_IMAGES.map((image) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => { setProfileImage(image.src); setShowImagePicker(false); }}
                  aria-label={`Select ${image.label} profile image`}
                  aria-pressed={profileImage === image.src}
                  className="aspect-square rounded-full overflow-hidden"
                  style={{ border: `2px solid ${profileImage === image.src ? theme.accent1 : theme.cardBorder}` }}
                >
                  <img src={image.src} alt={image.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          {editingName ? (
            <>
              <input
                value={nameDraft}
                onChange={(event) => setNameDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && nameDraft.trim()) {
                    setUserName(nameDraft.trim());
                    setEditingName(false);
                  }
                  if (event.key === 'Escape') setEditingName(false);
                }}
                maxLength={40}
                aria-label="Your name"
                className="rounded-xl px-3 py-2 text-sm outline-none"
                style={{ background: theme.cardBg, color: theme.textPrimary, border: `1px solid ${theme.cardBorder}` }}
                autoFocus
              />
              <button
                onClick={() => {
                  if (!nameDraft.trim()) return;
                  setUserName(nameDraft.trim());
                  setEditingName(false);
                }}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-white"
                style={{ background: theme.accent1 }}
              >Save name</button>
              <button
                onClick={() => { setNameDraft(userName); setEditingName(false); }}
                className="rounded-xl px-3 py-2 text-sm"
                style={{ color: theme.textSecondary, border: `1px solid ${theme.cardBorder}` }}
              >Cancel</button>
            </>
          ) : (
            <button
              onClick={() => { setNameDraft(userName); setEditingName(true); }}
              className="rounded-xl px-3 py-2 text-sm font-semibold"
              style={{ background: `${theme.accent1}18`, color: theme.accent1 }}
            >Edit name</button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          <div
            className="rounded-2xl p-4 text-center"
            style={{
              background: `${theme.accent1}08`,
              border: `1px solid ${theme.accent1}25`,
            }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: theme.accent1 }}
            >
              {totalTasks}
            </div>

            <p
              className="text-xs mt-1"
              style={{ color: theme.textSecondary }}
            >
              Total Tasks
            </p>
          </div>

          <div
            className="rounded-2xl p-4 text-center"
            style={{
              background: '#10b98108',
              border: '1px solid #10b98125',
            }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: '#10b981' }}
            >
              {completedTasks}
            </div>

            <p
              className="text-xs mt-1"
              style={{ color: theme.textSecondary }}
            >
              Completed
            </p>
          </div>

          <div
            className="rounded-2xl p-4 text-center"
            style={{
              background: '#ec489908',
              border: '1px solid #ec489925',
            }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: '#ec4899' }}
            >
              {importantTasks}
            </div>

            <p
              className="text-xs mt-1"
              style={{ color: theme.textSecondary }}
            >
              Important
            </p>
          </div>

        </div>
      </section>

      <section
        className="rounded-3xl p-6 mb-6"
        style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
      >
        <p className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: theme.accent1 }}>
          Notifications &amp; sound
        </p>
        <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>
          Task reminders use the scheduled date and time; study timers alert when they finish. The page must stay open.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={async () => {
              if (remindersEnabled) {
                setRemindersEnabled(false);
                setReminderMessage('Browser reminders are off.');
                return;
              }
              if (!('Notification' in window)) {
                setReminderMessage('This browser does not support notifications.');
                return;
              }
              const permission = Notification.permission === 'granted'
                ? 'granted'
                : await Notification.requestPermission();
              if (permission === 'granted') {
                setRemindersEnabled(true);
                setReminderMessage('Browser reminders are on.');
              } else if (permission === 'denied') {
                setRemindersEnabled(false);
                setReminderMessage('Notifications are blocked in browser settings.');
              } else {
                setReminderMessage('Allow notifications in the browser prompt to turn reminders on.');
              }
            }}
            className="rounded-xl px-4 py-2 text-sm font-semibold"
            style={{
              background: remindersEnabled ? `${theme.accent1}20` : `linear-gradient(135deg,${theme.accent1},${theme.accent2})`,
              color: remindersEnabled ? theme.accent1 : '#fff',
            }}
          >
            {remindersEnabled ? 'Turn off reminders' : 'Enable browser reminders'}
          </button>
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="rounded-xl px-4 py-2 text-sm font-semibold"
            style={{ background: soundEnabled ? `${theme.accent3}20` : `${theme.textPrimary}08`, color: soundEnabled ? theme.accent3 : theme.textPrimary, border: `1px solid ${theme.cardBorder}` }}
          >
            Task sound: {soundEnabled ? 'On' : 'Off'}
          </button>
          <button
            type="button"
            onClick={testReminderSound}
            className="rounded-xl px-4 py-2 text-sm font-semibold"
            style={{ background: `${theme.textPrimary}08`, color: theme.textSecondary, border: `1px solid ${theme.cardBorder}` }}
          >Test sound</button>
        </div>
        <p className="text-xs mt-3" style={{ color: theme.textSecondary }} aria-live="polite">
          {reminderMessage || (typeof window !== 'undefined' && 'Notification' in window
            ? `Browser permission: ${Notification.permission}.`
            : 'Browser notifications are not supported here.')}
        </p>
      </section>

      <section
        className="rounded-3xl p-6 mb-6"
        style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
      >
        <p className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: '#ef4444' }}>
          Saved data
        </p>
        <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>
          Permanently remove all {totalTasks} saved tasks and study sessions from this device.
        </p>
        <button
          onClick={() => {
            if (window.confirm('Delete all saved tasks and study sessions? This cannot be undone.')) {
              clearSavedData();
            }
          }}
          className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
          style={{ background: '#dc2626' }}
        >Delete saved data</button>
      </section>

      <section
        className="rounded-3xl p-6 mb-6"
        style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
      >
        <p className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: theme.accent3 }}>
          Cursor
        </p>
        <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>
          Choose a pointer effect. It is saved on this device.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {CURSOR_OPTIONS.map((option) => {
            const selected = cursorStyle === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setCursorStyle(option.id)}
                aria-pressed={selected}
                className="rounded-2xl p-4 text-left transition-all"
                style={{
                  background: selected ? `${theme.accent1}18` : `${theme.textPrimary}05`,
                  border: `1px solid ${selected ? theme.accent1 : theme.cardBorder}`,
                  boxShadow: selected ? `0 0 18px ${theme.accent1}20` : 'none',
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">{option.icon}</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{option.label}</p>
                    <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>{option.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= THEME ================= */}
      <section
        className="rounded-3xl p-6 mb-6"
        style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
        }}
      >

        <p
          className="text-xs font-bold tracking-[0.2em] uppercase mb-5"
          style={{ color: theme.accent2 }}
        >
          Appearance
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* DARK MODE */}
          <button
            onClick={() => setTheme('dark')}
            className="relative rounded-2xl overflow-hidden text-left transition-all duration-300"
            style={{
              border:
                theme.id === 'dark'
                  ? '2px solid #8b5cf6'
                  : '2px solid rgba(139,92,246,0.15)',

              boxShadow:
                theme.id === 'dark'
                  ? '0 0 25px rgba(139,92,246,0.35)'
                  : 'none',
            }}
          >
            <div
              className="h-28"
              style={{
                background:
                  'linear-gradient(135deg,#07071a,#24104f,#111827)',
              }}
            />

            <div
              className="p-4"
              style={{
                background:
                  'rgba(255,255,255,0.04)',
              }}
            >
              <div className="flex items-center gap-3">

                <span className="text-2xl">
                  🌌
                </span>

                <div>
                  <h3 className="font-bold">
                    Dark Mode
                  </h3>

                  <p
                    className="text-xs"
                    style={{
                      color: theme.textSecondary,
                    }}
                  >
                    Dark neon interface
                  </p>
                </div>

              </div>
            </div>

            {theme.id === 'dark' && (
              <span
                className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                style={{
                  background: '#8b5cf6',
                }}
              >
                ✓
              </span>
            )}
          </button>

          {/* LIGHT MODE */}
          <button
            onClick={() => setTheme('light')}
            className="relative rounded-2xl overflow-hidden text-left transition-all duration-300"
            style={{
              border:
                theme.id === 'light'
                  ? '2px solid #ec4899'
                  : '2px solid rgba(139,92,246,0.15)',

              boxShadow:
                theme.id === 'light'
                  ? '0 0 25px rgba(236,72,153,0.3)'
                  : 'none',
            }}
          >
            <div
              className="h-28"
              style={{
                background:
                  'linear-gradient(135deg,#ffffff,#eef2ff,#fce7f3)',
              }}
            />

            <div
              className="p-4"
              style={{
                background:
                  'rgba(255,255,255,0.7)',
              }}
            >
              <div className="flex items-center gap-3">

                <span className="text-2xl">
                  ☀️
                </span>

                <div>
                  <h3 className="font-bold">
                    Light Mode
                  </h3>

                  <p
                    className="text-xs"
                    style={{
                      color: theme.textSecondary,
                    }}
                  >
                    Clean bright interface
                  </p>
                </div>

              </div>
            </div>

            {theme.id === 'light' && (
              <span
                className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                style={{
                  background: '#ec4899',
                }}
              >
                ✓
              </span>
            )}
          </button>

          {/* GALAXY */}
          <button
            onClick={() => setTheme('galaxy')}
            className="relative rounded-2xl overflow-hidden text-left transition-all duration-300"
            style={{
              border: theme.id === 'galaxy' ? '2px solid #a78bfa' : '2px solid rgba(167,139,250,0.15)',
              boxShadow: theme.id === 'galaxy' ? '0 0 25px rgba(167,139,250,0.35)' : 'none',
            }}
          >
            <div className="h-28" style={{ background: themes.galaxy.bg }} />
            <div className="p-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌌</span>
                <div>
                  <h3 className="font-bold">Galaxy</h3>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>A glowing deep space starfield</p>
                </div>
              </div>
            </div>
            {theme.id === 'galaxy' && (
              <span className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ background: '#8b5cf6' }}>✓</span>
            )}
          </button>

        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section
        className="rounded-3xl p-6"
        style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
        }}
      >

        <p
          className="text-xs font-bold tracking-[0.2em] uppercase mb-5"
          style={{ color: theme.accent3 }}
        >
          About
        </p>

        <div className="flex items-center gap-4">

          <img
            src="/todo-logo.png"
            alt="Todo - GxAniket (Owner)"
            className="h-12 sm:h-14 w-auto max-w-[220px] object-contain flex-shrink-0"
          />

          <div>
            <h2 className="text-xl font-bold">
              Todo - GxAniket (Owner)
            </h2>

            <p
              className="text-sm"
              style={{
                color: theme.textSecondary,
              }}
            >
              Todo Application version - 2.5
            </p>
            <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
              © 2026 - 2027 Aniket Sundriyal. All rights reserved.
            </p>
          </div>

        </div>

      </section>

      <section
        className="rounded-3xl p-6 mt-6"
        style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
        }}
      >
        <p
          className="text-xs font-bold tracking-[0.2em] uppercase mb-2"
          style={{ color: theme.accent1 }}
        >
          Contact
        </p>
        <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>
          Visit my portfolio to see my work and get in touch.
        </p>
        <a
          href="https://aniket-portfolio-react.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-transform hover:scale-[1.02]"
          style={{ background: `${theme.accent1}18`, color: theme.accent1 }}
        >
          Visit portfolio <span aria-hidden="true">↗</span>
        </a>
      </section>

    </div>
  );
}
