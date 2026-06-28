import { Schema, model } from 'mongoose';
import { ITask, ITaskModel } from './types';

const taskSchema = new Schema<ITask, ITaskModel>(
  {
    title: {
      type: String,
      required: [true, 'A task must have a title'],
      trim: true,
      maxlength: [100, 'A task title must be less than or equal to 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'A task description must be less than or equal to 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'completed'],
        message: 'Status must be pending, in-progress, or completed',
      },
      default: 'pending',
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be low, medium, or high',
      },
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A task must belong to a user'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes to speed up queries
taskSchema.index({ createdBy: 1, createdAt: -1 });
taskSchema.index({ createdBy: 1, status: 1 });
taskSchema.index({ createdBy: 1, priority: 1 });

export const Task = model<ITask, ITaskModel>('Task', taskSchema);
export default Task;
