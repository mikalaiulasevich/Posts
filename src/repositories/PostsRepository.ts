import { postsApiClient, type PostsApiClient } from '../data/api/postsApi';
import {
  mmkvStorage,
  type JsonStorageAdapter,
} from '../data/storage/mmkvStorage';
import { STORAGE_KEYS } from '../data/storage/storageKeys';
import { createPostList } from '../entities/post/factories';
import type { PostListItem } from '../entities/post/types';

export type PostsRepositoryDependencies = {
  apiClient?: Pick<PostsApiClient, 'fetchPosts'>;
  storage?: JsonStorageAdapter;
};

export class PostsRepository {
  private readonly apiClient: Pick<PostsApiClient, 'fetchPosts'>;
  private readonly storage: JsonStorageAdapter;

  constructor(dependencies: PostsRepositoryDependencies = {}) {
    this.apiClient = dependencies.apiClient ?? postsApiClient;
    this.storage = dependencies.storage ?? mmkvStorage;
  }

  async getPosts(): Promise<PostListItem[]> {
    const cachedPosts = this.storage.getJson<PostListItem[]>(
      STORAGE_KEYS.posts,
    );

    if (cachedPosts != null) {
      return cachedPosts;
    }

    const apiPosts = await this.apiClient.fetchPosts();
    const enrichedPosts = createPostList(apiPosts);

    this.storage.setJson(STORAGE_KEYS.posts, enrichedPosts);

    return enrichedPosts;
  }

  clearCache(): void {
    this.storage.remove(STORAGE_KEYS.posts);
  }
}

export const postsRepository = new PostsRepository();
