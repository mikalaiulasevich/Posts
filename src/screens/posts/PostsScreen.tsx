import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import type { PostListItem as PostListItemModel } from '../../entities/post/types';
import type { RootStackParamList } from '../../navigation/types';
import { EmptyState } from '../../shared/ui/EmptyState';
import { ErrorState } from '../../shared/ui/ErrorState';
import { LoadingState } from '../../shared/ui/LoadingState';
import { createLogger } from '../../shared/lib/logger';
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

  const renderItem = useCallback(
    ({ item }: { item: PostListItemModel }) => (
      <PostListItem
        post={item}
        isFavorite={favoriteIds.includes(item.id)}
        onPress={() => {
          logger.info('navigate:details', { id: item.id });
          navigation.navigate('Details', { postId: item.id });
        }}
      />
    ),
    [favoriteIds, navigation],
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
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.content}
        data={sortedPosts}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
      />
    </View>
  );
}

function Separator(): React.JSX.Element {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  content: {
    padding: 16,
  },
  separator: {
    height: 12,
  },
});
