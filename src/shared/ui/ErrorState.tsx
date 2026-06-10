import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  createAndroidRipple,
  minimumHitSlop,
  radius,
  spacing,
  typography,
} from './theme/tokens';
import { useAppTheme } from './theme/useAppTheme';

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({
  message,
  onRetry,
}: ErrorStateProps): React.JSX.Element {
  const theme = useAppTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={[
            styles.iconContainer,
            { backgroundColor: theme.colors.dangerBackground },
          ]}
        >
          <Text style={[styles.icon, { color: theme.colors.danger }]}>!</Text>
        </View>
        <Text style={[styles.title, { color: theme.colors.danger }]}>
          Something went wrong
        </Text>
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
          {message}
        </Text>
        {onRetry != null ? (
          <Pressable
            accessibilityLabel="Try loading the content again"
            accessibilityRole="button"
            android_ripple={createAndroidRipple(theme)}
            hitSlop={minimumHitSlop}
            onPress={onRetry}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: theme.colors.accent,
              },
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.buttonText}>Try again</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.md,
    minHeight: 48,
    minWidth: 132,
    justifyContent: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  buttonText: {
    color: '#FFFFFF',
    ...typography.caption,
  },
  card: {
    alignItems: 'center',
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: 360,
    padding: spacing.xxl,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  icon: {
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 24,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: 42,
    justifyContent: 'center',
    marginBottom: spacing.md,
    width: 42,
  },
  message: {
    ...typography.body,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.78,
  },
  title: {
    ...typography.subtitle,
    textAlign: 'center',
  },
});
