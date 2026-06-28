import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import { LogOut, Sun, Moon, CheckSquare, Loader2 } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { user, logout, isLoggingOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast('Logged out successfully', 'success');
      navigate('/login');
    } catch (error: any) {
      toast(error?.message || 'Failed to logout', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 dark:border-zinc-800 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-6 md:gap-10">
            <NavLink to="/dashboard" className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-50">
              <CheckSquare className="h-5 w-5 text-zinc-900 dark:text-zinc-50" />
              <span>TaskFlow</span>
            </NavLink>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `transition-colors hover:text-zinc-900 dark:hover:text-zinc-50 ${
                    isActive ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-500 dark:text-zinc-400'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/tasks"
                className={({ isActive }) =>
                  `transition-colors hover:text-zinc-900 dark:hover:text-zinc-50 ${
                    isActive ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-500 dark:text-zinc-400'
                  }`
                }
              >
                Tasks
              </NavLink>
            </nav>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-850 dark:hover:text-zinc-50 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Profile & Logout */}
            <div className="flex items-center gap-3 pl-2 border-l border-zinc-200 dark:border-zinc-800">
              <span className="hidden sm:inline text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-md p-2 text-zinc-500 hover:bg-red-50 hover:text-red-650 dark:text-zinc-400 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-colors cursor-pointer"
                title="Logout"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  <LogOut className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
