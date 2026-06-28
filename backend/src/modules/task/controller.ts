import { Request, Response } from 'express';
import { TaskService } from './service';
import { createTaskSchema, updateTaskSchema, queryTaskSchema } from './validation';
import { catchAsync } from '../../utils/catchAsync';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  public create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const validatedData = createTaskSchema.parse(req.body);
    const task = await this.taskService.createTask(validatedData, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task },
    });
  });

  public getOne = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const task = await this.taskService.getTaskById(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Task fetched successfully',
      data: { task },
    });
  });

  public update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const validatedData = updateTaskSchema.parse(req.body);
    const task = await this.taskService.updateTask(req.params.id, validatedData, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task },
    });
  });

  public delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    await this.taskService.deleteTask(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  });

  public getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const validatedQuery = queryTaskSchema.parse(req.query);
    const result = await this.taskService.getAllTasks(validatedQuery, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Tasks fetched successfully',
      data: { tasks: result.tasks },
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  });

  public getStats = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const stats = await this.taskService.getStatistics(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Task statistics fetched successfully',
      data: { stats },
    });
  });
}
export default TaskController;
