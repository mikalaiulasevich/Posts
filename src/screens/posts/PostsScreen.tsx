import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';

import type { PostListItem as PostListItemModel } from '../../entities/post/types';
import type { RootStackParamList } from '../../navigation/types';
import { createLogger } from '../../shared/lib/logger';
import { EmptyState } from '../../shared/ui/EmptyState';
import { ErrorState } from '../../shared/ui/ErrorState';
import { LoadingState } from '../../shared/ui/LoadingState';
import { configureFavoriteLayoutAnimation } from '../../shared/ui/animations';
import { UiScreen } from '../../shared/ui/primitives';
import { spacing } from '../../shared/ui/theme/tokens';
import { usePostsStore } from '../../store/postsStore';
import {
  isFavoritePost,
  selectFavoriteIds,
  selectFavoriteIdsById,
  selectIsPostsLoading,
  selectPosts,
  selectPostsError,
  sortPostsWithFavorites,
} from '../../store/selectors';

import { PostListItem } from './components/PostListItem';

const logger = createLogger('PostsScreen');
const DEFERRED_REORDER_DELAY_MS = 180;
const REORDER_SETTLE_DURATION_MS = 240;

type PostsScreenProps = NativeStackScreenProps<RootStackParamList, 'Posts'>;

const keyExtractor = (item: PostListItemModel): string => String(item.id);

export function PostsScreen({
  navigation,
}: PostsScreenProps): React.JSX.Element {
  const posts = usePostsStore(selectPosts);
  const favoriteIds = usePostsStore(selectFavoriteIds);
  const favoriteIdsById = usePostsStore(selectFavoriteIdsById);
  const isLoading = usePostsStore(selectIsPostsLoading);
  const error = usePostsStore(selectPostsError);
  const loadPosts = usePostsStore(state => state.loadPosts);
  const [visibleFavoriteIdsById, setVisibleFavoriteIdsById] =
    useState(favoriteIdsById);
  const appliedFavoriteIdsRef = useRef(favoriteIds);
  const hasFocusedOnceRef = useRef(false);
  const listSettleProgress = useRef(new Animated.Value(1)).current;
  const [hasRequestedPosts, setHasRequestedPosts] = useState(false);
  const sortedPosts = useMemo(
    () => sortPostsWithFavorites(posts, visibleFavoriteIdsById),
    [posts, visibleFavoriteIdsById],
  );
  const listSettleStyle = useMemo(
    () => ({
      opacity: listSettleProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0.9, 1],
      }),
      transform: [
        {
          translateY: listSettleProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [10, 0],
          }),
        },
      ],
    }),
    [listSettleProgress],
  );

  const requestPosts = useCallback(() => {
    setHasRequestedPosts(true);
    logger.info('requestPosts');
    void loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    requestPosts();
  }, [requestPosts]);

  useFocusEffect(
    useCallback(() => {
      const isFirstFocus = !hasFocusedOnceRef.current;
      const hasFavoriteOrderChanged =
        appliedFavoriteIdsRef.current !== favoriteIds;

      if (isFirstFocus) {
        hasFocusedOnceRef.current = true;
        appliedFavoriteIdsRef.current = favoriteIds;
        setVisibleFavoriteIdsById(favoriteIdsById);
        return undefined;
      }

      if (!hasFavoriteOrderChanged) {
        return undefined;
      }

      const reorderTimer = setTimeout(() => {
        listSettleProgress.stopAnimation();
        listSettleProgress.setValue(0);
        configureFavoriteLayoutAnimation();
        appliedFavoriteIdsRef.current = favoriteIds;
        setVisibleFavoriteIdsById(favoriteIdsById);
        Animated.timing(listSettleProgress, {
          duration: REORDER_SETTLE_DURATION_MS,
          easing: Easing.out(Easing.cubic),
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }, DEFERRED_REORDER_DELAY_MS);

      return () => {
        clearTimeout(reorderTimer);
        listSettleProgress.stopAnimation();
      };
    }, [favoriteIds, favoriteIdsById, listSettleProgress]),
  );

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
        isFavorite={isFavoritePost(visibleFavoriteIdsById, item.id)}
        onPress={handlePostPress}
      />
    ),
    [handlePostPress, visibleFavoriteIdsById],
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
      <Animated.View style={[styles.listContainer, listSettleStyle]}>
        <Animated.FlatList
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
      </Animated.View>
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
  listContainer: {
    flex: 1,
  },
  separator: {
    height: spacing.md,
  },
});
