import {
  Comfortaa_300Light,
  Comfortaa_400Regular,
  Comfortaa_700Bold,
  useFonts,
} from '@expo-google-fonts/comfortaa';
import { ThemeProvider } from 'providers/ThemeProvider';
import React from 'react';
import { Routes } from 'routes';
import { ToastProvider } from 'providers/ToastProvider';
import { Settings } from 'luxon';

Settings.defaultLocale = 'pt-BR';
Settings.defaultZone = 'America/Sao_Paulo';

const App = () => {
  const [fontsLoaded] = useFonts({
    Comfortaa_300Light,
    Comfortaa_400Regular,
    Comfortaa_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <Routes />
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
