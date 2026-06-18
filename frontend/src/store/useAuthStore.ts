import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  initialized: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  verifyUser: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  initialized: false,

  login: (token, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('applywise_token', token);
      localStorage.setItem('applywise_user', JSON.stringify(user));
    }
    set({ token, user, isAuthenticated: true, initialized: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('applywise_token');
      localStorage.removeItem('applywise_user');
    }
    set({ token: null, user: null, isAuthenticated: false, initialized: true });
  },

  verifyUser: () => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, isVerified: true };
      if (typeof window !== 'undefined') {
        localStorage.setItem('applywise_user', JSON.stringify(updatedUser));
      }
      return { user: updatedUser };
    });
  },

  initialize: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('applywise_token');
      const userStr = localStorage.getItem('applywise_user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ token, user, isAuthenticated: true, initialized: true });
        } catch {
          localStorage.removeItem('applywise_token');
          localStorage.removeItem('applywise_user');
          set({ initialized: true });
        }
      } else if (token) {
        // Token exists but no user info; consider authenticated
        set({ token, user: null, isAuthenticated: true, initialized: true });
      } else {
        set({ initialized: true });
      }
    }
  },
}));
