import { Types } from 'mongoose';
import { Task } from './taskModel';
import { ITask, CreateTaskInput, UpdateTaskInput, QueryTaskInput, TaskQueryFilters } from './types';

export class TaskRepository {
  public async create(taskData: CreateTaskInput & { createdBy: Types.ObjectId }): Promise<ITask> {
    return await Task.create(taskData);
  }

  public async findById(id: string): Promise<ITask | null> {
    return await Task.findById(id);
  }

  public async update(id: string, updateData: UpdateTaskInput): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(id, updateData, {
      new: true, // Return modified document
      runValidators: true, // Validate fields before saving
    });
  }

  public async delete(id: string): Promise<ITask | null> {
    return await Task.findByIdAndDelete(id);
  }

  public async findAndCount(
    query: QueryTaskInput,
    userId: string
  ): Promise<{ tasks: ITask[]; total: number; page: number; limit: number; totalPages: number }> {
    const { search, status, priority, sort, order, page, limit } = query;

    const filters: TaskQueryFilters = {
      createdBy: new Types.ObjectId(userId),
    };

    if (status) {
      filters.status = status;
    }

    if (priority) {
      filters.priority = priority;
    }

    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sortObj: any = {};
    if (sort) {
      sortObj[sort] = order === 'asc' ? 1 : -1;
    } else {
      sortObj.createdAt = -1;
    }

    const skip = (page - 1) * limit;

    // Run query and document count queries concurrently
    const [tasks, total] = await Promise.all([
      Task.find(filters).sort(sortObj).skip(skip).limit(limit),
      Task.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      tasks,
      total,
      page,
      limit,
      totalPages,
    };
  }

  // Get statistics for the dashboard
  public async getStatistics(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    
    const stats = await Task.aggregate([
      { $match: { createdBy: userObjectId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$status', 'completed'] },
                    { $lt: ['$dueDate', new Date()] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    return stats[0] || { total: 0, completed: 0, pending: 0, inProgress: 0, overdue: 0 };
  }
}
export default TaskRepository;
