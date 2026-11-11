import { useApp } from '../App';
import type { Task } from '../types';
import { formatLocalDate } from '../utils/date';

const PRIORITY_COLORS: Record<string, string> = {
  low: '#10b981', medium: '#f59e0b', high: '#ef4444',
};

interface Props {
  filterImportant?: boolean;
  filterCompleted?: boolean;
  filterTrash?: boolean;
}

export default function TodayView({ filterImportant, filterCompleted, filterTrash }: Props) {
  const { theme, tasks, updateTask, deleteTask, setShowCreateModal } = useApp();
  const todayStr = formatLocalDate(new Date());

  let filtered: Task[];
  let title: string;
  let subtitle: string;

  if (filterTrash) {
    filtered = tasks.filter(t => t.deleted);
    title = 'Trash'; subtitle = 'Deleted tasks';
  } else if (filterCompleted) {
    filtered = tasks.filter(t => t.completed && !t.deleted);
    title = 'Completed'; subtitle = 'All finished tasks';
  } else if (filterImportant) {
    filtered = tasks.filter(t => t.important && !t.deleted);
    title = 'Important'; subtitle = 'Starred tasks';
  } else {
    filtered = tasks.filter(t => t.date === todayStr && !t.deleted);
    title = "Today's Tasks";
    subtitle = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  const completed = filtered.filter(t => t.completed).length;
  const pending = filtered.filter(t => !t.completed);
  const done = filtered.filter(t => t.completed);

  return (
    <div className="p-5 md:p-6 animate-fade-in pb-24 md:pb-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: theme.textPrimary }}>{title}</h2>
          <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
            {subtitle} · {completed}/{filtered.length} done
          </p>
        </div>
        {!filterTrash && !filterCompleted && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl text-white font-semibold text-sm transition-all flex-shrink-0"
            style={{ background: `linear-gradient(135deg,${theme.accent1},${theme.accent2})`, boxShadow: theme.glow }}
          >
            + Add Task
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="text-6xl mb-4 animate-float">
            {filterTrash ? '🗑️' : filterCompleted ? '🎉' : filterImportant ? '⭐' : '✨'}
          </span>
          <p className="text-lg font-semibold" style={{ color: theme.textPrimary }}>
            {filterTrash ? 'Trash is empty' : filterCompleted ? 'Nothing completed yet' : filterImportant ? 'No important tasks' : 'All clear for today!'}
          </p>
          {!filterTrash && !filterCompleted && !filterImportant && (
            <p className="text-sm mt-2" style={{ color: theme.textSecondary }}>
              Create your first task and crush the day 💪
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {/* Pending tasks */}
          {pending.length > 0 && (
            <div>
              {!filterCompleted && !filterTrash && (
                <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: theme.textSecondary }}>
                  Pending · {pending.length}
                </p>
              )}
              <div className="space-y-2.5">
                {pending.map(task => (
                  <TaskCard key={task.id} task={task} filterTrash={filterTrash} onUpdate={updateTask} onDelete={deleteTask} theme={theme} />
                ))}
              </div>
            </div>
          )}

          {/* Done tasks */}
          {done.length > 0 && !filterTrash && (
            <div>
              <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: theme.textSecondary }}>
                Completed · {done.length}
              </p>
              <div className="space-y-2.5">
                {done.map(task => (
                  <TaskCard key={task.id} task={task} filterTrash={filterTrash} onUpdate={updateTask} onDelete={deleteTask} theme={theme} />
                ))}
              </div>
            </div>
          )}

          {/* Trash items */}
          {filterTrash && filtered.map(task => (
            <TaskCard key={task.id} task={task} filterTrash={filterTrash} onUpdate={updateTask} onDelete={deleteTask} theme={theme} />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, filterTrash, onUpdate, onDelete, theme }: {
  task: Task;
  filterTrash?: boolean;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  theme: any;
}) {
  return (
    <div
      className="glass task-card rounded-2xl p-4 flex items-start gap-4"
      style={{
        background: task.completed ? `${theme.cardBg}70` : theme.cardBg,
        border: `1px solid ${task.important && !task.completed ? theme.accent2 + '35' : theme.cardBorder}`,
        boxShadow: task.completed ? 'none' : task.important ? `0 0 18px ${theme.accent2}18` : theme.glow,
        opacity: task.completed ? 0.75 : 1,
      }}
    >
      {/* Checkbox */}
      {!filterTrash && (
        <button
          onClick={() => onUpdate(task.id, { completed: !task.completed })}
          className="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5 transition-all duration-300"
          style={{
            borderColor: task.completed ? theme.accent1 : PRIORITY_COLORS[task.priority],
            background: task.completed ? theme.accent1 : 'transparent',
            boxShadow: task.completed ? `0 0 10px ${theme.accent1}50` : 'none',
          }}
        >
          {task.completed && <span className="text-xs text-white font-bold">✓</span>}
        </button>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`font-semibold text-sm ${task.completed ? 'line-through' : ''}`}
            style={{ color: task.completed ? theme.textSecondary : theme.textPrimary }}>
            {task.title}
          </p>
          {task.important && <span className="text-sm">⭐</span>}
        </div>
        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold capitalize"
            style={{ background: `${PRIORITY_COLORS[task.priority]}18`, color: PRIORITY_COLORS[task.priority] }}>
            {task.priority}
          </span>
          {task.time && (
            <span className="text-xs font-mono" style={{ color: theme.textSecondary }}>🕐 {task.time}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        {!filterTrash && (
          <button
            onClick={() => onUpdate(task.id, { important: !task.important })}
            className="text-sm transition-all"
            style={{ opacity: task.important ? 1 : 0.25, filter: task.important ? `drop-shadow(0 0 4px ${theme.accent2})` : 'none' }}
          >
            ⭐
          </button>
        )}
        <button
          onClick={() => filterTrash ? onUpdate(task.id, { deleted: false }) : onDelete(task.id)}
          className="text-sm transition-all opacity-30 hover:opacity-90"
          style={{ color: filterTrash ? theme.accent3 : '#ef4444' }}
          title={filterTrash ? 'Restore' : 'Delete'}
        >
          {filterTrash ? '↩️' : '🗑️'}
        </button>
        {filterTrash && (
          <button
            onClick={() => onUpdate(task.id, { deleted: false, completed: false })}
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ background: `${theme.accent1}18`, color: theme.accent1 }}
          >
            restore
          </button>
        )}
      </div>
    </div>
  );
}
