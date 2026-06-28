import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { taskService } from '../../tasks/services/taskService';
import { useAuth } from '../../../shared/hooks/useAuth';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  CheckSquare, 
  ArrowRight, 
  Sparkles,
  Calendar,
  RefreshCcw
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const { data: stats, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['taskStats'],
    queryFn: taskService.getStats,
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (isError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900 transition-colors">
        <AlertTriangle className="h-10 w-10 text-red-500" />
        <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Failed to load statistics</h3>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
          We encountered an error while trying to fetch your task metrics. Please check your connection.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors"
        >
          <RefreshCcw className="h-4 w-4" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  // Calculate completion percentage
  const totalTasks = stats?.total || 0;
  const completedTasks = stats?.completed || 0;
  const pendingTasks = stats?.pending || 0;
  const inProgressTasks = stats?.inProgress || 0;
  const activeTasks = pendingTasks + inProgressTasks;
  const overdueTasks = stats?.overdue || 0;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Greetings Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Hello, {user?.name || 'User'}
          </h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <Calendar className="h-4 w-4" />
            <span>{currentDate}</span>
          </div>
        </div>
        
        {/* Quick Sync Button */}
        {stats && (
          <button
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="self-start md:self-auto inline-flex items-center gap-2 rounded-lg border border-zinc-255 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCcw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
            <span>Refresh Stats</span>
          </button>
        )}
      </div>

      {/* Metrics Card Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />)
        ) : (
          <>
            {/* Total Tasks Card */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Tasks</span>
                <div className="rounded-md bg-zinc-100 p-2 text-zinc-900 dark:bg-zinc-850 dark:text-zinc-100">
                  <CheckSquare className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{totalTasks}</span>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Allocated in your workspace</p>
              </div>
            </div>

            {/* Completed Tasks Card */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Completed</span>
                <div className="rounded-md bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{completedTasks}</span>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {totalTasks > 0 ? `${completionRate}% success rate` : 'No tasks created yet'}
                </p>
              </div>
            </div>

            {/* Active Tasks Card */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Tasks</span>
                <div className="rounded-md bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/20 dark:text-blue-450">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{activeTasks}</span>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Pending or in progress state</p>
              </div>
            </div>

            {/* Overdue Tasks Card */}
            <div className={`rounded-xl border p-6 transition-colors ${
              overdueTasks > 0 
                ? 'border-red-200 bg-red-50/30 dark:border-red-900/30 dark:bg-red-950/5' 
                : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Overdue</span>
                <div className={`rounded-md p-2 ${
                  overdueTasks > 0 
                    ? 'bg-red-100 text-red-655 dark:bg-red-950/30 dark:text-red-400' 
                    : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-850 dark:text-zinc-100'
                }`}>
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-3xl font-bold ${overdueTasks > 0 ? 'text-red-600 dark:text-red-400' : 'text-zinc-900 dark:text-zinc-50'}`}>
                  {overdueTasks}
                </span>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Missed original due dates</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Onboarding Empty State OR Progress Board */}
      {!isLoading && stats && (
        <>
          {totalTasks === 0 ? (
            /* Onboarding On-Empty View */
            <div className="rounded-xl border border-dashed border-zinc-300 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-12 text-center transition-colors">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-850">
                <Sparkles className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Welcome to TaskFlow!</h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                Organize your work, establish deadlines, and complete projects. Let's create your first task to start tracking metrics!
              </p>
              <div className="mt-6 flex justify-center">
                <Link
                  to="/tasks"
                  className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-50 hover:bg-zinc-850 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100 shadow-sm transition-colors cursor-pointer"
                >
                  <span>Go to Tasks</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            /* Completion Progress Visual Card */
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 transition-colors">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Weekly Progress Summary</h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  You have completed <span className="font-medium text-zinc-900 dark:text-zinc-150">{completedTasks}</span> out of{' '}
                  <span className="font-medium text-zinc-900 dark:text-zinc-150">{totalTasks}</span> tasks.
                </p>
                
                {/* Progress bar container */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-zinc-500 dark:text-zinc-400">Task Completion Rate</span>
                    <span className="text-zinc-900 dark:text-zinc-50">{completionRate}%</span>
                  </div>
                  <div className="mt-2 h-2.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-500" 
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>

                <div className="mt-8 flex border-t border-zinc-100 dark:border-zinc-800 pt-6">
                  <Link
                    to="/tasks"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-900 hover:text-zinc-800 dark:text-zinc-50 dark:hover:text-zinc-200 group"
                  >
                    <span>Manage your tasks list</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>

              {/* Sidebar Quick Links Card */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 transition-colors flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Quick Actions</h3>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Create new items or edit filters instantly.
                  </p>
                </div>
                <div className="mt-6 space-y-3">
                  <Link
                    to="/tasks"
                    className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <span>Create a new Task</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Loading Skeleton
const StatsCardSkeleton: React.FC = () => (
  <div className="animate-pulse rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
    <div className="flex items-center justify-between">
      <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-8 w-8 rounded bg-zinc-150 dark:bg-zinc-850" />
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-8 w-14 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-3.5 w-32 rounded bg-zinc-150 dark:bg-zinc-850" />
    </div>
  </div>
);

export default DashboardPage;
