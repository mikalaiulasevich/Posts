import React, { useEffect, useRef, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

type FadeInViewProps = ViewProps & {
  children: ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
  initialScale?: number;
  style?: StyleProp<ViewStyle>;
};

export function FadeInView({
  children,
  delay = 0,
  distance = 8,
  duration = 260,
  initialScale = 1,
  style,
  ...props
}: FadeInViewProps): React.JSX.Element {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);

    const animation = Animated.timing(progress, {
      delay,
      duration,
      easing: Easing.out(Easing.cubic),
      toValue: 1,
      useNativeDriver: true,
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, [delay, duration, progress]);

  return (
    <Animated.View
      {...props}
      style={[
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [distance, 0],
              }),
            },
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [initialScale, 1],
              }),
            },
          ],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}
