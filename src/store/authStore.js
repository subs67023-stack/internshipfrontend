import { create } from 'zustand';
import api from '../utils/api';

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isInitializing: true,
    loading: false,

    login: async (email, password) => {
        set({ loading: true });
        try {
            const res = await api.post('/auth/login', { email, password });
            const { accessToken, user } = res.data;
            localStorage.setItem('token', accessToken);
            set({ user, token: accessToken, isAuthenticated: true, loading: false });
            return { success: true };
        } catch (error) {
            set({ loading: false });
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    },

    register: async (name, email, password) => {
        set({ loading: true });
        try {
            const res = await api.post('/auth/register', { name, email, password });
            const { accessToken, user } = res.data;
            localStorage.setItem('token', accessToken);
            set({ user, token: accessToken, isAuthenticated: true, loading: false });
            return { success: true };
        } catch (error) {
            set({ loading: false });
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
        api.post('/auth/logout');
    },

    checkAuth: async () => {
        if (!localStorage.getItem('token')) {
            set({ isInitializing: false });
            return;
        }
        try {
            const res = await api.get('/auth/me');
            set({ user: res.data.user, isAuthenticated: true, isInitializing: false });
        } catch (error) {
            localStorage.removeItem('token');
            set({ user: null, isAuthenticated: false, isInitializing: false });
        }
    }
}));

export default useAuthStore;
