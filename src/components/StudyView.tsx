import { useState } from 'react';
import { useApp } from '../App';
import type { TimerMode } from '../types';

interface Goal {
  id: string;
  chapter: string;
  subject: string;
  completed: boolean;
}

const DEFAULT_TIMES: Record<TimerMode, number> = {
  focus: 25,
  short: 5,
  long: 15,
};

export default function StudyView() {
  const {
    theme,
    timerMode,
    setTimerMode,
    customMinutes,
    setCustomMinutes,
    secondsLeft,
    setSecondsLeft,
    isRunning,
    setIsRunning,
    sessionsCompleted,
  } = useApp();

  // =====================================================
  // POMODORO
  // =====================================================

  // =====================================================
  // TODAY'S GOALS
  // =====================================================

  const [goals, setGoals] =
    useState<Goal[]>([]);

  const [showAddChapter, setShowAddChapter] =
    useState(false);

  const [chapter, setChapter] =
    useState('');

  const [subject, setSubject] =
    useState('');

  // =====================================================
  // CHANGE TIMER MODE
  // =====================================================

  const changeTimerMode = (
    mode: TimerMode
  ) => {
    setIsRunning(false);

    setTimerMode(mode);

    const minutes =
      DEFAULT_TIMES[mode];

    setCustomMinutes(minutes);

    setSecondsLeft(minutes * 60);
  };

  // =====================================================
  // ADJUST TIME
  // =====================================================

  const adjustTime = (
    amount: number
  ) => {
    setIsRunning(false);

    setCustomMinutes((previous) => {
      const next = Math.min(
        120,
        Math.max(1, previous + amount)
      );

      setSecondsLeft(next * 60);

      return next;
    });
  };

  // =====================================================
  // DIRECT TIME INPUT
  // =====================================================

  const setDirectTime = (
    value: string
  ) => {
    const number = Number(value);

    if (
      Number.isNaN(number) ||
      number < 1 ||
      number > 120
    ) {
      return;
    }

    setIsRunning(false);

    setCustomMinutes(number);

    setSecondsLeft(number * 60);
  };

  // =====================================================
  // RESET TIMER
  // =====================================================

  const resetTimer = () => {
    setIsRunning(false);

    setSecondsLeft(
      customMinutes * 60
    );
  };

  // =====================================================
  // NEXT TIMER
  // =====================================================

  const nextTimer = () => {
    if (timerMode === 'focus') {
      changeTimerMode('short');
    } else if (
      timerMode === 'short'
    ) {
      changeTimerMode('long');
    } else {
      changeTimerMode('focus');
    }
  };

  // =====================================================
  // ADD CHAPTER
  // =====================================================

  const addChapter = () => {
    const cleanChapter =
      chapter.trim();

    const cleanSubject =
      subject.trim();

    if (!cleanChapter) return;

    setGoals((previous) => [
      ...previous,
      {
        id: Date.now().toString(),
        chapter: cleanChapter,
        subject:
          cleanSubject || 'General',
        completed: false,
      },
    ]);

    setChapter('');
    setSubject('');
    setShowAddChapter(false);
  };

  // =====================================================
  // TOGGLE GOAL
  // =====================================================

  const toggleGoal = (
    id: string
  ) => {
    setGoals((previous) =>
      previous.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              completed:
                !goal.completed,
            }
          : goal
      )
    );
  };

  // =====================================================
  // FORMAT TIMER
  // =====================================================

  const minutes = Math.floor(
    secondsLeft / 60
  )
    .toString()
    .padStart(2, '0');

  const seconds = (
    secondsLeft % 60
  )
    .toString()
    .padStart(2, '0');

  // =====================================================
  // GOAL STATS
  // =====================================================

  const completedGoals =
    goals.filter(
      (goal) => goal.completed
    ).length;

  // =====================================================
  // CARD STYLE
  // =====================================================

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

      <div className="mb-6">

        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{
            color: theme.textPrimary,
          }}
        >
          Mid Exam Final
        </h1>

        <p
          className="text-sm mt-1"
          style={{
            color: theme.textSecondary,
          }}
        >
          {sessionsCompleted} focus session
          {sessionsCompleted !== 1
            ? 's'
            : ''}{' '}
          completed today
        </p>

      </div>

      {/* ================================================= */}
      {/* MAIN GRID */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* ================================================= */}
        {/* POMODORO TIMER */}
        {/* ================================================= */}

        <div
          className="rounded-3xl p-6 lg:col-span-2"
          style={cardStyle}
        >

          <h2
            className="text-xs font-bold tracking-[0.2em] uppercase text-center mb-5"
            style={{
              color: theme.accent1,
            }}
          >
            Pomodoro Timer
          </h2>

          {/* TIMER MODES */}
          <div
            className="flex rounded-xl p-1 mb-7"
            style={{
              background:
                `${theme.accent1}08`,
              border:
                `1px solid ${theme.cardBorder}`,
            }}
          >

            <button
              onClick={() =>
                changeTimerMode('focus')
              }
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background:
                  timerMode === 'focus'
                    ? theme.accent1
                    : 'transparent',

                color:
                  timerMode === 'focus'
                    ? '#fff'
                    : theme.textSecondary,
              }}
            >
              🎯 Focus
            </button>

            <button
              onClick={() =>
                changeTimerMode('short')
              }
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background:
                  timerMode === 'short'
                    ? theme.accent1
                    : 'transparent',

                color:
                  timerMode === 'short'
                    ? '#fff'
                    : theme.textSecondary,
              }}
            >
              ☕ Short
            </button>

            <button
              onClick={() =>
                changeTimerMode('long')
              }
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background:
                  timerMode === 'long'
                    ? theme.accent1
                    : 'transparent',

                color:
                  timerMode === 'long'
                    ? '#fff'
                    : theme.textSecondary,
              }}
            >
              🛌 Long
            </button>

          </div>

          {/* TIMER CIRCLE */}
          <div className="flex justify-center mb-6">

            <div
              className="w-44 h-44 rounded-full flex items-center justify-center"
              style={{
                background:
                  `radial-gradient(circle, ${theme.cardBg}, ${theme.accent1}08)`,

                border:
                  `10px solid ${theme.accent1}12`,

                boxShadow:
                  `0 0 35px ${theme.accent1}12`,
              }}
            >

              <div className="text-center">

                <div
                  className="text-4xl font-bold"
                  style={{
                    color:
                      theme.textPrimary,
                    fontFamily:
                      'Orbitron, monospace',
                  }}
                >
                  {minutes}:{seconds}
                </div>

                <p
                  className="text-xs mt-1"
                  style={{
                    color:
                      theme.textSecondary,
                  }}
                >
                  {timerMode === 'focus'
                    ? 'Focus Time'
                    : timerMode === 'short'
                    ? 'Short Break'
                    : 'Long Break'}
                </p>

              </div>

            </div>

          </div>

          {/* ================================================= */}
          {/* TIME ADJUSTMENT */}
          {/* ================================================= */}

          <div className="mb-6">

            <p
              className="text-[10px] uppercase tracking-widest text-center mb-2"
              style={{
                color:
                  theme.textSecondary,
              }}
            >
              Adjust Time
            </p>

            <div className="flex items-center justify-center gap-2">

              {/* MINUS */}
              <button
                onClick={() =>
                  adjustTime(-5)
                }
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all hover:scale-105"
                style={{
                  background:
                    `${theme.accent1}08`,
                  border:
                    `1px solid ${theme.cardBorder}`,
                  color:
                    theme.textPrimary,
                }}
              >
                −
              </button>

              {/* DIRECT INPUT */}
              <div
                className="flex items-center rounded-xl px-3"
                style={{
                  background:
                    `${theme.accent1}08`,
                  border:
                    `1px solid ${theme.cardBorder}`,
                }}
              >

                <input
                  type="number"
                  min="1"
                  max="120"
                  value={customMinutes}
                  onChange={(e) =>
                    setDirectTime(
                      e.target.value
                    )
                  }
                  className="w-14 bg-transparent outline-none text-center font-bold"
                  style={{
                    color:
                      theme.textPrimary,
                  }}
                />

                <span
                  className="text-xs"
                  style={{
                    color:
                      theme.textSecondary,
                  }}
                >
                  min
                </span>

              </div>

              {/* PLUS */}
              <button
                onClick={() =>
                  adjustTime(5)
                }
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all hover:scale-105"
                style={{
                  background:
                    `${theme.accent1}08`,
                  border:
                    `1px solid ${theme.cardBorder}`,
                  color:
                    theme.textPrimary,
                }}
              >
                +
              </button>

            </div>

            <p
              className="text-[10px] text-center mt-2"
              style={{
                color:
                  theme.textSecondary,
              }}
            >
              1–120 minutes
            </p>

          </div>

          {/* ================================================= */}
          {/* TIMER CONTROLS */}
          {/* ================================================= */}

          <div className="flex items-center justify-center gap-4">

            {/* RESET */}
            <button
              onClick={resetTimer}
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-105"
              style={{
                background:
                  `${theme.accent1}08`,
                border:
                  `1px solid ${theme.cardBorder}`,
                color:
                  theme.textPrimary,
              }}
              title="Reset Timer"
            >
              ↻
            </button>

            {/* PLAY / PAUSE */}
            <button
              onClick={() =>
                setIsRunning(
                  (value) => !value
                )
              }
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl text-white transition-all hover:scale-105"
              style={{
                background:
                  `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`,

                boxShadow:
                  `0 0 25px ${theme.accent1}55`,
              }}
            >
              {isRunning ? 'Ⅱ' : '▶'}
            </button>

            {/* NEXT */}
            <button
              onClick={nextTimer}
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-105"
              style={{
                background:
                  `${theme.accent1}08`,
                border:
                  `1px solid ${theme.cardBorder}`,
                color:
                  theme.textPrimary,
              }}
              title="Next Timer"
            >
              ⏭
            </button>

          </div>

          {/* SESSION INFO */}
          <div className="text-center mt-6">

            <p
              className="text-xs"
              style={{
                color:
                  theme.textSecondary,
              }}
            >
              {sessionsCompleted === 0
                ? 'Start your first focus session'
                : `${sessionsCompleted} focus session${
                    sessionsCompleted !== 1
                      ? 's'
                      : ''
                  } completed today`}
            </p>

          </div>

        </div>

        {/* ================================================= */}
        {/* RIGHT SIDE */}
        {/* ================================================= */}

        <div className="lg:col-span-3 space-y-5">

          {/* ================================================= */}
          {/* SUBJECT PROGRESS */}
          {/* ================================================= */}

          <div
            className="rounded-3xl p-6"
            style={cardStyle}
          >

            <h2
              className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{
                color:
                  theme.accent2,
              }}
            >
              Subject Progress
            </h2>

            {goals.length === 0 ? (

              <div className="py-7 text-center">

                <div className="text-3xl mb-2">
                  📚
                </div>

                <p
                  className="text-sm"
                  style={{
                    color:
                      theme.textSecondary,
                  }}
                >
                  No chapters added yet.
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {Array.from(
                  new Set(
                    goals.map(
                      (goal) =>
                        goal.subject
                    )
                  )
                ).map(
                  (subjectName) => {

                    const subjectGoals =
                      goals.filter(
                        (goal) =>
                          goal.subject ===
                          subjectName
                      );

                    const completed =
                      subjectGoals.filter(
                        (goal) =>
                          goal.completed
                      ).length;

                    const percentage =
                      subjectGoals.length
                        ? (completed /
                            subjectGoals.length) *
                          100
                        : 0;

                    return (
                      <div
                        key={
                          subjectName
                        }
                      >

                        <div className="flex justify-between mb-2">

                          <span
                            className="text-sm font-semibold"
                            style={{
                              color:
                                theme.textPrimary,
                            }}
                          >
                            {
                              subjectName
                            }
                          </span>

                          <span
                            className="text-xs"
                            style={{
                              color:
                                theme.textSecondary,
                            }}
                          >
                            {completed}/
                            {
                              subjectGoals.length
                            }
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
                              width: `${percentage}%`,
                              background:
                                `linear-gradient(90deg, ${theme.accent1}, ${theme.accent2})`,
                            }}
                          />

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            )}

          </div>

          {/* ================================================= */}
          {/* TODAY'S GOALS */}
          {/* ================================================= */}

          <div
            className="rounded-3xl p-6"
            style={cardStyle}
          >

            <div className="flex items-center justify-between mb-4">

              <div>

                <h2
                  className="text-xs font-bold tracking-[0.2em] uppercase"
                  style={{
                    color:
                      theme.accent3,
                  }}
                >
                  Today's Goals
                </h2>

                <p
                  className="text-xs mt-1"
                  style={{
                    color:
                      theme.textSecondary,
                  }}
                >
                  {completedGoals}/
                  {goals.length} completed
                </p>

              </div>

              {/* ADD CHAPTER */}
              <button
                onClick={() =>
                  setShowAddChapter(
                    (value) => !value
                  )
                }
                className="px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
                style={{
                  background:
                    `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`,
                }}
              >
                + Add Chapter
              </button>

            </div>

            {/* ================================================= */}
            {/* ADD CHAPTER FORM */}
            {/* ================================================= */}

            {showAddChapter && (
              <div
                className="rounded-2xl p-4 mb-4"
                style={{
                  background:
                    `${theme.accent1}06`,
                  border:
                    `1px solid ${theme.cardBorder}`,
                }}
              >

                {/* CHAPTER */}
                <label
                  className="block text-xs font-semibold mb-2"
                  style={{
                    color:
                      theme.textSecondary,
                  }}
                >
                  Chapter
                </label>

                <input
                  type="text"
                  value={chapter}
                  onChange={(e) =>
                    setChapter(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter'
                    ) {
                      addChapter();
                    }
                  }}
                  placeholder="Enter chapter name..."
                  className="w-full px-4 py-3 rounded-xl outline-none text-sm mb-3"
                  style={{
                    background:
                      theme.cardBg,
                    border:
                      `1px solid ${theme.cardBorder}`,
                    color:
                      theme.textPrimary,
                  }}
                  autoFocus
                />

                {/* SUBJECT */}
                <label
                  className="block text-xs font-semibold mb-2"
                  style={{
                    color:
                      theme.textSecondary,
                  }}
                >
                  Subject
                </label>

                <input
                  type="text"
                  value={subject}
                  onChange={(e) =>
                    setSubject(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter'
                    ) {
                      addChapter();
                    }
                  }}
                  placeholder="Enter subject..."
                  className="w-full px-4 py-3 rounded-xl outline-none text-sm mb-4"
                  style={{
                    background:
                      theme.cardBg,
                    border:
                      `1px solid ${theme.cardBorder}`,
                    color:
                      theme.textPrimary,
                  }}
                />

                {/* FORM BUTTONS */}
                <div className="flex gap-2">

                  <button
                    onClick={() => {
                      setShowAddChapter(
                        false
                      );
                      setChapter('');
                      setSubject('');
                    }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                    style={{
                      background:
                        `${theme.accent1}08`,
                      border:
                        `1px solid ${theme.cardBorder}`,
                      color:
                        theme.textSecondary,
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={addChapter}
                    disabled={
                      !chapter.trim()
                    }
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40"
                    style={{
                      background:
                        `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`,
                    }}
                  >
                    Add Chapter
                  </button>

                </div>

              </div>
            )}

            {/* ================================================= */}
            {/* GOALS */}
            {/* ================================================= */}

            {goals.length === 0 ? (

              <div className="text-center py-10">

                <div className="text-4xl mb-3">
                  📖
                </div>

                <p
                  className="text-sm font-medium"
                  style={{
                    color:
                      theme.textSecondary,
                  }}
                >
                  No chapters added for
                  today.
                </p>

                <p
                  className="text-xs mt-1"
                  style={{
                    color:
                      theme.textSecondary,
                  }}
                >
                  Click "+ Add Chapter" to
                  create your first goal.
                </p>

              </div>

            ) : (

              <div className="space-y-2">

                {goals.map((goal) => (

                  <button
                    key={goal.id}
                    onClick={() =>
                      toggleGoal(
                        goal.id
                      )
                    }
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:scale-[1.01]"
                    style={{
                      background:
                        goal.completed
                          ? `${theme.accent1}08`
                          : `${theme.accent1}04`,

                      border:
                        `1px solid ${theme.cardBorder}`,
                    }}
                  >

                    {/* CHECKBOX */}
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{
                        border:
                          `2px solid ${
                            goal.completed
                              ? theme.accent1
                              : theme.cardBorder
                          }`,

                        background:
                          goal.completed
                            ? theme.accent1
                            : 'transparent',
                      }}
                    >

                      {goal.completed && (
                        <span className="text-white text-xs">
                          ✓
                        </span>
                      )}

                    </div>

                    {/* CHAPTER */}
                    <div className="flex-1 min-w-0">

                      <p
                        className="text-sm font-semibold truncate"
                        style={{
                          color:
                            theme.textPrimary,

                          textDecoration:
                            goal.completed
                              ? 'line-through'
                              : 'none',

                          opacity:
                            goal.completed
                              ? 0.6
                              : 1,
                        }}
                      >
                        {goal.chapter}
                      </p>

                      <p
                        className="text-xs mt-0.5"
                        style={{
                          color:
                            theme.textSecondary,
                        }}
                      >
                        {goal.subject}
                      </p>

                    </div>

                  </button>

                ))}

              </div>

            )}

          </div>

          {/* ================================================= */}
          {/* RECENT SESSIONS */}
          {/* ================================================= */}

          <div
            className="rounded-3xl p-6"
            style={cardStyle}
          >

            <h2
              className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{
                color:
                  theme.accent1,
              }}
            >
              Recent Sessions
            </h2>

            {sessionsCompleted === 0 ? (

              <div className="text-center py-8">

                <div className="text-3xl mb-3">
                  🎯
                </div>

                <p
                  className="text-sm"
                  style={{
                    color:
                      theme.textSecondary,
                  }}
                >
                  No study sessions yet.
                </p>

                <p
                  className="text-xs mt-1"
                  style={{
                    color:
                      theme.textSecondary,
                  }}
                >
                  Start the Pomodoro timer
                  to begin.
                </p>

              </div>

            ) : (

              <div className="space-y-2">

                {Array.from(
                  {
                    length:
                      sessionsCompleted,
                  },
                  (_, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{
                        background:
                          `${theme.accent1}06`,
                        border:
                          `1px solid ${theme.cardBorder}`,
                      }}
                    >

                      <span className="text-lg">
                        🎯
                      </span>

                      <div>

                        <p
                          className="text-sm font-semibold"
                          style={{
                            color:
                              theme.textPrimary,
                          }}
                        >
                          Focus Session
                        </p>

                        <p
                          className="text-xs"
                          style={{
                            color:
                              theme.textSecondary,
                          }}
                        >
                          25 minute session
                        </p>

                      </div>

                    </div>
                  )
                )}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}
