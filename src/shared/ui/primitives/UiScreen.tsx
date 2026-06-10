import React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import {
  SafeAreaView,
  type Edge,
  type NativeSafeAreaViewProps,
} from 'react-native-safe-area-context';

import { type AppSpacingToken, spacing } from '../theme/tokens';
import { useAppTheme } from '../theme/useAppTheme';

type UiScreenProps = NativeSafeAreaViewProps & {
  centered?: boolean;
  edges?: Edge[];
  padding?: AppSpacingToken | false;
  style?: StyleProp<ViewStyle>;
};

export function UiScreen({
  centered = false,
  edges = ['bottom'],
  padding = false,
  style,
  ...props
}: UiScreenProps): React.JSX.Element {
  const theme = useAppTheme();

  return (
    <SafeAreaView
      edges={edges}
      {...props}
      style={[
        styles.base,
        centered && styles.centered,
        {
          backgroundColor: theme.colors.background,
          padding: padding === false ? undefined : spacing[padding],
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
