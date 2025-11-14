import { create } from 'zustand';
import type { Task, TaskStatistics } from '@/types/tasks';
import { tasksApi } from '@services/tasks';

interface TasksStore {
  tasks: Task[];
  statistics: TaskStatistics | null;
  loading: boolean;
  error: string | null;
  fetchTasks: (params?: any) => Promise<void>;
  fetchStatistics: () => Promise<void>;
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  removeTask: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTasksStore = create<TasksStore>((set) => ({
  tasks: [],
  statistics: null,
  loading: false,
  error: null,

  fetchTasks: async (params?) => {
    set({ loading: true, error: null });
    try {
      const tasks = await tasksApi.getTasks(params);
      set({ tasks, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchStatistics: async () => {
    try {
      const statistics = await tasksApi.getStatistics();
      set({ statistics });
    } catch (error: any) {
      console.error('Failed to fetch statistics:', error);
    }
  },

  addTask: (task) => {
    set((state) => ({ tasks: [...state.tasks, task] }));
  },

  updateTask: (id, updatedTask) => {
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)),
    }));
  },

  removeTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
