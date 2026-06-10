import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import React, { useMemo } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from '../navigation/RootNavigator';
import { getAppTheme } from '../shared/ui/theme/tokens';

function Application(): React.JSX.Element {
  const theme = getAppTheme(useColorScheme());
  const navigationTheme = useMemo<NavigationTheme>(() => {
    const baseTheme = theme.isDark ? DarkTheme : DefaultTheme;

    return {
      ...baseTheme,
      dark: theme.isDark,
      colors: {
        ...baseTheme.colors,
        background: theme.colors.background,
        border: theme.colors.border,
        card: theme.colors.surface,
        notification: theme.colors.favoriteIcon,
        primary: theme.colors.accent,
        text: theme.colors.textPrimary,
      },
    };
  }, [theme]);

  return (
    <SafeAreaProvider>
      <StatusBar
        animated
        backgroundColor={theme.colors.surface}
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
      />
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator theme={theme} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default Application;
