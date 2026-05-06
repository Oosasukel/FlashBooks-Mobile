import { api } from 'core/api/api';
import { authenticatedApi } from 'core/api/authenticatedApi';
import { googleAuthService } from 'services/googleAuth';

export const authService = {
  loginWithGoogle: async () => {
    const { idToken, user } = await googleAuthService.signIn();
    const response = await api.post<{ token: string }>(
      '/api/auth/loginWithGoogle',
      {
        idToken,
      }
    );

    return { ...response.data, user };
  },
  loginWithPassword: async (email: string, password: string) => {
    const response = await api.post<{ token: string }>(
      '/api/auth/loginWithPassword',
      { email, password }
    );
    return response.data;
  },
  setPassword: async (password: string) => {
    await authenticatedApi.post('/api/auth/setPassword', { password });
  },
};
