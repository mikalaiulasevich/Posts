import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type LoadingStateProps = {
  label?: string;
};

export function LoadingState({
  label = 'Loading...',
}: LoadingStateProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <ActivityIndicator color="#2563EB" size="large" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    padding: 24,
  },
  label: {
    color: '#475569',
    fontSize: 15,
  },
});
