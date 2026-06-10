import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { createAndroidRipple, minimumHitSlop } from '../theme/tokens';
import { useAppTheme } from '../theme/useAppTheme';

type ThemedPressableState = PressableStateCallbackType;

type UiPressableProps = Omit<PressableProps, 'style'> & {
  pressedOpacity?: boolean;
  pressedScale?: number;
  style?:
    | StyleProp<ViewStyle>
    | ((state: ThemedPressableState) => StyleProp<ViewStyle>);
};

export function UiPressable({
  accessibilityRole = 'button',
  android_ripple,
  hitSlop = minimumHitSlop,
  pressedOpacity = true,
  pressedScale,
  style,
  ...props
}: UiPressableProps): React.JSX.Element {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      android_ripple={android_ripple ?? createAndroidRipple(theme)}
      hitSlop={hitSlop}
      {...props}
      style={state => [
        typeof style === 'function' ? style(state) : style,
        pressedScale != null &&
          state.pressed &&
          createPressedScaleStyle(pressedScale),
        pressedOpacity &&
          Platform.OS !== 'android' &&
          state.pressed &&
          styles.pressed,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.78,
  },
});

function createPressedScaleStyle(scale: number): ViewStyle {
  return {
    transform: [{ scale }],
  };
}
