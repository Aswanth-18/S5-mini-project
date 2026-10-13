import { create } from 'zustand';
import { login as loginApi } from '../services/authApi';
import { connectSocket, disconnectSocket } from '../services/socket';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { token, user } = await loginApi({ email, password });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('auth_snapshot', JSON.stringify({ token, user }));
      set({ token, user, loading: false });
      connectSocket();
      return user;
    } catch (e) {
      set({ error: e.response?.data?.message || 'Login failed', loading: false });
      throw e;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_snapshot');
    disconnectSocket();
    set({ user: null, token: null });
  }
}));