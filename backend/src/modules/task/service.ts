import { Types } from 'mongoose';
import { TaskRepository } from './repository';
import { ITask, CreateTaskInput, UpdateTaskInput, QueryTaskInput } from './types';
import { AppError } from '../../utils/appError';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  public async createTask(taskData: CreateTaskInput, userId: string): Promise<ITask> {
    return await this.taskRepository.create({
      ...taskData,
      createdBy: new Types.ObjectId(userId),
    });
  }

  public async getTaskById(id: string, userId: string): Promise<ITask> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid task ID format', 400);
    }

    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    if (task.createdBy.toString() !== userId) {
      throw new AppError('You do not have permission to access this task', 403);
    }

    return task;
  }

  public async updateTask(id: string, updateData: UpdateTaskInput, userId: string): Promise<ITask> {
    // Verify ownership and existence
    await this.getTaskById(id, userId);

    const updatedTask = await this.taskRepository.update(id, updateData);
    if (!updatedTask) {
      throw new AppError('Task could not be updated', 404);
    }

    return updatedTask;
  }

  public async deleteTask(id: string, userId: string): Promise<void> {
    // Verify ownership and existence
    await this.getTaskById(id, userId);

    await this.taskRepository.delete(id);
  }

  public async getAllTasks(query: QueryTaskInput, userId: string) {
    return await this.taskRepository.findAndCount(query, userId);
  }

  public async getStatistics(userId: string) {
    return await this.taskRepository.getStatistics(userId);
  }
}
export default TaskService;
