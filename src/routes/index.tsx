import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BookList } from 'pages/BookList';
import { Discover } from 'pages/Home/Discover';
import { Library } from 'pages/Home/Library';
import { Login } from 'pages/Login';
import { Reading } from 'pages/Reading';
import {
  RouteName,
  RouteParams,
  StackRouteParamList,
  TabRouteParamList,
} from './types';
import { buildHomeScreenOptions } from './styles';
import { Subscription as SubscriptionPage } from 'pages/Subscription';
import { useAuthStore } from 'stores/useAuthStore';
import React, { useCallback, useEffect, useState } from 'react';
import { useTheme } from 'hooks/useTheme';
import { booksService } from 'services/books';
import { useBooks } from 'hooks/useBooks';
import { BooksProvider } from 'providers/BooksProvider';
import { ReadingProvider } from 'providers/ReadingProvider';
import { StatusBar } from 'expo-status-bar';
import { ThemeName } from 'theme/types';
import { LoadingPage } from 'components/LoadingPage';
import { ErrorPage } from 'components/ErrorPage';
import { Config } from 'pages/Home/Config';
import { SetPassword } from 'pages/SetPassword';
import { useSubscription } from 'hooks/useSubscription';
import { SubscriptionProvider } from 'providers/SubscriptionProvider';
import { IAPListenerProvider } from 'providers/IAPListenerProvider';

const Stack = createNativeStackNavigator<StackRouteParamList>();
const Tab = createBottomTabNavigator<TabRouteParamList>();

export const Home = (_props: RouteParams<RouteName.Home>) => {
  const { theme } = useTheme();
  const { books } = useBooks();

  const inProgressBooks = React.useMemo(() => {
    return books.filter((book) => book.lastReadAt);
  }, [books]);

  return (
    <Tab.Navigator
      initialRouteName={
        inProgressBooks.length ? RouteName.Library : RouteName.Discover
      }
      screenOptions={buildHomeScreenOptions({ theme })}>
      <Tab.Screen name={RouteName.Discover} component={Discover} />
      <Tab.Screen name={RouteName.Library} component={Library} />
      <Tab.Screen name={RouteName.Config} component={Config} />
    </Tab.Navigator>
  );
};

export const LoggedInRoutes = () => {
  const { lastSync, syncData } = useBooks();
  const {
    subscription,
    error: errorSubscription,
    loading: isLoadingSubscription,
  } = useSubscription();
  const [isLoadingSync, setIsLoadingSync] = useState(true);
  const [errorSync, setErrorSync] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoadingSync(true);
      setErrorSync(false);

      if (subscription) {
        const syncResponse = await booksService.getNotSyncedData({
          lastSync,
        });

        syncData(syncResponse);
      }
    } catch (error) {
      console.error('Error loading synced data', error);
      setErrorSync(true);
    } finally {
      setIsLoadingSync(false);
    }
  }, [lastSync, subscription, syncData]);

  useEffect(() => {
    if (isLoadingSubscription) return;

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingSubscription]);

  if ((isLoadingSubscription || isLoadingSync) && !lastSync) {
    return <LoadingPage />;
  }

  if (errorSync && !lastSync) {
    return <ErrorPage onRetry={loadData} />;
  }

  if (errorSubscription && !subscription && !lastSync) {
    return <ErrorPage />;
  }

  const shouldShowHome = Boolean(
    subscription || (isLoadingSubscription && lastSync)
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_bottom',
      }}>
      {shouldShowHome ? (
        <>
          <Stack.Screen name={RouteName.Home} component={Home} />
          <Stack.Screen name={RouteName.Reading} component={Reading} />
          <Stack.Screen name={RouteName.BookList} component={BookList} />
          <Stack.Screen
            name={RouteName.SetPassword}
            component={SetPassword}
          />
        </>
      ) : (
        <Stack.Screen
          name={RouteName.Subscription}
          component={SubscriptionPage}
        />
      )}
    </Stack.Navigator>
  );
};

export const Routes = () => {
  const user = useAuthStore((state) => state.user);
  const { theme } = useTheme();

  return (
    <>
      <NavigationContainer>
        {user ? (
          <SubscriptionProvider>
            <IAPListenerProvider>
              <BooksProvider userId={user.id}>
                <ReadingProvider userId={user.id}>
                  <LoggedInRoutes />
                </ReadingProvider>
              </BooksProvider>
            </IAPListenerProvider>
          </SubscriptionProvider>
        ) : (
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_bottom',
            }}>
            <Stack.Screen name={RouteName.Login} component={Login} />
          </Stack.Navigator>
        )}
      </NavigationContainer>

      <StatusBar style={theme.name === ThemeName.Dark ? 'light' : 'dark'} />
    </>
  );
};
