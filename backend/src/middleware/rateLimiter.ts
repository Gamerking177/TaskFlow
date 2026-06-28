import rateLimit from 'express-rate-limit';
import { AppError } from '../utils/appError';

// General API Rate Limiter: Max 100 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Too many requests from this IP, please try again after 15 minutes', 429));
  },
});

// Authentication Rate Limiter: Max 15 attempts per 15 minutes per IP (stricter limit)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 15,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Too many authentication attempts, please try again after 15 minutes', 429));
  },
});
