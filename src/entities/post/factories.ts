import {
  createDetailsImageUrl,
  createListImageUrl,
} from '../../shared/lib/fakerImages';
import { createLogger } from '../../shared/lib/logger';

import type { ApiPost, PostDetails, PostListItem } from './types';

const logger = createLogger('PostFactories');

export function createPostListItem(apiPost: ApiPost): PostListItem {
  logger.info('list-item:enrich', { id: apiPost.id });

  return {
    id: apiPost.id,
    userId: apiPost.userId,
    title: apiPost.title,
    body: apiPost.body,
    thumbnailUrl: createListImageUrl(),
  };
}

export function createPostDetails(apiPost: ApiPost): PostDetails {
  logger.info('details:enrich', { id: apiPost.id });

  return {
    id: apiPost.id,
    userId: apiPost.userId,
    title: apiPost.title,
    body: apiPost.body,
    imageUrl: createDetailsImageUrl(),
  };
}

export function createPostList(apiPosts: ApiPost[]): PostListItem[] {
  logger.info('list:enrich:start', { count: apiPosts.length });

  return apiPosts.map(createPostListItem);
}
