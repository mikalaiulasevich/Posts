import type { PostDetails, PostListItem } from '../entities/post/types';
import { createLogger } from '../shared/lib/logger';

import type { PostsState } from './postsStore';

const logger = createLogger('PostSelectors');

export const selectPosts = (state: PostsState): PostListItem[] => state.posts;

export const selectFavoriteIds = (state: PostsState): number[] =>
  state.favoriteIds;

export const selectCacheVersion = (state: PostsState): number =>
  state.cacheVersion;

export const selectIsPostsLoading = (state: PostsState): boolean =>
  state.isPostsLoading;

export const selectPostsError = (state: PostsState): string | null =>
  state.postsError;

export function sortPostsWithFavorites(
  posts: PostListItem[],
  favoriteIds: number[],
): PostListItem[] {
  logger.info('sortPostsWithFavorites:run', {
    favoriteCount: favoriteIds.length,
    postCount: posts.length,
  });

  const favoriteIdSet = new Set(favoriteIds);

  return posts
    .map((post, index) => ({ index, post }))
    .sort((firstItem, secondItem) => {
      const isFirstFavorite = favoriteIdSet.has(firstItem.post.id);
      const isSecondFavorite = favoriteIdSet.has(secondItem.post.id);

      if (isFirstFavorite === isSecondFavorite) {
        return firstItem.index - secondItem.index;
      }

      return isFirstFavorite ? -1 : 1;
    })
    .map(({ post }) => post);
}

export const selectIsFavorite =
  (id: number) =>
  (state: PostsState): boolean =>
    state.favoriteIds.includes(id);

export const selectPostDetails =
  (id: number) =>
  (state: PostsState): PostDetails | undefined =>
    state.detailsById[id];

export const selectIsPostDetailsLoading =
  (id: number) =>
  (state: PostsState): boolean =>
    state.detailsLoadingById[id] ?? false;

export const selectPostDetailsError =
  (id: number) =>
  (state: PostsState): string | null =>
    state.detailsErrorById[id] ?? null;
