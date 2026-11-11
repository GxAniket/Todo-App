import { useApp } from '../App';
import { formatLocalDate } from '../utils/date';

const PRIORITY_COLORS: Record<string, string> = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
};

export default function HomeView() {
  const {
    theme,
    userName,
    tasks,
    setActiveNav,
  } = useApp();

  const today = new Date();

  const todayStr = formatLocalDate(today);

  // =========================
  // TODAY TASKS
  // =========================

  const todayTasks = tasks.filter(
    (task) =>
      task.date === todayStr &&
      !task.deleted
  );

  const completedToday =
    todayTasks.filter(
      (task) => task.completed
    ).length;

  const remainingToday =
    Math.max(
      todayTasks.length -
        completedToday,
      0
    );

  const progress =
    todayTasks.length > 0
      ? Math.round(
          (completedToday /
            todayTasks.length) *
            100
        )
      : 0;

  // =========================
  // ALL COMPLETED TASKS
  // =========================

  const totalDone = tasks.filter(
    (task) =>
      task.completed &&
      !task.deleted
  ).length;

  // =========================
  // UPCOMING TASKS
  // =========================

  const upcomingTasks = tasks
    .filter(
      (task) =>
        !task.completed &&
        !task.deleted &&
        task.date >= todayStr
    )
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        (a.time || '').localeCompare(
          b.time || ''
        )
    )
    .slice(0, 6);

  // =========================
  // GREETING
  // =========================

  const hour = today.getHours();

  const greeting =
    hour < 12
      ? 'Good Morning'
      : hour < 17
      ? 'Good Afternoon'
      : 'Good Evening';

  // =========================
  // CARD
  // =========================

  const cardStyle = {
    background: theme.cardBg,
    border: `1px solid ${theme.cardBorder}`,
    boxShadow: theme.glow,
  };

  return (
    <div className="p-5 md:p-6 pb-24 md:pb-6 animate-fade-in">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex items-start justify-between mb-6">

        <div>

          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{
              color: theme.textPrimary,
            }}
          >
            {greeting},{' '}

            <span
              style={{
                background:
                  theme.gradientText,

                WebkitBackgroundClip:
                  'text',

                WebkitTextFillColor:
                  'transparent',

                backgroundClip:
                  'text',
              }}
            >
              {userName}!
            </span>
          </h1>

          <p
            className="text-sm mt-1"
            style={{
              color:
                theme.textSecondary,
            }}
          >
            {today.toLocaleDateString(
              'en-US',
              {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              }
            )}
          </p>

        </div>

        <div
          className="text-3xl hidden sm:block"
          title={
            theme.id === 'dark'
              ? 'Dark Mode'
              : 'Light Mode'
          }
        >
          {theme.id === 'dark'
            ? '🌌'
            : '☀️'}
        </div>

      </div>

      {/* ================================================= */}
      {/* STATISTICS */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">

        {/* TASKS DONE */}
        <div
          className="rounded-2xl p-5"
          style={cardStyle}
        >

          <div className="flex justify-between items-center mb-4">

            <span className="text-xl">
              ✅
            </span>

            <span
              className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full"
              style={{
                color:
                  theme.accent1,
                background:
                  `${theme.accent1}15`,
              }}
            >
              Live
            </span>

          </div>

          <p
            className="text-3xl font-bold"
            style={{
              color:
                theme.textPrimary,
              fontFamily:
                'Orbitron, monospace',
            }}
          >
            {totalDone}
          </p>

          <p
            className="text-xs mt-1"
            style={{
              color:
                theme.textSecondary,
            }}
          >
            Tasks Done
          </p>

        </div>

        {/* TODAY'S PROGRESS */}
        <div
          className="rounded-2xl p-5"
          style={cardStyle}
        >

          <div className="flex justify-between items-center mb-4">

            <span className="text-xl">
              📅
            </span>

            <span
              className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full"
              style={{
                color:
                  theme.accent2,
                background:
                  `${theme.accent2}15`,
              }}
            >
              Live
            </span>

          </div>

          <p
            className="text-3xl font-bold"
            style={{
              color:
                theme.textPrimary,
              fontFamily:
                'Orbitron, monospace',
            }}
          >
            {completedToday}/
            {todayTasks.length}
          </p>

          <p
            className="text-xs mt-1"
            style={{
              color:
                theme.textSecondary,
            }}
          >
            Today's Progress
          </p>

        </div>

        {/* REMAINING */}
        <div
          className="rounded-2xl p-5"
          style={cardStyle}
        >

          <div className="flex justify-between items-center mb-4">

            <span className="text-xl">
              📝
            </span>

            <span
              className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full"
              style={{
                color:
                  theme.accent3,
                background:
                  `${theme.accent3}15`,
              }}
            >
              Live
            </span>

          </div>

          <p
            className="text-3xl font-bold"
            style={{
              color:
                theme.textPrimary,
              fontFamily:
                'Orbitron, monospace',
            }}
          >
            {remainingToday}
          </p>

          <p
            className="text-xs mt-1"
            style={{
              color:
                theme.textSecondary,
            }}
          >
            Remaining Tasks
          </p>

        </div>

      </div>

      {/* ================================================= */}
      {/* PROGRESS + UPCOMING */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">

        {/* ================= PROGRESS ================= */}

        <div
          className="rounded-2xl p-6 lg:col-span-2"
          style={cardStyle}
        >

          <h2
            className="text-xs font-bold tracking-[0.2em] uppercase mb-6"
            style={{
              color:
                theme.accent1,
            }}
          >
            Today's Progress
          </h2>

          <div className="flex items-center gap-6">

            {/* CIRCLE */}
            <div className="relative w-32 h-32 flex-shrink-0">

              <svg
                width="128"
                height="128"
                className="-rotate-90"
              >

                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  fill="none"
                  stroke={`${theme.accent1}15`}
                  strokeWidth="10"
                />

                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  fill="none"
                  stroke={theme.accent1}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={
                    2 * Math.PI * 54
                  }
                  strokeDashoffset={
                    2 *
                      Math.PI *
                      54 *
                      (1 -
                        progress /
                          100)
                  }
                  style={{
                    transition:
                      'stroke-dashoffset 0.6s ease',
                    filter:
                      `drop-shadow(0 0 6px ${theme.accent1})`,
                  }}
                />

              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">

                <span
                  className="text-2xl font-bold"
                  style={{
                    color:
                      theme.textPrimary,
                    fontFamily:
                      'Orbitron, monospace',
                  }}
                >
                  {progress}%
                </span>

                <span
                  className="text-[10px]"
                  style={{
                    color:
                      theme.textSecondary,
                  }}
                >
                  done
                </span>

              </div>

            </div>

            {/* BARS */}
            <div className="flex-1 space-y-5">

              {/* COMPLETED */}
              <div>

                <div className="flex justify-between text-xs mb-2">

                  <span
                    style={{
                      color:
                        theme.textSecondary,
                    }}
                  >
                    Completed
                  </span>

                  <span
                    style={{
                      color:
                        theme.accent1,
                    }}
                  >
                    {completedToday}
                  </span>

                </div>

                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{
                    background:
                      `${theme.accent1}12`,
                  }}
                >

                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      background:
                        theme.accent1,
                    }}
                  />

                </div>

              </div>

              {/* REMAINING */}
              <div>

                <div className="flex justify-between text-xs mb-2">

                  <span
                    style={{
                      color:
                        theme.textSecondary,
                    }}
                  >
                    Remaining
                  </span>

                  <span
                    style={{
                      color:
                        theme.accent2,
                    }}
                  >
                    {remainingToday}
                  </span>

                </div>

                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{
                    background:
                      `${theme.accent2}12`,
                  }}
                >

                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        todayTasks.length > 0
                          ? Math.round(
                              (remainingToday /
                                todayTasks.length) *
                                100
                            )
                          : 0
                      }%`,

                      background:
                        theme.accent2,
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* EMPTY MESSAGE */}
          {todayTasks.length === 0 && (
            <div
              className="mt-5 p-3 rounded-xl text-center"
              style={{
                background:
                  `${theme.accent1}06`,
                border:
                  `1px solid ${theme.cardBorder}`,
              }}
            >
              <p
                className="text-xs"
                style={{
                  color:
                    theme.textSecondary,
                }}
              >
                No tasks for today.
                Create your first task.
              </p>
            </div>
          )}

        </div>

        {/* ================= UPCOMING ================= */}

        <div
          className="rounded-2xl p-6 lg:col-span-3"
          style={cardStyle}
        >

          <div className="flex justify-between items-center mb-5">

            <h2
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{
                color:
                  theme.accent2,
              }}
            >
              Upcoming Tasks
            </h2>

            <button
              onClick={() =>
                setActiveNav('today')
              }
              className="text-xs font-semibold hover:opacity-70"
              style={{
                color:
                  theme.accent2,
              }}
            >
              View all →
            </button>

          </div>

          {upcomingTasks.length === 0 ? (

            <div className="flex flex-col items-center justify-center py-10">

              <div className="text-4xl mb-3">
                🎉
              </div>

              <p
                className="text-sm font-medium"
                style={{
                  color:
                    theme.textSecondary,
                }}
              >
                No upcoming tasks
              </p>

              <p
                className="text-xs mt-1"
                style={{
                  color:
                    theme.textSecondary,
                }}
              >
                You're all caught up.
              </p>

            </div>

          ) : (

            <div className="space-y-2">

              {upcomingTasks.map(
                (task) => {

                  const priorityColor =
                    PRIORITY_COLORS[
                      task.priority
                    ] ||
                    theme.accent1;

                  return (
                    <button
                      key={task.id}
                      onClick={() =>
                        setActiveNav(
                          'today'
                        )
                      }
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:scale-[1.01]"
                      style={{
                        background:
                          `${theme.accent1}05`,
                        border:
                          `1px solid ${theme.cardBorder}`,
                      }}
                    >

                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{
                          background:
                            priorityColor,
                          boxShadow:
                            `0 0 7px ${priorityColor}`,
                        }}
                      />

                      <div className="flex-1 min-w-0">

                        <p
                          className="text-sm font-semibold truncate"
                          style={{
                            color:
                              theme.textPrimary,
                          }}
                        >
                          {task.title}
                        </p>

                        <p
                          className="text-xs mt-0.5"
                          style={{
                            color:
                              theme.textSecondary,
                          }}
                        >
                          {task.date ===
                          todayStr
                            ? 'Today'
                            : new Date(
                                `${task.date}T00:00`
                              ).toLocaleDateString(
                                'en-US',
                                {
                                  month:
                                    'short',
                                  day:
                                    'numeric',
                                }
                              )}

                          {task.time
                            ? ` · ${task.time}`
                            : ''}
                        </p>

                      </div>

                      <span
                        className="text-[10px] font-semibold capitalize px-2 py-1 rounded-full"
                        style={{
                          color:
                            priorityColor,
                          background:
                            `${priorityColor}15`,
                        }}
                      >
                        {task.priority}
                      </span>

                    </button>
                  );
                }
              )}

            </div>

          )}

        </div>

      </div>

      {/* ================================================= */}
      {/* QUICK PLANNERS */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* TODAY */}
        <button
          onClick={() =>
            setActiveNav('today')
          }
          className="rounded-2xl p-5 text-left transition-all hover:-translate-y-1"
          style={{
            background:
              `${theme.accent1}08`,
            border:
              `1px solid ${theme.accent1}30`,
          }}
        >

          <div className="text-2xl mb-3">
            📅
          </div>

          <p
            className="font-bold"
            style={{
              color:
                theme.textPrimary,
            }}
          >
            Plan Today
          </p>

          <p
            className="text-xs mt-1"
            style={{
              color:
                theme.accent1,
            }}
          >
            Open →
          </p>

        </button>

        {/* WEEK */}
        <button
          onClick={() =>
            setActiveNav('week')
          }
          className="rounded-2xl p-5 text-left transition-all hover:-translate-y-1"
          style={{
            background:
              `${theme.accent2}08`,
            border:
              `1px solid ${theme.accent2}30`,
          }}
        >

          <div className="text-2xl mb-3">
            📆
          </div>

          <p
            className="font-bold"
            style={{
              color:
                theme.textPrimary,
            }}
          >
            Plan My Week
          </p>

          <p
            className="text-xs mt-1"
            style={{
              color:
                theme.accent2,
            }}
          >
            Open →
          </p>

        </button>

        {/* MONTH */}
        <button
          onClick={() =>
            setActiveNav('month')
          }
          className="rounded-2xl p-5 text-left transition-all hover:-translate-y-1"
          style={{
            background:
              `${theme.accent3}08`,
            border:
              `1px solid ${theme.accent3}30`,
          }}
        >

          <div className="text-2xl mb-3">
            🗓️
          </div>

          <p
            className="font-bold"
            style={{
              color:
                theme.textPrimary,
            }}
          >
            Plan My Month
          </p>

          <p
            className="text-xs mt-1"
            style={{
              color:
                theme.accent3,
            }}
          >
            Open →
          </p>

        </button>

        {/* STUDY */}
        <button
          onClick={() =>
            setActiveNav('study')
          }
          className="rounded-2xl p-5 text-left transition-all hover:-translate-y-1"
          style={{
            background:
              '#10b98108',
            border:
              '1px solid #10b98130',
          }}
        >

          <div className="text-2xl mb-3">
            📚
          </div>

          <p
            className="font-bold"
            style={{
              color:
                theme.textPrimary,
            }}
          >
            Mid Exam Final
          </p>

          <p
            className="text-xs mt-1"
            style={{
              color:
                '#10b981',
            }}
          >
            Open →
          </p>

        </button>

      </div>

    </div>
  );
}
