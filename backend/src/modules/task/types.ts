import { Document, Model, Types } from 'mongoose';
import { z } from 'zod';
import { createTaskSchema, updateTaskSchema, queryTaskSchema } from './validation';

export interface ITask extends Document {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskModel extends Model<ITask> {}

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type QueryTaskInput = z.infer<typeof queryTaskSchema>;

export interface TaskQueryFilters {
  createdBy: Types.ObjectId;
  status?: string;
  priority?: string;
  $or?: Array<{
    title?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
  }>;
}
