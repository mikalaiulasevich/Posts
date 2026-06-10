import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { DetailsScreen } from '../screens/details/DetailsScreen';
import { PostsScreen } from '../screens/posts/PostsScreen';
import { typography, type AppTheme } from '../shared/ui/theme/tokens';

import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

type RootNavigatorProps = {
  theme: AppTheme;
};

export function RootNavigator({
  theme,
}: RootNavigatorProps): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        headerShadowVisible: !theme.isDark,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          fontSize: typography.subtitle.fontSize,
          fontWeight: typography.subtitle.fontWeight,
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
