import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { googleAuthService } from 'services/googleAuth';
import { jwtDecode } from 'jwt-decode';
import { authService } from 'services/auth';
import { JwtPayload, User } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  user: User | null;
  loginWithGoogle: () => Promise<void>;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      loginWithGoogle: async () => {
        const { token, user } = await authService.loginWithGoogle();
        const payload = jwtDecode<JwtPayload>(token);

        set({
          token,
          user: {
            id: payload.userId,
            name: payload.username,
            email: payload.email,
            photo: user.photo || undefined,
          },
        });
      },
      loginWithPassword: async (email, password) => {
        const { token } = await authService.loginWithPassword(email, password);
        const payload = jwtDecode<JwtPayload>(token);

        set({
          token,
          user: {
            id: payload.userId,
            name: payload.username,
            email: payload.email,
          },
        });
      },
      logout: async () => {
        await googleAuthService.signOut();
        set({ token: null, user: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
