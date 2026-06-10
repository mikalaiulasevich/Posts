import React from 'react';
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import {
  type AppColorToken,
  type AppSpacingToken,
  createCardShadow,
  radius,
  spacing,
} from '../theme/tokens';
import { useAppTheme } from '../theme/useAppTheme';

type UiCardProps = ViewProps & {
  background?: AppColorToken;
  border?: AppColorToken;
  centered?: boolean;
  maxWidth?: number;
  padding?: AppSpacingToken | false;
  shadow?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function UiCard({
  background = 'surface',
  border = 'border',
  centered = false,
  maxWidth,
  padding = 'xl',
  shadow = false,
  style,
  ...props
}: UiCardProps): React.JSX.Element {
  const theme = useAppTheme();

  return (
    <View
      {...props}
      style={[
        styles.base,
        shadow && createCardShadow(theme),
        centered && styles.centered,
        {
          backgroundColor: theme.colors[background],
          borderColor: theme.colors[border],
          maxWidth,
          padding: padding === false ? undefined : spacing[padding],
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
  },
  centered: {
    alignItems: 'center',
  },
});
