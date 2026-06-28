import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../../shared/hooks/useToast';
import { loginSchema, LoginFields } from '../schemas';
import { authService } from '../services/authService';
import { CheckSquare, Loader2, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: authService.login,
    onSuccess: (user) => {
      // Seed user cache immediately
      queryClient.setQueryData(['currentUser'], user);
      toast(`Welcome back, ${user.name}!`, 'success');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast(error?.message || 'Login failed. Please check your credentials.', 'error');
    },
  });

  const onSubmit = (data: LoginFields) => {
    login(data);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-zinc-50 px-6 py-12 dark:bg-zinc-950 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo Icon */}
        <div className="flex justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100 shadow-sm">
            <CheckSquare className="h-5 w-5 text-zinc-50 dark:text-zinc-900" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Or{' '}
          <Link
            to="/register"
            className="font-medium text-zinc-900 dark:text-zinc-50 hover:underline decoration-zinc-400 dark:decoration-zinc-500 underline-offset-4"
          >
            create a new account for free
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-8 py-8 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 rounded-xl shadow-sm transition-colors duration-200">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email address
              </label>
              <div className="mt-1.5 relative">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  disabled={isPending}
                  className={`block w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 dark:focus:ring-zinc-50 dark:focus:border-zinc-50 disabled:opacity-50 transition-colors ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-900/50'
                      : 'border-zinc-300 dark:border-zinc-800'
                  }`}
                  placeholder="you@example.com"
                  {...register('email')}
                />
                {errors.email && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-650 dark:text-red-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{errors.email.message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
              </div>
              <div className="mt-1.5 relative">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  disabled={isPending}
                  className={`block w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 dark:focus:ring-zinc-50 dark:focus:border-zinc-50 disabled:opacity-50 transition-colors ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-900/50'
                      : 'border-zinc-300 dark:border-zinc-800'
                  }`}
                  placeholder="••••••••"
                  {...register('password')}
                />
                {errors.password && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-650 dark:text-red-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{errors.password.message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full justify-center items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-50 hover:bg-zinc-850 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-150 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:focus:ring-zinc-100 disabled:opacity-50 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign in</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
