import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string({
    required_error: 'Title is required',
  }).min(1, 'Title cannot be empty').max(100, 'Title must not exceed 100 characters').trim(),
  description: z.string().max(500, 'Description must not exceed 500 characters').optional().default(''),
  status: z.enum(['pending', 'in-progress', 'completed'], {
    invalid_type_error: 'Status must be pending, in-progress, or completed',
  }).optional().default('pending'),
  priority: z.enum(['low', 'medium', 'high'], {
    invalid_type_error: 'Priority must be low, medium, or high',
  }).optional().default('medium'),
  dueDate: z.string().datetime({ message: 'Due date must be a valid ISO datetime string' }).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(100, 'Title must not exceed 100 characters').trim().optional(),
  description: z.string().max(500, 'Description must not exceed 500 characters').optional(),
  status: z.enum(['pending', 'in-progress', 'completed'], {
    invalid_type_error: 'Status must be pending, in-progress, or completed',
  }).optional(),
  priority: z.enum(['low', 'medium', 'high'], {
    invalid_type_error: 'Priority must be low, medium, or high',
  }).optional(),
  dueDate: z.string().datetime({ message: 'Due date must be a valid ISO datetime string' }).optional().nullable(),
});

export const queryTaskSchema = z.object({
  search: z.string().optional().default(''),
  status: z.enum(['pending', 'in-progress', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  sort: z.enum(['dueDate', 'priority', 'status', 'createdAt', 'title']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
});
