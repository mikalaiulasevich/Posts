import { postsApiClient, type PostsApiClient } from '../data/api/postsApi';
import {
  mmkvStorage,
  type JsonStorageAdapter,
  StorageParseError,
} from '../data/storage/mmkvStorage';
import { STORAGE_KEYS } from '../data/storage/storageKeys';
import { createPostList } from '../entities/post/factories';
import { isPostListItemArray } from '../entities/post/guards';
import type { PostListItem } from '../entities/post/types';

export type PostsRepositoryDependencies = {
  apiClient?: Pick<PostsApiClient, 'fetchPosts'>;
  storage?: JsonStorageAdapter;
};

export class PostsRepository {
  private readonly apiClient: Pick<PostsApiClient, 'fetchPosts'>;
  private readonly storage: JsonStorageAdapter;
  private pendingPostsRequest: Promise<PostListItem[]> | null = null;

  constructor(dependencies: PostsRepositoryDependencies = {}) {
    this.apiClient = dependencies.apiClient ?? postsApiClient;
    this.storage = dependencies.storage ?? mmkvStorage;
  }

  async getPosts(): Promise<PostListItem[]> {
    const cachedPosts = this.readCachedPosts();

    if (cachedPosts != null) {
      return cachedPosts;
    }

    if (this.pendingPostsRequest != null) {
      return this.pendingPostsRequest;
    }

    const request = this.fetchAndCachePosts();
    this.pendingPostsRequest = request;

    try {
      return await request;
    } finally {
      if (this.pendingPostsRequest === request) {
        this.pendingPostsRequest = null;
      }
    }
  }

  private fetchAndCachePosts(): Promise<PostListItem[]> {
    return this.apiClient.fetchPosts().then(apiPosts => {
      const enrichedPosts = createPostList(apiPosts);

      this.storage.setJson(STORAGE_KEYS.posts, enrichedPosts);

      return enrichedPosts;
    });
  }

  private readCachedPosts(): PostListItem[] | null {
    let cachedPosts: unknown | null;

    try {
      cachedPosts = this.storage.getJson(STORAGE_KEYS.posts);
    } catch (error) {
      if (error instanceof StorageParseError) {
        this.storage.remove(STORAGE_KEYS.posts);
        return null;
      }

      throw error;
    }

    if (cachedPosts == null) {
      return null;
    }

    if (!isPostListItemArray(cachedPosts)) {
      this.storage.remove(STORAGE_KEYS.posts);
      return null;
    }

    return cachedPosts;
  }

  clearCache(): void {
    this.storage.remove(STORAGE_KEYS.posts);
  }
}

export const postsRepository = new PostsRepository();
