import React from 'react';
import {
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { radius, size, spacing } from '../theme/tokens';
import { useAppTheme } from '../theme/useAppTheme';

import { UiPressable } from './UiPressable';
import { UiText } from './UiText';

type UiButtonVariant = 'favorite' | 'primary';

type UiButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  icon?: string;
  label: string;
  style?: StyleProp<ViewStyle>;
  variant?: UiButtonVariant;
};

export function UiButton({
  icon,
  label,
  style,
  variant = 'primary',
  ...props
}: UiButtonProps): React.JSX.Element {
  const theme = useAppTheme();
  const isFavoriteVariant = variant === 'favorite';

  return (
    <UiPressable
      {...props}
      pressedScale={0.98}
      style={[
        styles.container,
        {
          backgroundColor: isFavoriteVariant
            ? theme.colors.favoriteBackground
            : theme.colors.accent,
          borderColor: isFavoriteVariant
            ? theme.colors.favoriteBorder
            : theme.colors.accent,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {icon != null ? (
          <UiText
            accessibilityElementsHidden
            color={isFavoriteVariant ? 'favorite' : 'onAccent'}
            importantForAccessibility="no"
            variant="subtitle"
          >
            {icon}
          </UiText>
        ) : null}
        <UiText
          color={isFavoriteVariant ? 'favorite' : 'onAccent'}
          variant="bodyStrong"
        >
          {label}
        </UiText>
      </View>
    </UiPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    borderWidth: 1,
    minHeight: size.favoriteButtonMinHeight,
    overflow: 'hidden',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
});
