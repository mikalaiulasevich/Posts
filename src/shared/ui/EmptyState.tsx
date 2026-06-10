import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { radius, spacing, typography } from './theme/tokens';
import { useAppTheme } from './theme/useAppTheme';

type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({
  title,
  message,
}: EmptyStateProps): React.JSX.Element {
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
        <Text
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={[styles.icon, { color: theme.colors.textTertiary }]}
        >
          •
        </Text>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          {title}
        </Text>
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
          {message}
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
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: 360,
    padding: spacing.xxl,
  },
  icon: {
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 36,
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.body,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  title: {
    ...typography.subtitle,
    textAlign: 'center',
  },
});
