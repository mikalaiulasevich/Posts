import type { PostDetails, PostListItem } from '../entities/post/types';

import type { FavoriteIdsById, PostsState } from './postsStore';

export const selectPosts = (state: PostsState): PostListItem[] => state.posts;

export const selectFavoriteIds = (state: PostsState): number[] =>
  state.favoriteIds;

export const selectFavoriteIdsById = (state: PostsState): FavoriteIdsById =>
  state.favoriteIdsById;

export const selectIsPostsLoading = (state: PostsState): boolean =>
  state.isPostsLoading;

export const selectPostsError = (state: PostsState): string | null =>
  state.postsError;

export function sortPostsWithFavorites(
  posts: PostListItem[],
  favoriteIdsById: FavoriteIdsById,
): PostListItem[] {
  const favoritePosts: PostListItem[] = [];
  const regularPosts: PostListItem[] = [];

  for (const post of posts) {
    if (isFavoritePost(favoriteIdsById, post.id)) {
      favoritePosts.push(post);
    } else {
      regularPosts.push(post);
    }
  }

  return favoritePosts.concat(regularPosts);
}

export const selectIsFavorite =
  (id: number) =>
  (state: PostsState): boolean =>
    isFavoritePost(state.favoriteIdsById, id);

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

export function isFavoritePost(
  favoriteIdsById: FavoriteIdsById,
  id: number,
): boolean {
  return favoriteIdsById[id] === true;
}
