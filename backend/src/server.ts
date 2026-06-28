import { env } from './config/env';
import { connectDB } from './config/db';
import app from './app';

// Connect to Database
connectDB();

const PORT = env.PORT;
const NODE_ENV = env.NODE_ENV;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down server...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: any) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down server...');
  console.error(err);
  process.exit(1);
});
