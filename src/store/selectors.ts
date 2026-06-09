import type { PostDetails, PostListItem } from '../entities/post/types';

import type { PostsState } from './postsStore';

export const selectPosts = (state: PostsState): PostListItem[] => state.posts;

export const selectFavoriteIds = (state: PostsState): number[] =>
  state.favoriteIds;

export const selectIsPostsLoading = (state: PostsState): boolean =>
  state.isPostsLoading;

export const selectPostsError = (state: PostsState): string | null =>
  state.postsError;

export const selectSortedPosts = (state: PostsState): PostListItem[] => {
  const favoriteIds = new Set(state.favoriteIds);

  return [...state.posts].sort((firstPost, secondPost) => {
    const isFirstFavorite = favoriteIds.has(firstPost.id);
    const isSecondFavorite = favoriteIds.has(secondPost.id);

    if (isFirstFavorite === isSecondFavorite) {
      return 0;
    }

    return isFirstFavorite ? -1 : 1;
  });
};

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
