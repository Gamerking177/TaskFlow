import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { apiLimiter } from './middleware/rateLimiter';
import { globalErrorHandler } from './middleware/errorMiddleware';
import { AppError } from './utils/appError';
import authRouter from './modules/auth/routes';
import taskRouter from './modules/task/routes';

const app: Application = express();

// Set security HTTP headers
app.use(helmet());

// Apply rate limiting to all requests
app.use('/api', apiLimiter);

// Enable CORS
const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Development logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Limit request size & Parse body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Parse Cookie header and populate req.cookies
app.use(cookieParser());

// Compress all responses
app.use(compression());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('TaskFlow API Server is running healthily');
});

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tasks', taskRouter);

// Wildcard 404 handler for undefined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Central Error Handler Middleware
app.use(globalErrorHandler);

export default app;
