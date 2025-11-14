import api from './api';
import type {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  QueryTasksDto,
  TaskStatistics,
} from '@/types/tasks';

export const tasksApi = {
  // 创建任务
  createTask: (data: CreateTaskDto): Promise<Task> => {
    return api.post('/tasks', data);
  },

  // 查询任务列表
  getTasks: (params?: QueryTasksDto): Promise<Task[]> => {
    return api.get('/tasks', { params });
  },

  // 获取单个任务
  getTask: (id: string): Promise<Task> => {
    return api.get(`/tasks/${id}`);
  },

  // 获取子任务
  getSubTasks: (parentId: string): Promise<Task[]> => {
    return api.get(`/tasks/${parentId}/subtasks`);
  },

  // 更新任务
  updateTask: (id: string, data: UpdateTaskDto): Promise<Task> => {
    return api.patch(`/tasks/${id}`, data);
  },

  // 删除任务
  deleteTask: (id: string): Promise<void> => {
    return api.delete(`/tasks/${id}`);
  },

  // 获取统计信息
  getStatistics: (): Promise<TaskStatistics> => {
    return api.get('/tasks/statistics');
  },

  // 获取即将到期的任务
  getUpcomingTasks: (days?: number): Promise<Task[]> => {
    return api.get('/tasks/upcoming', { params: { days } });
  },
};
