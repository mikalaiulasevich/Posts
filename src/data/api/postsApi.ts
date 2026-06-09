import type { ApiPost } from '../../entities/post/types';

import { requestJson } from './httpClient';

const POSTS_API_BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

export type PostsApiClient = {
  fetchPosts: () => Promise<ApiPost[]>;
  fetchPostDetails: (id: number) => Promise<ApiPost>;
};

export async function fetchPosts(): Promise<ApiPost[]> {
  return requestJson<ApiPost[]>(POSTS_API_BASE_URL);
}

export async function fetchPostDetails(id: number): Promise<ApiPost> {
  return requestJson<ApiPost>(`${POSTS_API_BASE_URL}/${id}`);
}

export const postsApiClient: PostsApiClient = {
  fetchPosts,
  fetchPostDetails,
};
