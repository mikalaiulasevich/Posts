import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { PostListItem as PostListItemModel } from '../../entities/post/types';
import type { RootStackParamList } from '../../navigation/types';
import { EmptyState } from '../../shared/ui/EmptyState';
import { ErrorState } from '../../shared/ui/ErrorState';
import { LoadingState } from '../../shared/ui/LoadingState';
import { createLogger } from '../../shared/lib/logger';
import { spacing } from '../../shared/ui/theme/tokens';
import { useAppTheme } from '../../shared/ui/theme/useAppTheme';
import {
  selectFavoriteIds,
  selectIsPostsLoading,
  selectPosts,
  selectPostsError,
  sortPostsWithFavorites,
} from '../../store/selectors';
import { usePostsStore } from '../../store/postsStore';

import { PostListItem } from './components/PostListItem';

const logger = createLogger('PostsScreen');

type PostsScreenProps = NativeStackScreenProps<RootStackParamList, 'Posts'>;

export function PostsScreen({
  navigation,
}: PostsScreenProps): React.JSX.Element {
  const theme = useAppTheme();
  const posts = usePostsStore(selectPosts);
  const favoriteIds = usePostsStore(selectFavoriteIds);
  const isLoading = usePostsStore(selectIsPostsLoading);
  const error = usePostsStore(selectPostsError);
  const loadPosts = usePostsStore(state => state.loadPosts);
  const [hasRequestedPosts, setHasRequestedPosts] = useState(false);
  const sortedPosts = useMemo(
    () => sortPostsWithFavorites(posts, favoriteIds),
    [favoriteIds, posts],
  );

  const requestPosts = useCallback(() => {
    setHasRequestedPosts(true);
    logger.info('requestPosts');
    void loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    requestPosts();
  }, [requestPosts]);

  const handlePostPress = useCallback(
    (postId: number) => {
      logger.info('navigate:details', { id: postId });
      navigation.navigate('Details', { postId });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: PostListItemModel }) => (
      <PostListItem
        post={item}
        isFavorite={favoriteIds.includes(item.id)}
        onPress={handlePostPress}
      />
    ),
    [favoriteIds, handlePostPress],
  );

  if (isLoading && posts.length === 0) {
    return <LoadingState label="Loading posts..." />;
  }

  if (error != null && posts.length === 0) {
    return <ErrorState message={error} onRetry={requestPosts} />;
  }

  if (hasRequestedPosts && !isLoading && posts.length === 0) {
    return (
      <EmptyState
        title="No posts yet"
        message="The posts list is empty. Try again later."
      />
    );
  }

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        contentContainerStyle={[
          styles.content,
          { backgroundColor: theme.colors.background },
        ]}
        data={sortedPosts}
        initialNumToRender={12}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        ListFooterComponent={Footer}
        maxToRenderPerBatch={12}
        removeClippedSubviews={Platform.OS === 'android'}
        showsVerticalScrollIndicator={false}
        updateCellsBatchingPeriod={40}
        windowSize={7}
      />
    </SafeAreaView>
  );
}

function Separator(): React.JSX.Element {
  return <View style={styles.separator} />;
}

function Footer(): React.JSX.Element {
  return <View style={styles.footer} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  footer: {
    height: spacing.xl,
  },
  separator: {
    height: spacing.md,
  },
});
