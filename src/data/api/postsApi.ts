import type { ApiPost } from '../../entities/post/types';
import { isApiPost, isApiPostArray } from '../../entities/post/guards';
import { createLogger } from '../../shared/lib/logger';

import { requestJson } from './httpClient';

const POSTS_API_BASE_URL = 'https://jsonplaceholder.typicode.com/posts';
const logger = createLogger('PostsApi');

export type PostsApiClient = {
  fetchPosts: () => Promise<ApiPost[]>;
  fetchPostDetails: (id: number) => Promise<ApiPost>;
};

export class ApiResponseValidationError extends Error {
  constructor(endpoint: string) {
    super(`Invalid posts API response for endpoint: ${endpoint}`);
    this.name = 'ApiResponseValidationError';
  }
}

async function fetchPosts(): Promise<ApiPost[]> {
  logger.info('posts:fetch:start');

  const response = await requestJson(POSTS_API_BASE_URL);

  if (!isApiPostArray(response)) {
    logger.error('posts:fetch:invalid-response');
    throw new ApiResponseValidationError(POSTS_API_BASE_URL);
  }

  logger.info('posts:fetch:validated', { count: response.length });

  return response;
}

async function fetchPostDetails(id: number): Promise<ApiPost> {
  const endpoint = `${POSTS_API_BASE_URL}/${id}`;

  logger.info('details:fetch:start', { id });

  const response = await requestJson(endpoint);

  if (!isApiPost(response)) {
    logger.error('details:fetch:invalid-response', { id });
    throw new ApiResponseValidationError(endpoint);
  }

  logger.info('details:fetch:validated', { id });

  return response;
}

export const postsApiClient: PostsApiClient = {
  fetchPosts,
  fetchPostDetails,
};
