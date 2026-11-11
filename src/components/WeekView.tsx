import { useApp } from '../App';
import { formatLocalDate } from '../utils/date';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const PRIORITY_COLORS: Record<string, string> = {
  low: '#10b981', medium: '#f59e0b', high: '#ef4444',
};

function getWeekDates(): Date[] {
  const today = new Date();
  const day = today.getDay(); // 0=Sun
  const offset = day === 0 ? -6 : 1 - day;
  return DAY_LABELS.map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset + i);
    return d;
  });
}

export default function WeekView() {
  const { theme, tasks, updateTask, setShowCreateModal } = useApp();
  const weekDates = getWeekDates();
  const todayStr = formatLocalDate(new Date());

  return (
    <div className="p-5 md:p-6 animate-fade-in pb-24 md:pb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: theme.textPrimary }}>This Week</h2>
          <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
            {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
            {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl text-white font-semibold text-sm transition-all"
          style={{ background: `linear-gradient(135deg,${theme.accent1},${theme.accent2})`, boxShadow: theme.glow }}
        >
          + Add Task
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {weekDates.map((date, idx) => {
          const dateStr = formatLocalDate(date);
          const dayTasks = tasks.filter(t => t.date === dateStr && !t.deleted);
          const isToday = dateStr === todayStr;
          const isWeekend = idx >= 5;

          return (
            <div
              key={idx}
              className="glass rounded-2xl p-3 min-h-[200px] transition-all"
              style={{
                background: isToday ? `${theme.accent1}0c` : isWeekend ? `${theme.accent2}05` : theme.cardBg,
                border: `1px solid ${isToday ? theme.accent1 + '50' : theme.cardBorder}`,
                boxShadow: isToday ? theme.glow : 'none',
              }}
            >
              {/* Day header */}
              <div className="text-center mb-3 pb-3 border-b" style={{ borderColor: theme.cardBorder }}>
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-1"
                  style={{ color: isToday ? theme.accent1 : isWeekend ? theme.accent2 : theme.textSecondary }}>
                  {DAY_LABELS[idx]}
                </p>
                <p className="text-xl font-bold" style={{ color: isToday ? theme.accent1 : theme.textPrimary, fontFamily: 'Orbitron,monospace' }}>
                  {date.getDate()}
                </p>
                {isToday && (
                  <div className="w-1.5 h-1.5 rounded-full mx-auto mt-1.5" style={{ background: theme.accent1, boxShadow: `0 0 6px ${theme.accent1}` }} />
                )}
              </div>

              {/* Tasks */}
              <div className="space-y-1.5">
                {dayTasks.map(task => (
                  <div
                    key={task.id}
                    className="rounded-lg px-2 py-1.5 cursor-pointer transition-all"
                    style={{
                      background: `${PRIORITY_COLORS[task.priority]}12`,
                      borderLeft: `2.5px solid ${PRIORITY_COLORS[task.priority]}`,
                      opacity: task.completed ? 0.55 : 1,
                    }}
                    onClick={() => updateTask(task.id, { completed: !task.completed })}
                  >
                    <p className={`text-xs font-medium truncate leading-tight ${task.completed ? 'line-through' : ''}`}
                      style={{ color: theme.textPrimary }}>
                      {task.title}
                    </p>
                    {task.time && (
                      <p className="text-[10px] mt-0.5 font-mono" style={{ color: theme.textSecondary }}>{task.time}</p>
                    )}
                  </div>
                ))}
                {dayTasks.length === 0 && (
                  <p className="text-[11px] text-center py-3 select-none" style={{ color: `${theme.textSecondary}50` }}>
                    Free day
                  </p>
                )}
              </div>

              {/* Summary dot */}
              {dayTasks.length > 0 && (
                <div className="mt-2 pt-2 border-t flex items-center justify-between" style={{ borderColor: theme.cardBorder }}>
                  <span className="text-[10px]" style={{ color: theme.textSecondary }}>
                    {dayTasks.filter(t => t.completed).length}/{dayTasks.length}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: theme.accent1 }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
