import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from 'react';

import type {
  AppTheme,
  Task,
  NavItem,
  StudySession,
  Subject,
  ThemeId,
  CursorStyle,
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
