import React, { useCallback } from 'react';
import { BackHandler, Pressable, StyleSheet, Text } from 'react-native';

import { createLogger } from '../shared/lib/logger';
import { usePostsStore } from '../store/postsStore';

const logger = createLogger('ClearCacheButton');

export function ClearCacheButton(): React.JSX.Element {
  const clearCache = usePostsStore(state => state.clearCache);

  const handlePress = useCallback(() => {
    logger.warn('press');
    void clearCache().finally(() => {
      logger.warn('exitApp');
      BackHandler.exitApp();
    });
  }, [clearCache]);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={handlePress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.text}>Clear cache</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pressed: {
    opacity: 0.72,
  },
  text: {
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '800',
  },
});
