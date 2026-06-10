import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

type PulseOptions = {
  duration?: number;
  peakScale?: number;
};

export function usePulseOnChange(
  value: unknown,
  { duration = 150, peakScale = 1.06 }: PulseOptions = {},
) {
  const scale = useRef(new Animated.Value(1)).current;
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const animation = Animated.sequence([
      Animated.timing(scale, {
        duration,
        easing: Easing.out(Easing.cubic),
        toValue: peakScale,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        duration,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [duration, peakScale, scale, value]);

  return {
    transform: [{ scale }],
  };
}
