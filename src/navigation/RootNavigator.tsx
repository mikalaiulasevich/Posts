import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { DetailsScreen } from '../screens/details/DetailsScreen';
import { PostsScreen } from '../screens/posts/PostsScreen';

import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: '#F8FAFC',
        },
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#111827',
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <Stack.Screen
        name="Posts"
        component={PostsScreen}
        options={{ title: 'Posts' }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={({ route }) => ({ title: `Post #${route.params.postId}` })}
      />
    </Stack.Navigator>
  );
}
