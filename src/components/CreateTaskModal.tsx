import { useState } from 'react';
import { useApp } from '../App';
import type { Priority } from '../types';
import { formatLocalDate } from '../utils/date';

const PRIORITY_OPTIONS: { id: Priority; label: string; color: string }[] = [
  { id: 'low', label: 'Low', color: '#10b981' },
  { id: 'medium', label: 'Medium', color: '#f59e0b' },
  { id: 'high', label: 'High', color: '#ef4444' },
];

export default function CreateTaskModal() {
  const { theme, addTask, setShowCreateModal } = useApp();

  const todayStr = formatLocalDate(new Date());

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const canCreate = title.trim().length > 0 && date.length > 0;

  const close = () => setShowCreateModal(false);

  const handleCreate = () => {
    if (!canCreate) return;

    addTask({
      title: title.trim(),
      date,
      time,
      priority,
      completed: false,
      deleted: false,
      important: false,
    });

    close();
  };

  const inputStyle = {
    background: theme.cardBg,
    border: `1px solid ${theme.cardBorder}`,
    color: theme.textPrimary,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={close}
    >
      <div
        className="glass w-full max-w-md rounded-3xl p-6 modal-content"
        style={{
          background: theme.sidebarBg,
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: theme.glow,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: theme.textPrimary }}>
            Create Task
          </h2>
          <button
            onClick={close}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all hover:opacity-70"
            style={{ background: `${theme.accent1}12`, color: theme.textSecondary }}
          >
            ✕
          </button>
        </div>

        {/* Task Name */}
        <label
          className="block text-xs font-bold tracking-[0.15em] uppercase mb-2"
          style={{ color: theme.accent1 }}
        >
          Task Name
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you need to do?"
          autoFocus
          className="w-full rounded-xl px-4 py-3 text-sm outline-none mb-4"
          style={inputStyle}
        />

        {/* Date + Time */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label
              className="block text-xs font-bold tracking-[0.15em] uppercase mb-2"
              style={{ color: theme.accent1 }}
            >
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl px-3 py-3 text-sm outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <label
              className="block text-xs font-bold tracking-[0.15em] uppercase mb-2"
              style={{ color: theme.accent1 }}
            >
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-xl px-3 py-3 text-sm outline-none"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Priority */}
        <label
          className="block text-xs font-bold tracking-[0.15em] uppercase mb-2"
          style={{ color: theme.accent1 }}
        >
          Priority
        </label>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {PRIORITY_OPTIONS.map((option) => {
            const isActive = priority === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setPriority(option.id)}
                className="py-2.5 rounded-xl text-sm font-semibold capitalize transition-all"
                style={{
                  background: isActive ? `${option.color}22` : theme.cardBg,
                  border: `1.5px solid ${isActive ? option.color : theme.cardBorder}`,
                  color: isActive ? option.color : theme.textSecondary,
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={close}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: `${theme.accent1}08`,
              border: `1px solid ${theme.cardBorder}`,
              color: theme.textSecondary,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!canCreate}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`,
              boxShadow: canCreate ? theme.glow : 'none',
            }}
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}
