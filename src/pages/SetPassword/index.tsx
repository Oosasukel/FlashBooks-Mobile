import { Button } from 'components/Button';
import { PageLayout } from 'components/PageLayout';
import { Typography, TypographyVariant } from 'components/Typography';
import { useTheme } from 'hooks/useTheme';
import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { authService } from 'services/auth';
import { RouteName, RouteParams } from 'routes/types';

const MIN_PASSWORD_LENGTH = 6;

export const SetPassword = ({
  navigation,
}: RouteParams<RouteName.SetPassword>) => {
  const { theme } = useTheme();
  const [password, setPasswordValue] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`A senha deve ter ao menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await authService.setPassword(password);
      setSuccess(true);
      setTimeout(() => navigation.goBack(), 1200);
    } catch (err) {
      console.error('Error setting password', err);
      setError('Não foi possível salvar a senha. Tente novamente.');
    } finally {
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
    <PageLayout header={{ title: 'Definir senha', canGoBack: true }}>
      <View style={{ paddingHorizontal: 16, gap: 16, flexGrow: 1 }}>
        <Typography variant={TypographyVariant.Body}>
          Defina uma senha para conseguir entrar com email e senha além do
          Google.
        </Typography>

        <TextInput
          style={inputStyle}
          placeholder="Nova senha"
          placeholderTextColor={theme.colors.common.icon.normal}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          value={password}
          onChangeText={setPasswordValue}
          editable={!loading}
        />
        <TextInput
          style={inputStyle}
          placeholder="Confirmar senha"
          placeholderTextColor={theme.colors.common.icon.normal}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
          editable={!loading}
        />

        {error && (
          <Typography
            variant={TypographyVariant.Body}
            style={{ color: theme.colors.text.error }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography variant={TypographyVariant.Body}>
            Senha salva com sucesso.
          </Typography>
        )}

        <Button
          onPress={handleSubmit}
          disabled={loading || success}
          style={{ marginTop: 'auto' }}>
          <Typography variant={TypographyVariant.Button}>
            {loading ? 'Salvando...' : 'Salvar senha'}
          </Typography>
        </Button>
      </View>
    </PageLayout>
  );
};
