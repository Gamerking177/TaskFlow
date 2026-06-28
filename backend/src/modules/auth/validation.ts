import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
  }).min(2, 'Name must be at least 2 characters long').max(50, 'Name must not exceed 50 characters'),
  email: z.string({
    required_error: 'Email is required',
  }).email('Please enter a valid email address'),
  password: z.string({
    required_error: 'Password is required',
  }).min(6, 'Password must be at least 6 characters long'),
});

export const loginSchema = z.object({
  email: z.string({
    required_error: 'Email is required',
  }).email('Please enter a valid email address'),
  password: z.string({
    required_error: 'Password is required',
  }).min(1, 'Password cannot be empty'),
});
