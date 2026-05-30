import { create } from 'zustand';
import { TaskItem, getAllTasks, addTask, updateTask, deleteTask as apiDeleteTask } from '../utils/handle-api';

interface TaskState {
  tasks: TaskItem[];
  loading: boolean;
  hasLoadedFromStorage: boolean;
  fetchTasks: (setLoading?: React.Dispatch<React.SetStateAction<boolean>>) => void;
  addTask: (
    text: string,
    completed: boolean,
    dueDate: string | null,
    priority: 'Baixa' | 'Média' | 'Alta',
    onSuccess: () => void
  ) => void;
  updateTask: (
    taskId: string,
    text: string,
    completed: boolean,
    dueDate: string | null,
    priority: 'Baixa' | 'Média' | 'Alta',
    onSuccess: () => void
  ) => void;
  deleteTask: (_id: string) => void;
  deleteAllTasks: () => void;
  setHasLoadedFromStorage: (value: boolean) => void;
}

const saveToStorage = (tasks: TaskItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tasks-storage', JSON.stringify(tasks));
    console.log('💾 Tasks salvas no localStorage:', tasks.length);
  }
};

const loadFromStorage = (): TaskItem[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tasks-storage');
    if (saved) {
      try {
        const tasks = JSON.parse(saved);
        console.log('📀 Tasks carregadas do localStorage:', tasks.length);
        return tasks;
      } catch (e) {
        console.error('Erro ao carregar do storage:', e);
      }
    }
  }
  return [];
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: loadFromStorage(),
  loading: false,
  hasLoadedFromStorage: false,

  fetchTasks: (setLoading?: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (get().loading) return;

    set({ loading: true });

    getAllTasks(
      (tasks) => {
        console.log('📡 Tasks carregadas da API:', tasks.length);
        set({ tasks, loading: false });
        saveToStorage(tasks);
      },
      (loading) => set({ loading })
    );
  },

  addTask: (text: string, completed: boolean, dueDate: string | null, priority: 'Baixa' | 'Média' | 'Alta', onSuccess: () => void) => {
    console.log('➕ Store.addTask chamado:', { text, completed, dueDate, priority });
    addTask(text, completed, dueDate, priority, (tasks) => {
      set({ tasks });
      saveToStorage(tasks);
      onSuccess();
    }, onSuccess);
  },

  updateTask: (taskId: string, text: string, completed: boolean, dueDate: string | null, priority: 'Baixa' | 'Média' | 'Alta', onSuccess: () => void) => {
    console.log('✏️ Store.updateTask chamado:', { taskId, text, completed, dueDate, priority });
    updateTask(taskId, text, completed, dueDate, priority, (tasks) => {
      set({ tasks });
      saveToStorage(tasks);
      onSuccess();
    }, onSuccess);
  },

  deleteTask: (_id: string) => {
    console.log('🗑️ Store.deleteTask chamado:', _id);
    apiDeleteTask(_id, (tasks) => {
      console.log('✅ Store.deleteTask callback, tasks restantes:', tasks.length);
      set({ tasks });
      saveToStorage(tasks);
    });
  },

  deleteAllTasks: () => {
    const { tasks, deleteTask } = get();
    tasks.forEach(task => {
      deleteTask(task._id);
    });
  },

  setHasLoadedFromStorage: (value: boolean) => {
    set({ hasLoadedFromStorage: value });
  },
}));