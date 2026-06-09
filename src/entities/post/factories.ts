import {
  createDetailsImageUrl,
  createListImageUrl,
} from '../../shared/lib/fakerImages';

import type { ApiPost, PostDetails, PostListItem } from './types';

export function createPostListItem(apiPost: ApiPost): PostListItem {
  return {
    id: apiPost.id,
    userId: apiPost.userId,
    title: apiPost.title,
    body: apiPost.body,
    thumbnailUrl: createListImageUrl(),
  };
}

export function createPostDetails(apiPost: ApiPost): PostDetails {
  return {
    id: apiPost.id,
    userId: apiPost.userId,
    title: apiPost.title,
    body: apiPost.body,
    imageUrl: createDetailsImageUrl(),
  };
}

export function createPostList(apiPosts: ApiPost[]): PostListItem[] {
  return apiPosts.map(createPostListItem);
}
