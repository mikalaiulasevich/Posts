import React from 'react';
import { StyleSheet, View } from 'react-native';

import { FadeInView } from './animations';
import { UiButton, UiCard, UiScreen, UiText } from './primitives';
import { radius, size, spacing } from './theme/tokens';
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
    <UiScreen centered padding="xxl">
      <FadeInView>
        <UiCard centered maxWidth={360}>
          <View
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={[
              styles.iconContainer,
              { backgroundColor: theme.colors.dangerBackground },
            ]}
          >
            <UiText color="danger" variant="icon">
              !
            </UiText>
          </View>
          <UiText align="center" color="danger" variant="subtitle">
            Something went wrong
          </UiText>
          <UiText
            align="center"
            color="textSecondary"
            style={styles.message}
            variant="body"
          >
            {message}
          </UiText>
          {onRetry != null ? (
            <UiButton
              accessibilityLabel="Try loading the content again"
              label="Try again"
              onPress={onRetry}
              style={styles.button}
            />
          ) : null}
        </UiCard>
      </FadeInView>
    </UiScreen>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: spacing.lg,
    minWidth: 132,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: size.stateIcon,
    justifyContent: 'center',
    marginBottom: spacing.md,
    width: size.stateIcon,
  },
  message: {
    marginTop: spacing.sm,
  },
});
