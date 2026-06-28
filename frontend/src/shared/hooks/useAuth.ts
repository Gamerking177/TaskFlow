import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { User, APIResponse } from '../types';

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Query to fetch the logged-in user profile on load/refresh
  const { data: user, isLoading, isError, refetch } = useQuery<User | null>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const res = await api.get<APIResponse<{ user: User }>>('/auth/me');
        return res.data.data?.user || null;
      } catch (error) {
        // Return null if request fails (e.g. user is not logged in / token expired)
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 10, // Consider auth state fresh for 10 minutes
  });

  // Mutation to handle logouts
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      queryClient.setQueryData(['currentUser'], null);
      queryClient.clear(); // Flush cache (tasks, etc.) on logout
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isError,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    refetchUser: refetch,
  };
};

export default useAuth;
