import React from 'react';
import {
  StyleSheet,
  Text,
  type StyleProp,
  type TextProps,
  type TextStyle,
} from 'react-native';

import {
  type AppColorToken,
  type AppTypographyToken,
  typography,
} from '../theme/tokens';
import { useAppTheme } from '../theme/useAppTheme';

type UiTextProps = TextProps & {
  align?: TextStyle['textAlign'];
  color?: AppColorToken;
  transform?: TextStyle['textTransform'];
  variant?: AppTypographyToken;
};

export function UiText({
  align,
  color = 'textPrimary',
  style,
  transform,
  variant = 'body',
  ...props
}: UiTextProps): React.JSX.Element {
  const theme = useAppTheme();

  return (
    <Text
      {...props}
      style={[
        typography[variant] as StyleProp<TextStyle>,
        {
          color: theme.colors[color],
          textAlign: align,
          textTransform: transform,
        },
        styles.fontSmoothing,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  fontSmoothing: {
    includeFontPadding: false,
  },
});
