import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { spacing, typography } from './theme/tokens';
import { useAppTheme } from './theme/useAppTheme';

type LoadingStateProps = {
  label?: string;
};

export function LoadingState({
  label = 'Loading...',
}: LoadingStateProps): React.JSX.Element {
  const theme = useAppTheme();

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
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
        <ActivityIndicator color={theme.colors.accent} size="large" />
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  card: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
    minWidth: 180,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl,
  },
  label: {
    ...typography.caption,
    textAlign: 'center',
  },
});
