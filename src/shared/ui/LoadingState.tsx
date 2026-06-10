import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { FadeInView } from './animations';
import { UiCard, UiScreen, UiText } from './primitives';
import { spacing } from './theme/tokens';
import { useAppTheme } from './theme/useAppTheme';

type LoadingStateProps = {
  label?: string;
};

export function LoadingState({
  label = 'Loading...',
}: LoadingStateProps): React.JSX.Element {
  const theme = useAppTheme();

  return (
    <UiScreen
      accessibilityLabel={label}
      accessibilityRole="progressbar"
      centered
      padding="xxl"
    >
      <FadeInView>
        <UiCard centered maxWidth={360} style={styles.card}>
          <ActivityIndicator color={theme.colors.accent} size="large" />
          <UiText align="center" color="textSecondary" variant="caption">
            {label}
          </UiText>
        </UiCard>
      </FadeInView>
    </UiScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    minWidth: 180,
  },
});
