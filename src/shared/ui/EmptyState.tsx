import React from 'react';
import { StyleSheet } from 'react-native';

import { FadeInView } from './animations';
import { UiCard, UiScreen, UiText } from './primitives';
import { spacing } from './theme/tokens';

type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({
  title,
  message,
}: EmptyStateProps): React.JSX.Element {
  return (
    <UiScreen centered padding="xxl">
      <FadeInView>
        <UiCard centered maxWidth={360}>
          <UiText
            accessibilityElementsHidden
            color="textTertiary"
            importantForAccessibility="no"
            style={styles.icon}
            variant="iconLarge"
          >
            •
          </UiText>
          <UiText align="center" variant="subtitle">
            {title}
          </UiText>
          <UiText
            align="center"
            color="textSecondary"
            style={styles.message}
            variant="body"
          >
            {message}
          </UiText>
        </UiCard>
      </FadeInView>
    </UiScreen>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: spacing.sm,
  },
  message: {
    marginTop: spacing.sm,
  },
});
