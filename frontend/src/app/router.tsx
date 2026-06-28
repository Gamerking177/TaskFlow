import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthGuard, GuestGuard } from '../shared/components/guards';
import AppLayout from '../shared/components/AppLayout';

// Lazy load page components for optimized bundle delivery
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'));
const TasksPage = lazy(() => import('../features/tasks/pages/TasksPage'));
const NotFoundPage = lazy(() => import('../shared/components/NotFoundPage'));

// Unified loading view during chunk downloads
const PageLoader: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
    <div className="h-8 w-8 animate-spin rounded-full border-3 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-100" />
  </div>
);

export const router = createBrowserRouter([
  // Guest-only routes
  {
    element: <GuestGuard />,
    children: [
      {
        path: '/login',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: '/register',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RegisterPage />
          </Suspense>
        ),
      },
    ],
  },
  
  // Authenticated-only routes
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/dashboard',
            element: (
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: '/tasks',
            element: (
              <Suspense fallback={<PageLoader />}>
                <TasksPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  
  // Default routing root
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  
  // 404 Fallback routing
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);

export default router;
