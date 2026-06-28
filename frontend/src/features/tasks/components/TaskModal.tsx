import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../shared/hooks/useToast';
import { taskFormSchema, TaskFormFields } from '../schemas';
import { taskService } from '../services/taskService';
import { Task } from '../../../shared/types';
import { X, Loader2 } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task; // If provided, we are in Edit Mode
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isEditMode = !!task;

  // Format date helper: converts ISO string to YYYY-MM-DD for standard html date inputs
  const formatDateForInput = (isoString?: string): string => {
    if (!isoString) return '';
    try {
      return new Date(isoString).toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormFields>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: '',
    },
  });

  // Reset form when task changes or modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        reset({
          title: task.title,
          description: task.description || '',
          status: task.status,
          priority: task.priority,
          dueDate: formatDateForInput(task.dueDate),
        });
      } else {
        reset({
          title: '',
          description: '',
          status: 'pending',
          priority: 'medium',
          dueDate: '',
        });
      }
    }
  }, [isOpen, task, reset]);

  // Mutation for creating a task
  const { mutate: createTask, isPending: isCreating } = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['taskStats'] });
      toast('Task created successfully', 'success');
      onClose();
    },
    onError: (error: any) => {
      toast(error?.message || 'Failed to create task', 'error');
    },
  });

  // Mutation for updating a task
  const { mutate: updateTask, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskFormFields }) => taskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['taskStats'] });
      toast('Task updated successfully', 'success');
      onClose();
    },
    onError: (error: any) => {
      toast(error?.message || 'Failed to update task', 'error');
    },
  });

  const onSubmit = (data: TaskFormFields) => {
    // Process due date: convert date input to full ISO string
    let processedDueDate: string | null = null;
    if (data.dueDate) {
      try {
        processedDueDate = new Date(`${data.dueDate}T12:00:00.000Z`).toISOString();
      } catch {
        processedDueDate = null;
      }
    }

    const payload = {
      ...data,
      dueDate: processedDueDate,
    };

    if (isEditMode && task) {
      updateTask({ id: task.id, data: payload as any });
    } else {
      createTask(payload as any);
    }
  };

  if (!isOpen) return null;

  const isSaving = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-zinc-950/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal card wrapper */}
      <div className="relative w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 transition-all z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {isEditMode ? 'Edit Task' : 'Create Task'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4" noValidate>
          
          {/* Title input */}
          <div>
            <label htmlFor="modal-title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Title
            </label>
            <input
              id="modal-title"
              type="text"
              disabled={isSaving}
              placeholder="e.g. Design landing page database schemas"
              className={`mt-1.5 block w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 dark:focus:ring-zinc-50 dark:focus:border-zinc-50 disabled:opacity-50 transition-colors ${
                errors.title ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-900/50' : 'border-zinc-300 dark:border-zinc-800'
              }`}
              {...register('title')}
            />
            {errors.title && (
              <span className="mt-1 block text-xs text-red-655 dark:text-red-400">{errors.title.message}</span>
            )}
          </div>

          {/* Description input */}
          <div>
            <label htmlFor="modal-description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Description
            </label>
            <textarea
              id="modal-description"
              disabled={isSaving}
              rows={3}
              placeholder="Add more details about this task..."
              className={`mt-1.5 block w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 dark:focus:ring-zinc-50 dark:focus:border-zinc-50 disabled:opacity-50 transition-colors ${
                errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-900/50' : 'border-zinc-300 dark:border-zinc-800'
              }`}
              {...register('description')}
            />
            {errors.description && (
              <span className="mt-1 block text-xs text-red-655 dark:text-red-400">{errors.description.message}</span>
            )}
          </div>

          {/* Double column inputs for Status / Priority */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status select */}
            <div>
              <label htmlFor="modal-status" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Status
              </label>
              <select
                id="modal-status"
                disabled={isSaving}
                className="mt-1.5 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 dark:focus:ring-zinc-50 dark:focus:border-zinc-50"
                {...register('status')}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority select */}
            <div>
              <label htmlFor="modal-priority" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Priority
              </label>
              <select
                id="modal-priority"
                disabled={isSaving}
                className="mt-1.5 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 dark:focus:ring-zinc-50 dark:focus:border-zinc-50"
                {...register('priority')}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due date input */}
          <div>
            <label htmlFor="modal-dueDate" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Due Date
            </label>
            <input
              id="modal-dueDate"
              type="date"
              disabled={isSaving}
              className="mt-1.5 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 dark:focus:ring-zinc-50 dark:focus:border-zinc-50"
              {...register('dueDate')}
            />
            {errors.dueDate && (
              <span className="mt-1 block text-xs text-red-655 dark:text-red-400">{errors.dueDate.message}</span>
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex justify-end gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex justify-center items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100 shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default TaskModal;
