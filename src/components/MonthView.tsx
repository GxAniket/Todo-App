import { useState } from 'react';
import { useApp } from '../App';
import type { Task } from '../types';
import { formatLocalDate } from '../utils/date';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEK_DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const PRIORITY_COLORS: Record<string, string> = {
  low: '#10b981', medium: '#f59e0b', high: '#ef4444',
};

export default function MonthView() {
  const { theme, tasks, updateTask, setShowCreateModal } = useApp();
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDate, setSelectedDate] = useState(formatLocalDate(today));

  const firstDay = new Date(view.year, view.month, 1);
  const lastDay = new Date(view.year, view.month + 1, 0);
  const startOffset = firstDay.getDay();
  const totalCells = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7;

  const cells: (Date | null)[] = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - startOffset + 1;
    if (dayNum >= 1 && dayNum <= lastDay.getDate()) return new Date(view.year, view.month, dayNum);
    return null;
  });

  const todayStr = formatLocalDate(today);
  const selectedTasks = tasks.filter(t => t.date === selectedDate && !t.deleted);

  const prev = () => setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  const next = () => setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });

  return (
    <div className="p-5 md:p-6 animate-fade-in pb-24 md:pb-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
            {MONTHS[view.month]} {view.year}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all"
            style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary }}>‹</button>
          <button onClick={() => setView({ year: today.getFullYear(), month: today.getMonth() })}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            style={{ background: `${theme.accent1}20`, color: theme.accent1 }}>Today</button>
          <button onClick={next} className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all"
            style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary }}>›</button>
          <button onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl text-white font-semibold text-sm ml-1"
            style={{ background: `linear-gradient(135deg,${theme.accent1},${theme.accent2})`, boxShadow: theme.glow }}>
            + Add Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar grid */}
        <div className="lg:col-span-2 glass rounded-2xl p-4" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
          <div className="grid grid-cols-7 mb-1">
            {WEEK_DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-bold tracking-widest uppercase py-2"
                style={{ color: theme.textSecondary }}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((date, i) => {
              if (!date) return <div key={i} className="aspect-square" />;
              const ds = formatLocalDate(date);
              const dt = tasks.filter(t => t.date === ds && !t.deleted);
              const isToday = ds === todayStr;
              const isSelected = ds === selectedDate;
              const isOtherMonth = date.getMonth() !== view.month;

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(ds)}
                  className="rounded-xl p-1.5 flex flex-col items-center transition-all duration-200 aspect-square"
                  style={{
                    background: isSelected
                      ? `linear-gradient(135deg,${theme.accent1}35,${theme.accent2}20)`
                      : isToday ? `${theme.accent1}12` : 'transparent',
                    border: `1px solid ${isSelected ? theme.accent1 + '60' : isToday ? theme.accent1 + '30' : 'transparent'}`,
                    color: isSelected ? theme.accent1 : isToday ? theme.accent1 : isOtherMonth ? `${theme.textSecondary}40` : theme.textPrimary,
                    opacity: isOtherMonth ? 0.4 : 1,
                  }}
                >
                  <span className="text-xs font-bold" style={{ fontFamily: 'Orbitron,monospace' }}>{date.getDate()}</span>
                  {dt.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                      {dt.slice(0, 3).map((t, j) => (
                        <div key={j} className="w-1 h-1 rounded-full" style={{ background: PRIORITY_COLORS[t.priority] }} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day detail */}
        <div className="glass rounded-2xl p-4 flex flex-col" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: theme.accent1 }}>
                {new Date(selectedDate + 'T12:00').toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
              <p className="text-lg font-bold" style={{ color: theme.textPrimary }}>
                {new Date(selectedDate + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <button onClick={() => setShowCreateModal(true)}
              className="text-xs px-2.5 py-1.5 rounded-xl font-semibold"
              style={{ background: `${theme.accent1}20`, color: theme.accent1 }}>
              + Add
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto">
            {selectedTasks.length === 0 ? (
              <div className="text-center py-10">
                <span className="text-3xl">📅</span>
                <p className="text-sm mt-2 font-medium" style={{ color: theme.textSecondary }}>No tasks this day</p>
                <p className="text-xs mt-1" style={{ color: `${theme.textSecondary}70` }}>Click + Add to schedule something</p>
              </div>
            ) : selectedTasks.map(task => (
              <div key={task.id} className="rounded-xl p-3 transition-all"
                style={{
                  background: `${PRIORITY_COLORS[task.priority]}08`,
                  borderLeft: `3px solid ${PRIORITY_COLORS[task.priority]}`,
                  opacity: task.completed ? 0.6 : 1,
                }}>
                <div className="flex items-start gap-2">
                  <button
                    onClick={() => updateTask(task.id, { completed: !task.completed })}
                    className="w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{ borderColor: task.completed ? theme.accent1 : PRIORITY_COLORS[task.priority], background: task.completed ? theme.accent1 : 'transparent' }}>
                    {task.completed && <span className="text-[8px] text-white font-bold">✓</span>}
                  </button>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium ${task.completed ? 'line-through' : ''}`} style={{ color: theme.textPrimary }}>
                      {task.title}
                    </p>
                    {task.time && <p className="text-xs font-mono mt-0.5" style={{ color: theme.textSecondary }}>🕐 {task.time}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedTasks.length > 0 && (
            <div className="mt-3 pt-3 border-t" style={{ borderColor: theme.cardBorder }}>
              <p className="text-xs text-center" style={{ color: theme.textSecondary }}>
                {selectedTasks.filter(t => t.completed).length}/{selectedTasks.length} completed
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
