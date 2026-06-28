import api from '../../../shared/services/api';
import { APIResponse, User } from '../../../shared/types';
import { LoginFields, RegisterFields } from '../schemas';

export const authService = {
  login: async (data: LoginFields): Promise<User> => {
    const response = await api.post<APIResponse<{ user: User }>>('/auth/login', data);
    if (!response.data.success || !response.data.data?.user) {
      throw new Error(response.data.message || 'Login failed');
    }
    return response.data.data.user;
  },

  register: async (data: RegisterFields): Promise<User> => {
    const response = await api.post<APIResponse<{ user: User }>>('/auth/register', data);
    if (!response.data.success || !response.data.data?.user) {
      throw new Error(response.data.message || 'Registration failed');
    }
    return response.data.data.user;
  },
};

export default authService;
