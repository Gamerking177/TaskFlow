import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { TaskModal } from '../components/TaskModal';
import { useToast } from '../../../shared/hooks/useToast';
import { Task } from '../../../shared/types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FolderOpen,
} from 'lucide-react';

export const TasksPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Search & Filter state
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearchQuery] = useState('');
  const [status, setStatus] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [sort, setSort] = useState<string>('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  // Modal control state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  // Simple search debounce handler
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1); // Reset to page 1 on search change
    }, 350);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  // Reset pagination page on filter change
  useEffect(() => {
    setPage(1);
  }, [status, priority, sort, order]);

  // Fetch tasks query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['tasks', { search, status, priority, sort, order, page }],
    queryFn: () =>
      taskService.getTasks({
        search,
        status: status || undefined,
        priority: priority || undefined,
        sort,
        order,
        page,
        limit,
      }),
  });

  // Delete task mutation
  const { mutate: deleteTask, isPending: isDeleting } = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['taskStats'] });
      toast('Task deleted successfully', 'success');
    },
    onError: (error: any) => {
      toast(error?.message || 'Failed to delete task', 'error');
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedTask(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = (task: Task): boolean => {
    if (task.status === 'completed' || !task.dueDate) return false;
    return new Date(task.dueDate) < new Date();
  };

  const getPriorityBadgeClass = (prio: string) => {
    switch (prio) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-450 dark:border-amber-900/30';
      case 'low':
        return 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-400 dark:border-zinc-800';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  const getStatusBadgeClass = (stat: string) => {
    switch (stat) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30';
      case 'in-progress':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-450 dark:border-blue-900/30';
      case 'pending':
        return 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-500 dark:border-zinc-800';
      default:
        return 'bg-zinc-100 text-zinc-500 border-zinc-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Tasks</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Create, view, edit, and keep track of your team tasks list.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-50 hover:bg-zinc-850 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 transition-colors md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white pl-9 pr-4 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 dark:focus:ring-zinc-50 dark:focus:border-zinc-50 transition-colors"
          />
        </div>

        {/* Filters grid */}
        <div className="flex flex-wrap gap-2.5">
          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Priority filter */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 focus:outline-none"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* Sort field select */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 focus:outline-none"
          >
            <option value="createdAt">Date Created</option>
            <option value="dueDate">Due Date</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
            <option value="priority">Priority</option>
          </select>

          {/* Sort order select */}
          <button
            onClick={() => setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
            className="rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            {order === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>

      {/* Task List / Table Grid */}
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden transition-colors">
        {isLoading ? (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-1/3 rounded bg-zinc-200 dark:bg-zinc-850" />
                  <div className="h-4.5 w-16 rounded bg-zinc-200 dark:bg-zinc-850" />
                </div>
                <div className="h-4 w-2/3 rounded bg-zinc-150 dark:bg-zinc-800" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
            <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Error fetching tasks</h3>
            <p className="mt-1 text-xs text-zinc-500">Please try refreshing the page.</p>
            <button
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              Retry
            </button>
          </div>
        ) : !data || data.tasks.length === 0 ? (
          /* Empty Search results state */
          <div className="p-12 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-850">
              <FolderOpen className="h-5 w-5 text-zinc-400" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">No tasks found</h3>
            <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
              There are no tasks that match your search filters. Try clearing some queries.
            </p>
          </div>
        ) : (
          /* Tasks table layout list */
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {data.tasks.map((task) => (
              <div
                key={task.id}
                className="group flex flex-col justify-between p-5 hover:bg-zinc-50/50 dark:hover:bg-zinc-850/10 md:flex-row md:items-center transition-colors gap-4"
              >
                {/* Task Details */}
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate max-w-md">
                      {task.title}
                    </h3>
                    <div className="flex gap-1.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-medium leading-none ${getStatusBadgeClass(task.status)}`}>
                        {task.status}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-medium leading-none ${getPriorityBadgeClass(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  {task.description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 max-w-2xl leading-normal">
                      {task.description}
                    </p>
                  )}
                  
                  {/* Due Date tag */}
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-550 dark:text-zinc-400">
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                    <span className={isOverdue(task) ? 'text-red-600 dark:text-red-400 font-semibold' : ''}>
                      {formatDate(task.dueDate)}
                    </span>
                    {isOverdue(task) && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-red-650 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30">
                        <AlertCircle className="h-3 w-3" />
                        <span>Overdue</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Edit / Delete actions */}
                <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity justify-end shrink-0">
                  <button
                    onClick={() => handleOpenEditModal(task)}
                    className="rounded p-1.5 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                    title="Edit Task"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    disabled={isDeleting}
                    className="rounded p-1.5 text-zinc-900 dark:text-zinc-50 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete Task"
                  >
                    {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Showing Page <span className="font-medium text-zinc-900 dark:text-zinc-150">{page}</span> of{' '}
            <span className="font-medium text-zinc-900 dark:text-zinc-150">{data.totalPages}</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-850 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Prev</span>
            </button>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, data.totalPages))}
              disabled={page === data.totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-850 disabled:opacity-40 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Reusable creation/editing modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
      />
    </div>
  );
};

export default TasksPage;
