import React, { useMemo } from 'react';
import { PageLayout } from 'components/PageLayout';
import { Typography, TypographyVariant } from 'components/Typography';
import { useTheme } from 'hooks/useTheme';
import { View, Image } from 'react-native';
import { RouteName, RouteParams, StackNavigation } from 'routes/types';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from 'stores/useAuthStore';
import { ThemeName } from 'theme/types';
import { MaterialIcons } from '@expo/vector-icons';
import { DateTime } from 'luxon';
import { Button } from 'components/Button';
import { useSubscription } from 'hooks/useSubscription';
import { getInitials } from './utils/getInitials';
import { SubscriptionStatus } from 'services/subscriptions/types';

export const Config = ({ route }: RouteParams<RouteName.Config>) => {
  const { subscription } = useSubscription();
  const { theme, changeTheme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigation = useNavigation<StackNavigation>();

  const handleThemeToggle = () => {
    changeTheme(
      theme.name === ThemeName.Dark ? ThemeName.Light : ThemeName.Dark
    );
  };

  const subscriptionStatusLabel = useMemo(() => {
    switch (subscription?.status) {
      case SubscriptionStatus.ACTIVE:
        return 'Ativa';
      case SubscriptionStatus.CANCELED:
        return 'Cancelada';
      case SubscriptionStatus.EXPIRED:
        return 'Expirada';
      case SubscriptionStatus.ON_HOLD:
        return 'Suspensa';
      case SubscriptionStatus.REVOKED:
        return 'Revogada';
      default:
        return 'Não assinada';
    }
  }, [subscription]);

  return (
    <PageLayout header={{ title: route.name }}>
      <View style={{ padding: 16, gap: 24 }}>
        {/* Perfil do Usuário */}
        {user && (
          <View style={{ alignItems: 'center', gap: 8 }}>
            {user.photo ? (
              <Image
                source={{ uri: user.photo }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: theme.colors.card.background,
                }}
              />
            ) : (
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: theme.colors.card.background,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Typography
                  variant={TypographyVariant.Title}
                  style={{
                    fontSize: 48,
                    color: theme.colors.page.text,
                  }}>
                  {getInitials(user.name)}
                </Typography>
              </View>
            )}
            <Typography
              variant={TypographyVariant.Title}
              style={{
                textAlign: 'center',
              }}>
              {user.name}
            </Typography>
            <Typography
              variant={TypographyVariant.Body}
              style={{ color: theme.colors.page.text, textAlign: 'center' }}>
              {user.email}
            </Typography>
          </View>
        )}

        {/* Informações da Assinatura */}
        {!!subscription && (
          <View
            style={{
              backgroundColor: theme.colors.card.background,
              padding: 16,
              borderRadius: 8,
              gap: 8,
            }}>
            {/* deeplink pra assinatura */}
            {/* <Button
              variant="ghost"
              onPress={() =>
                deepLinkToSubscriptions({
                  sku: premiumSubscriptionSku,
                })
              }
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                gap: 8,
              }}>
              <MaterialIcons
                name="subscriptions"
                size={24}
                color={theme.colors.button.ghost.color}
              />
            </Button> */}

            <Typography variant={TypographyVariant.Subtitle}>
              Informações da Assinatura
            </Typography>

            <Typography variant={TypographyVariant.Body}>
              Status: {subscriptionStatusLabel}
            </Typography>
            <Typography variant={TypographyVariant.Body}>
              {subscription.autoRenewing ? 'Renova em: ' : 'Expira em: '}
              {DateTime.fromISO(subscription.expiryTime).toFormat(
                'dd/MM/yyyy HH:mm'
              )}
            </Typography>
          </View>
        )}

        {/* Configurações de Tema */}
        <Button
          variant="ghost"
          onPress={handleThemeToggle}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 8,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              flex: 1,
            }}>
            <MaterialIcons
              name={theme.name === ThemeName.Dark ? 'light-mode' : 'dark-mode'}
              size={24}
              color={theme.colors.button.ghost.color}
            />
            <Typography variant={TypographyVariant.ButtonGhost}>
              Tema {theme.name === ThemeName.Dark ? 'Claro' : 'Escuro'}
            </Typography>
          </View>
        </Button>

        {/* Definir/Alterar senha */}
        <Button
          variant="ghost"
          onPress={() => navigation.navigate(RouteName.SetPassword)}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            gap: 8,
          }}>
          <MaterialIcons
            name="lock"
            size={24}
            color={theme.colors.button.ghost.color}
          />
          <Typography variant={TypographyVariant.ButtonGhost}>
            Definir senha
          </Typography>
        </Button>

        {/* Botão de Logout */}
        <Button
          variant="ghost"
          onPress={logout}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            gap: 8,
          }}>
          <MaterialIcons
            name="logout"
            size={24}
            color={theme.colors.button.ghost.color}
          />
          <Typography variant={TypographyVariant.ButtonGhost}>Sair</Typography>
        </Button>
      </View>
    </PageLayout>
  );
};
