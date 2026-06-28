import api from '../../../shared/services/api';
import { APIResponse, Task, TaskStats } from '../../../shared/types';

export const taskService = {
  getStats: async (): Promise<TaskStats> => {
    const response = await api.get<APIResponse<{ stats: TaskStats }>>('/tasks/stats');
    if (!response.data.success || !response.data.data?.stats) {
      throw new Error(response.data.message || 'Failed to fetch task stats');
    }
    return response.data.data.stats;
  },

  getTasks: async (params?: any): Promise<{ tasks: Task[]; total: number; page: number; limit: number; totalPages: number }> => {
    const response = await api.get<APIResponse<{ tasks: Task[] }>>('/tasks', { params });
    if (!response.data.success || !response.data.data?.tasks) {
      throw new Error(response.data.message || 'Failed to fetch tasks');
    }
    return {
      tasks: response.data.data.tasks,
      total: response.data.meta?.total || 0,
      page: response.data.meta?.page || 1,
      limit: response.data.meta?.limit || 10,
      totalPages: response.data.meta?.totalPages || 1,
    };
  },

  getTask: async (id: string): Promise<Task> => {
    const response = await api.get<APIResponse<{ task: Task }>>(`/tasks/${id}`);
    if (!response.data.success || !response.data.data?.task) {
      throw new Error(response.data.message || 'Failed to fetch task details');
    }
    return response.data.data.task;
  },

  createTask: async (taskData: any): Promise<Task> => {
    const response = await api.post<APIResponse<{ task: Task }>>('/tasks', taskData);
    if (!response.data.success || !response.data.data?.task) {
      throw new Error(response.data.message || 'Failed to create task');
    }
    return response.data.data.task;
  },

  updateTask: async (id: string, taskData: any): Promise<Task> => {
    const response = await api.put<APIResponse<{ task: Task }>>(`/tasks/${id}`, taskData);
    if (!response.data.success || !response.data.data?.task) {
      throw new Error(response.data.message || 'Failed to update task');
    }
    return response.data.data.task;
  },

  deleteTask: async (id: string): Promise<void> => {
    const response = await api.delete<APIResponse<null>>(`/tasks/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete task');
    }
  },
};

export default taskService;
