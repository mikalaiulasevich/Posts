import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/types';
import {
  isFavoritePost,
  selectFavoriteIdsById,
  selectIsPostsLoading,
  selectPosts,
  selectPostsError,
  sortPostsWithFavorites,
} from '../../store/selectors';
import { usePostsStore } from '../../store/postsStore';
import type { PostListItem as PostListItemModel } from '../../entities/post/types';
import { createLogger } from '../../shared/lib/logger';
import { EmptyState } from '../../shared/ui/EmptyState';
import { ErrorState } from '../../shared/ui/ErrorState';
import { LoadingState } from '../../shared/ui/LoadingState';
import { UiScreen } from '../../shared/ui/primitives';
import { spacing } from '../../shared/ui/theme/tokens';

import { PostListItem } from './components/PostListItem';

const logger = createLogger('PostsScreen');

type PostsScreenProps = NativeStackScreenProps<RootStackParamList, 'Posts'>;

const keyExtractor = (item: PostListItemModel): string => String(item.id);

export function PostsScreen({
  navigation,
}: PostsScreenProps): React.JSX.Element {
  const posts = usePostsStore(selectPosts);
  const favoriteIdsById = usePostsStore(selectFavoriteIdsById);
  const isLoading = usePostsStore(selectIsPostsLoading);
  const error = usePostsStore(selectPostsError);
  const loadPosts = usePostsStore(state => state.loadPosts);
  const [hasRequestedPosts, setHasRequestedPosts] = useState(false);
  const sortedPosts = useMemo(
    () => sortPostsWithFavorites(posts, favoriteIdsById),
    [favoriteIdsById, posts],
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
        isFavorite={isFavoritePost(favoriteIdsById, item.id)}
        onPress={handlePostPress}
      />
    ),
    [favoriteIdsById, handlePostPress],
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
    <UiScreen>
      <FlatList
        contentContainerStyle={styles.content}
        data={sortedPosts}
        initialNumToRender={12}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        ListFooterComponent={Footer}
        maxToRenderPerBatch={12}
        removeClippedSubviews={Platform.OS === 'android'}
        showsVerticalScrollIndicator={false}
        updateCellsBatchingPeriod={40}
        windowSize={7}
      />
    </UiScreen>
  );
}

function Separator(): React.JSX.Element {
  return <View style={styles.separator} />;
}

function Footer(): React.JSX.Element {
  return <View style={styles.footer} />;
}

const styles = StyleSheet.create({
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
