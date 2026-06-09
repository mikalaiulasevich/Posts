import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

function Application(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Posts</Text>
        <Text style={styles.subtitle}>Phase 1 project structure is ready.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#4B5563',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default Application;
