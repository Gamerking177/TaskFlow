import { z } from 'zod';

export const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters'),
  status: z.enum(['pending', 'in-progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const parsed = Date.parse(val);
        return !isNaN(parsed);
      },
      { message: 'Due date must be a valid date' }
    )
    .nullable(),
});

export type TaskFormFields = z.infer<typeof taskFormSchema>;
