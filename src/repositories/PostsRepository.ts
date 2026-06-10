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
import { createLogger } from '../shared/lib/logger';

const logger = createLogger('PostsRepository');

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
    logger.info('getPosts:start');

    const cachedPosts = this.readCachedPosts();

    if (cachedPosts != null) {
      logger.info('getPosts:cache-hit', { count: cachedPosts.length });
      return cachedPosts;
    }

    if (this.pendingPostsRequest != null) {
      logger.info('getPosts:reuse-in-flight-request');
      return this.pendingPostsRequest;
    }

    logger.info('getPosts:cache-miss-fetch-start');

    const request = this.fetchAndCachePosts();
    this.pendingPostsRequest = request;

    try {
      return await request;
    } finally {
      if (this.pendingPostsRequest === request) {
        this.pendingPostsRequest = null;
        logger.info('getPosts:in-flight-cleared');
      }
    }
  }

  private fetchAndCachePosts(): Promise<PostListItem[]> {
    return this.apiClient.fetchPosts().then(apiPosts => {
      const enrichedPosts = createPostList(apiPosts);

      this.storage.setJson(STORAGE_KEYS.posts, enrichedPosts);
      logger.info('getPosts:fetched-enriched-cached', {
        count: enrichedPosts.length,
      });

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
        logger.warn('cache:parse-error-recovered');
        return null;
      }

      throw error;
    }

    if (cachedPosts == null) {
      logger.info('cache:empty');
      return null;
    }

    if (!isPostListItemArray(cachedPosts)) {
      this.storage.remove(STORAGE_KEYS.posts);
      logger.warn('cache:invalid-shape-recovered');
      return null;
    }

    return cachedPosts;
  }
}

export const postsRepository = new PostsRepository();
