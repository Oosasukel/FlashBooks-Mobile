import { Button } from 'components/Button';
import { PageLayout } from 'components/PageLayout';
import { Typography, TypographyVariant } from 'components/Typography';
import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { RouteName, RouteParams } from 'routes/types';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from 'hooks/useTheme';
import { useAuthStore } from 'stores/useAuthStore';

export const Login = ({ route }: RouteParams<RouteName.Login>) => {
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const loginWithPassword = useAuthStore((state) => state.loginWithPassword);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { theme } = useTheme();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await loginWithGoogle();
    } catch (error) {
      console.error('Error signing in with Google', error);
      setError('Ocorreu um erro ao tentar fazer login. Tente novamente.');
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    if (!email || !password) {
      setError('Informe email e senha.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await loginWithPassword(email.trim(), password);
    } catch (error) {
      console.error('Error signing in with password', error);
      setError('Email ou senha inválidos.');
      setLoading(false);
    }
  };

  const inputStyle = {
    borderWidth: 1,
    borderColor: theme.colors.common.border.normal,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.colors.page.text,
    fontFamily: theme.fontFamily.regular,
    fontSize: 16,
    backgroundColor: theme.colors.card.background,
  };

  return (
    <PageLayout header={{ title: route.name }}>
      <View
        style={{
          display: 'flex',
          paddingHorizontal: 16,
          gap: 16,
          flexGrow: 1,
        }}>
        <Typography variant={TypographyVariant.Title}>Bem-vindo</Typography>
        <Typography variant={TypographyVariant.Body}>
          Entre com sua conta para continuar
        </Typography>

        <TextInput
          style={inputStyle}
          placeholder="Email"
          placeholderTextColor={theme.colors.common.icon.normal}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />
        <TextInput
          style={inputStyle}
          placeholder="Senha"
          placeholderTextColor={theme.colors.common.icon.normal}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        {error && (
          <Typography
            variant={TypographyVariant.Body}
            style={{ color: theme.colors.text.error }}>
            {error}
          </Typography>
        )}

        <Button
          onPress={handlePasswordLogin}
          disabled={loading}
          style={{ marginTop: 'auto' }}>
          <Typography variant={TypographyVariant.Button}>
            {loading ? 'Carregando...' : 'Entrar'}
          </Typography>
        </Button>

        <Typography
          variant={TypographyVariant.Small}
          style={{ textAlign: 'center' }}>
          ou
        </Typography>

        <Button onPress={handleGoogleLogin} disabled={loading}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
            <AntDesign
              name="google"
              size={24}
              color={theme.colors.button.primary.color}
            />
            <Typography variant={TypographyVariant.Button}>
              Entre com Google
            </Typography>
          </View>
        </Button>
      </View>
    </PageLayout>
  );
};
