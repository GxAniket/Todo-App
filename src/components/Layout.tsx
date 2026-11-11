import { useState } from 'react';
import { useApp } from '../App';
import { formatLocalDate } from '../utils/date';
import type { NavItem } from '../types';
import HomeView from './HomeView';
import TodayView from './TodayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import StudyView from './StudyView';
import SettingsView from './SettingsView';
import CreateTaskModal from './CreateTaskModal';
import Galaxy from './Galaxy';
import CursorEffects from './CursorEffects';

const navIconMap: Record<NavItem, string> = {
  home: '🏠', today: '📅', week: '📆', month: '🗓️',
  study: '📚', important: '⭐', completed: '✅', trash: '🗑️', settings: '⚙️',
};

const navItems: { id: NavItem; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'study', label: 'Study' },
  { id: 'important', label: 'Important' },
  { id: 'completed', label: 'Completed' },
  { id: 'trash', label: 'Trash' },
  { id: 'settings', label: 'Settings' },
];

const mobileNavItems: NavItem[] = ['home', 'today', 'week', 'study', 'settings'];

export default function Layout() {
  const { theme, activeNav, setActiveNav, userName, profileImage, tasks, showCreateModal, setShowCreateModal, cursorStyle } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const today = new Date();
  const todayStr = formatLocalDate(today);
  const todayTasks = tasks.filter(t => t.date === todayStr && !t.deleted);
  const completedToday = todayTasks.filter(t => t.completed).length;
  const progress = todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0;

  const renderView = () => {
    switch (activeNav) {
      case 'home': return <HomeView />;
      case 'today': return <TodayView />;
      case 'week': return <WeekView />;
      case 'month': return <MonthView />;
      case 'study': return <StudyView />;
      case 'important': return <TodayView filterImportant />;
      case 'completed': return <TodayView filterCompleted />;
      case 'trash': return <TodayView filterTrash />;
      case 'settings': return <SettingsView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className={`relative isolate flex h-full overflow-hidden ${cursorStyle === 'gyroscope' ? 'custom-cursor-enabled' : ''}`} style={{ background: theme.bg, color: theme.textPrimary, fontFamily: 'Outfit, sans-serif' }}>
      {theme.id === 'galaxy' && (
        <Galaxy
          className="galaxy-background"
          style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
          density={1}
          glowIntensity={0.3}
          flareIntensity={1}
          starSpeed={0.5}
          mouseRepulsion
          clickWarp
          starColors={[]}
          hueShift={140}
          saturation={0}
          starSize={1}
          twinkleIntensity={0.7}
          speed={1.8}
          rotationSpeed={0.1}
          layers={4}
          direction="forward"
          repulsionStrength={2}
          mouseInteraction
          intro={false}
          lightMode={false}
        />
      )}
      <CursorEffects style={cursorStyle} />
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 flex flex-col h-full transition-all duration-300 flex-shrink-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'w-[72px]' : 'w-64'}`}
        style={{
          background: theme.sidebarBg,
          borderRight: `1px solid ${theme.cardBorder}`,
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b flex-shrink-0" style={{ borderColor: theme.cardBorder }}>
          {collapsed ? (
            <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0" style={{ boxShadow: theme.glow }}>
              <img src="/todo-logo.png" alt="Todo" className="w-full h-full object-cover object-left" />
            </div>
          ) : (
            <img
              src="/todo-logo.png"
              alt="Todo"
              className="h-8 md:h-9 w-auto max-w-[170px] object-contain flex-shrink-0"
            />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto opacity-30 hover:opacity-60 transition-opacity text-sm hidden md:block flex-shrink-0"
            style={{ color: theme.textSecondary }}
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* User */}
        {!collapsed && (
          <div className="px-4 py-4 border-b flex-shrink-0" style={{ borderColor: theme.cardBorder }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: `linear-gradient(135deg,${theme.accent1},${theme.accent2})`, overflow: 'hidden' }}>
                {profileImage ? (
                  <img src={profileImage} alt={`${userName}'s profile`} className="w-full h-full object-cover" />
                ) : userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: theme.textPrimary }}>{userName}</p>
                <p className="text-xs" style={{ color: theme.textSecondary }}>{completedToday}/{todayTasks.length} done today</p>
              </div>
            </div>
            {/* Mini progress bar */}
            {todayTasks.length > 0 && (
              <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: `${theme.accent1}18` }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progress}%`, background: `linear-gradient(90deg,${theme.accent1},${theme.accent2})` }} />
              </div>
            )}
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          {navItems.map(item => {
            const isActive = activeNav === item.id;
            const todayCount = item.id === 'today' ? todayTasks.length : 0;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveNav(item.id); setMobileOpen(false); }}
                className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${collapsed ? 'justify-center' : ''}`}
                style={{
                  background: isActive ? `linear-gradient(135deg,${theme.accent1}20,${theme.accent2}12)` : 'transparent',
                  color: isActive ? theme.accent1 : theme.textSecondary,
                  border: `1px solid ${isActive ? theme.accent1 + '30' : 'transparent'}`,
                  boxShadow: isActive ? `0 0 12px ${theme.accent1}18` : 'none',
                }}
                title={collapsed ? item.label : undefined}
              >
                <span className="text-base w-5 text-center flex-shrink-0">{navIconMap[item.id]}</span>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {todayCount > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-mono"
                        style={{ background: `${theme.accent1}20`, color: theme.accent1 }}>
                        {todayCount}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Create task */}
        <div className="p-3 border-t flex-shrink-0" style={{ borderColor: theme.cardBorder }}>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all duration-300"
            style={{
              background: `linear-gradient(135deg,${theme.accent1},${theme.accent2})`,
              boxShadow: theme.glow,
            }}
          >
            {collapsed ? '+' : '+ Create Task'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-4 px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: theme.cardBorder, background: theme.sidebarBg, backdropFilter: 'blur(12px)' }}>
          <button className="md:hidden text-xl" style={{ color: theme.textSecondary }} onClick={() => setMobileOpen(true)}>
            ☰
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: theme.accent1 }}>
              {today.toLocaleDateString('en-US', { weekday: 'long' })}
            </p>
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              {today.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {todayTasks.length > 0 && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: `${theme.accent1}18` }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${progress}%`, background: `linear-gradient(90deg,${theme.accent1},${theme.accent2})` }} />
                </div>
                <span className="text-xs font-mono" style={{ color: theme.textSecondary }}>{Math.round(progress)}%</span>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {renderView()}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden flex items-center justify-around px-2 py-2 z-20"
        style={{ background: theme.sidebarBg, borderTop: `1px solid ${theme.cardBorder}`, backdropFilter: 'blur(20px)' }}>
        {mobileNavItems.map(id => (
          <button
            key={id}
            onClick={() => setActiveNav(id)}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all"
            style={{ color: activeNav === id ? theme.accent1 : theme.textSecondary }}
          >
            <span className="text-xl">{navIconMap[id]}</span>
            <span className="text-[10px] font-medium capitalize">{id}</span>
          </button>
        ))}
      </nav>

      {showCreateModal && <CreateTaskModal />}
    </div>
  );
}
