import type { ApiPost } from '../../entities/post/types';
import { isApiPost, isApiPostArray } from '../../entities/post/guards';

import { requestJson } from './httpClient';

const POSTS_API_BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

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

export async function fetchPosts(): Promise<ApiPost[]> {
  const response = await requestJson(POSTS_API_BASE_URL);

  if (!isApiPostArray(response)) {
    throw new ApiResponseValidationError(POSTS_API_BASE_URL);
  }

  return response;
}

export async function fetchPostDetails(id: number): Promise<ApiPost> {
  const endpoint = `${POSTS_API_BASE_URL}/${id}`;
  const response = await requestJson(endpoint);

  if (!isApiPost(response)) {
    throw new ApiResponseValidationError(endpoint);
  }

  return response;
}

export const postsApiClient: PostsApiClient = {
  fetchPosts,
  fetchPostDetails,
};
