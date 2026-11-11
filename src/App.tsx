import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useRef,
} from 'react';

import type {
  AppTheme,
  Task,
  NavItem,
  StudySession,
  Subject,
  ThemeId,
  CursorStyle,
  TimerMode,
} from './types';

import { themes } from './themes';
import Onboarding from './components/Onboarding';
import Layout from './components/Layout';

interface AppState {
  userName: string;
  setUserName: (name: string) => void;
  profileImage: string;
  setProfileImage: (image: string) => void;
  theme: AppTheme;
  setTheme: (id: ThemeId) => void;
  cursorStyle: CursorStyle;
  setCursorStyle: (style: CursorStyle) => void;
  remindersEnabled: boolean;
  setRemindersEnabled: (enabled: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  testReminderSound: () => void;
  notifyTimerComplete: (title: string, body: string) => void;
  timerMode: TimerMode;
  setTimerMode: (mode: TimerMode) => void;
  customMinutes: number;
  setCustomMinutes: (minutes: number | ((previous: number) => number)) => void;
  secondsLeft: number;
  setSecondsLeft: (seconds: number) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  sessionsCompleted: number;

  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  clearSavedData: () => void;

  studySessions: StudySession[];
  addStudySession: (session: Omit<StudySession, 'id'>) => void;

  subjects: Subject[];

  activeNav: NavItem;
  setActiveNav: (nav: NavItem) => void;

  showCreateModal: boolean;
  setShowCreateModal: (v: boolean) => void;
}

export const AppContext = createContext<AppState>(
  {} as AppState
);

export const useApp = () => useContext(AppContext);

// =========================
// LOCAL STORAGE HELPERS
// =========================
function loadData<T>(
  key: string,
  fallback: T
): T {
  try {
    const saved = localStorage.getItem(key);

    if (saved === null) {
      return fallback;
    }

    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  // =========================
  // USER NAME
  // =========================
  const [userName, setUserName] = useState<string>(() =>
    loadData<string>('todo-user-name', '')
  );
  const [profileImage, setProfileImage] = useState<string>(() =>
    loadData<string>('todo-profile-image', '')
  );

  // =========================
  // SCREEN
  // =========================
  const [screen, setScreen] = useState<
    'onboarding' | 'app'
  >(() => {
    const savedName = loadData<string>(
      'todo-user-name',
      ''
    );

    return savedName.trim()
      ? 'app'
      : 'onboarding';
  });

  // =========================
  // THEME
  // =========================
  const [themeId, setThemeId] =
    useState<ThemeId>(() => {
      const savedTheme = loadData<string>('todo-theme', 'dark');
      return savedTheme === 'light' || savedTheme === 'galaxy' ? savedTheme : 'dark';
    });

  const [cursorStyle, setCursorStyle] = useState<CursorStyle>(() =>
    loadData<CursorStyle>('todo-cursor-style', 'default')
  );
  const [remindersEnabled, setRemindersEnabled] = useState(() =>
    loadData<boolean>('todo-reminders-enabled', false)
  );
  const [soundEnabled, setSoundEnabled] = useState(() =>
    loadData<boolean>('todo-reminder-sound-enabled', false)
  );
  const [timerMode, setTimerMode] = useState<TimerMode>('focus');
  const [customMinutes, setCustomMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const notifiedReminderIdsRef = useRef<Set<string>>(
    new Set(loadData<string[]>('todo-notified-reminders', []))
  );

  // =========================
  // TASKS
  // =========================
  const [tasks, setTasks] = useState<Task[]>(() =>
    loadData<Task[]>(
      'todo-tasks',
      []
    )
  );

  // =========================
  // STUDY SESSIONS
  // =========================
  const [studySessions, setStudySessions] =
    useState<StudySession[]>(() =>
      loadData<StudySession[]>(
        'todo-study-sessions',
        []
      )
    );

  // =========================
  // SUBJECTS
  // =========================
  const [subjects] = useState<Subject[]>([]);

  // =========================
  // ACTIVE NAV
  // =========================
  const [activeNav, setActiveNav] =
    useState<NavItem>(() =>
      loadData<NavItem>(
        'todo-active-nav',
        'home'
      )
    );

  // =========================
  // CREATE MODAL
  // =========================
  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const theme = themes[themeId];

  // =========================
  // SAVE USER NAME
  // =========================
  useEffect(() => {
    localStorage.setItem(
      'todo-user-name',
      JSON.stringify(userName)
    );
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('todo-profile-image', JSON.stringify(profileImage));
  }, [profileImage]);

  // =========================
  // SAVE THEME
  // =========================
  useEffect(() => {
    localStorage.setItem(
      'todo-theme',
      JSON.stringify(themeId)
    );
  }, [themeId]);

  useEffect(() => {
    localStorage.setItem('todo-cursor-style', JSON.stringify(cursorStyle));
  }, [cursorStyle]);

  useEffect(() => {
    localStorage.setItem('todo-reminders-enabled', JSON.stringify(remindersEnabled));
  }, [remindersEnabled]);

  useEffect(() => {
    localStorage.setItem('todo-reminder-sound-enabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const playReminderSound = useCallback(() => {
    if (typeof window === 'undefined' || !window.AudioContext) return;
    const audioContext = audioContextRef.current ?? new window.AudioContext();
    audioContextRef.current = audioContext;
    if (audioContext.state === 'suspended') void audioContext.resume();

    const now = audioContext.currentTime;
    [880, 1174].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = now + index * 0.16;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.16, start + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.15);
    });
  }, []);

  const notifyTimerComplete = useCallback((title: string, body: string) => {
    if (
      remindersEnabled &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      try {
        new Notification(title, { body, icon: '/todo-logo.png' });
      } catch {
        // The timer sound can still provide an alert if browser notifications are unavailable.
      }
    }
    if (soundEnabled) playReminderSound();
  }, [remindersEnabled, soundEnabled, playReminderSound]);

  useEffect(() => {
    if (!isRunning) return;

    if (secondsLeft <= 1) {
      setIsRunning(false);
      setSecondsLeft(customMinutes * 60);
      if (timerMode === 'focus') {
        setSessionsCompleted((value) => value + 1);
      }
      notifyTimerComplete(
        timerMode === 'focus' ? 'Focus session complete' : 'Break complete',
        timerMode === 'focus' ? 'Your focus timer has finished.' : 'Your break timer has finished.'
      );
      return;
    }

    const timeout = window.setTimeout(() => {
      setSecondsLeft((previous) => previous - 1);
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [isRunning, secondsLeft, timerMode, customMinutes, notifyTimerComplete]);

  useEffect(() => {
    if (!remindersEnabled && !soundEnabled) return;

    const checkDueTasks = () => {
      const now = Date.now();
      let historyChanged = false;

      tasks.forEach((task) => {
        if (task.deleted || task.completed || !task.time) return;

        const dueAt = new Date(`${task.date}T${task.time}:00`);
        if (Number.isNaN(dueAt.getTime())) return;
        const reminderId = `${task.id}:${task.date}:${task.time}`;
        if (notifiedReminderIdsRef.current.has(reminderId)) return;

        const age = now - dueAt.getTime();
        if (age < 0) return;

        notifiedReminderIdsRef.current.add(reminderId);
        historyChanged = true;
        if (age > 5 * 60 * 1000) return;

        if (
          remindersEnabled &&
          'Notification' in window &&
          Notification.permission === 'granted'
        ) {
          try {
            new Notification(`Task reminder: ${task.title}`, {
              body: `Scheduled for ${task.time}`,
              icon: '/todo-logo.png',
              tag: `task-reminder-${reminderId}`,
            });
          } catch {
            // Browser notification support can vary; the sound reminder can still play.
          }
        }

        if (soundEnabled) playReminderSound();
      });

      if (historyChanged) {
        localStorage.setItem(
          'todo-notified-reminders',
          JSON.stringify([...notifiedReminderIdsRef.current].slice(-500))
        );
      }
    };

    checkDueTasks();
    const intervalId = window.setInterval(checkDueTasks, 15_000);
    return () => window.clearInterval(intervalId);
  }, [tasks, remindersEnabled, soundEnabled, playReminderSound]);

  // =========================
  // SAVE TASKS
  // =========================
  useEffect(() => {
    localStorage.setItem(
      'todo-tasks',
      JSON.stringify(tasks)
    );
  }, [tasks]);

  // =========================
  // SAVE STUDY SESSIONS
  // =========================
  useEffect(() => {
    localStorage.setItem(
      'todo-study-sessions',
      JSON.stringify(studySessions)
    );
  }, [studySessions]);

  // =========================
  // SAVE ACTIVE NAV
  // =========================
  useEffect(() => {
    localStorage.setItem(
      'todo-active-nav',
      JSON.stringify(activeNav)
    );
  }, [activeNav]);

  // =========================
  // SET THEME
  // =========================
  const setTheme = useCallback(
    (id: ThemeId) => {
      setThemeId(id);
    },
    []
  );

  // =========================
  // ADD TASK
  // =========================
  const addTask = useCallback(
    (
      task: Omit<Task, 'id' | 'createdAt'>
    ) => {
      setTasks((prev) => [
        ...prev,
        {
          ...task,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        },
      ]);
    },
    []
  );

  // =========================
  // UPDATE TASK
  // =========================
  const updateTask = useCallback(
    (
      id: string,
      updates: Partial<Task>
    ) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? { ...task, ...updates }
            : task
        )
      );
    },
    []
  );

  // =========================
  // DELETE TASK
  // =========================
  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? { ...task, deleted: true }
            : task
        )
      );
    },
    []
  );

  const clearSavedData = useCallback(() => {
    setTasks([]);
    setStudySessions([]);
    localStorage.removeItem('todo-tasks');
    localStorage.removeItem('todo-study-sessions');
    localStorage.removeItem('todo-notified-reminders');
    notifiedReminderIdsRef.current.clear();
  }, []);

  // =========================
  // ADD STUDY SESSION
  // =========================
  const addStudySession = useCallback(
    (
      session: Omit<StudySession, 'id'>
    ) => {
      setStudySessions((prev) => [
        ...prev,
        {
          ...session,
          id: Date.now().toString(),
        },
      ]);
    },
    []
  );

  // =========================
  // ONBOARDING COMPLETE
  // =========================
  if (screen === 'onboarding') {
    return (
      <Onboarding
        onComplete={(name, selectedTheme) => {
          const trimmedName = name.trim();

          setUserName(trimmedName);
          setThemeId(selectedTheme);

          localStorage.setItem(
            'todo-user-name',
            JSON.stringify(trimmedName)
          );

          localStorage.setItem(
            'todo-theme',
            JSON.stringify(selectedTheme)
          );

          setScreen('app');
        }}
      />
    );
  }

  // =========================
  // APPLICATION
  // =========================
  return (
    <AppContext.Provider
      value={{
        userName,
        setUserName,
        profileImage,
        setProfileImage,

        theme,

        setTheme,
        cursorStyle,
        setCursorStyle,
        remindersEnabled,
        setRemindersEnabled,
        soundEnabled,
        setSoundEnabled,
        testReminderSound: playReminderSound,
        notifyTimerComplete,
        timerMode,
        setTimerMode,
        customMinutes,
        setCustomMinutes,
        secondsLeft,
        setSecondsLeft,
        isRunning,
        setIsRunning,
        sessionsCompleted,

        tasks,
        addTask,
        updateTask,
        deleteTask,
        clearSavedData,

        studySessions,
        addStudySession,

        subjects,

        activeNav,
        setActiveNav,

        showCreateModal,
        setShowCreateModal,
      }}
    >
      <Layout />
    </AppContext.Provider>
  );
}
