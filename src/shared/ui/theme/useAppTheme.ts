import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { getAppTheme, type AppTheme } from './tokens';

export function useAppTheme(): AppTheme {
  const colorScheme = useColorScheme();

  return useMemo(() => getAppTheme(colorScheme), [colorScheme]);
}
