import { create } from 'zustand';
import axios from 'axios';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

interface AuthState {
  sessionToken: string | null;
  user: { id: string; name: string; email: string } | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const saveToStorage = (sessionToken: string | null, user: any) => {
  if (typeof window !== 'undefined') {
    if (sessionToken && user) {
      localStorage.setItem('auth-storage', JSON.stringify({ sessionToken, user }));
    } else {
      localStorage.removeItem('auth-storage');
    }
  }
};

const loadFromStorage = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('auth-storage');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao carregar auth do storage:', e);
      }
    }
  }
  return { sessionToken: null, user: null };
};

const stored = loadFromStorage();

export const useAuthStore = create<AuthState>((set) => ({
  sessionToken: stored.sessionToken,
  user: stored.user,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${baseURL}/api/auth/login`, { email, password });
      if (response.data.token) {
        const userData = {
          id: response.data.user.id,
          name: email.split('@')[0],
          email: response.data.user.email
        };
        set({
          sessionToken: response.data.token,
          user: userData,
          isLoading: false
        });
        saveToStorage(response.data.token, userData);
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch (error) {
      console.error('Login error:', error);
      set({ isLoading: false });
      return false;
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${baseURL}/api/auth/signup`, { email, password });
      if (response.data.token) {
        const userData = { id: response.data.user.id, name, email: response.data.user.email };
        set({
          sessionToken: response.data.token,
          user: userData,
          isLoading: false
        });
        saveToStorage(response.data.token, userData);
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      set({ isLoading: false });
      return false;
    }
  },

  logout: () => {
    set({ sessionToken: null, user: null });
    saveToStorage(null, null);
  },
}));