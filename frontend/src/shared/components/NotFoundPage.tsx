import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 mb-6">
        <FileQuestion className="h-8 w-8 text-zinc-500" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">404</h1>
      <p className="mt-2 text-lg text-zinc-500 dark:text-zinc-400">Page not found</p>
      <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500 max-w-xs">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-4 py-2.5 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:ring-offset-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Safety
      </Link>
    </div>
  );
};

export default NotFoundPage;
