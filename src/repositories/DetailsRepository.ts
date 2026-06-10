import { postsApiClient, type PostsApiClient } from '../data/api/postsApi';
import {
  mmkvStorage,
  type JsonStorageAdapter,
  StorageParseError,
} from '../data/storage/mmkvStorage';
import { postDetailsKey } from '../data/storage/storageKeys';
import { createPostDetails } from '../entities/post/factories';
import { isPostDetails } from '../entities/post/guards';
import type { PostDetails } from '../entities/post/types';
import { createLogger } from '../shared/lib/logger';

const logger = createLogger('DetailsRepository');

export type DetailsRepositoryDependencies = {
  apiClient?: Pick<PostsApiClient, 'fetchPostDetails'>;
  storage?: JsonStorageAdapter;
};

export class DetailsRepository {
  private readonly apiClient: Pick<PostsApiClient, 'fetchPostDetails'>;
  private readonly storage: JsonStorageAdapter;
  private readonly pendingDetailsRequests = new Map<
    number,
    Promise<PostDetails>
  >();

  constructor(dependencies: DetailsRepositoryDependencies = {}) {
    this.apiClient = dependencies.apiClient ?? postsApiClient;
    this.storage = dependencies.storage ?? mmkvStorage;
  }

  async getPostDetails(id: number): Promise<PostDetails> {
    assertPostId(id);
    logger.info('getPostDetails:start', { id });

    const storageKey = postDetailsKey(id);
    const cachedDetails = this.readCachedDetails(storageKey);

    if (cachedDetails != null) {
      logger.info('getPostDetails:cache-hit', { id });
      return cachedDetails;
    }

    const pendingRequest = this.pendingDetailsRequests.get(id);

    if (pendingRequest != null) {
      logger.info('getPostDetails:reuse-in-flight-request', { id });
      return pendingRequest;
    }

    logger.info('getPostDetails:cache-miss-fetch-start', { id });

    const request = this.fetchAndCachePostDetails(id, storageKey);
    this.pendingDetailsRequests.set(id, request);

    try {
      return await request;
    } finally {
      if (this.pendingDetailsRequests.get(id) === request) {
        this.pendingDetailsRequests.delete(id);
        logger.info('getPostDetails:in-flight-cleared', { id });
      }
    }
  }

  private fetchAndCachePostDetails(
    id: number,
    storageKey: string,
  ): Promise<PostDetails> {
    return this.apiClient.fetchPostDetails(id).then(apiPost => {
      const enrichedDetails = createPostDetails(apiPost);

      this.storage.setJson(storageKey, enrichedDetails);
      logger.info('getPostDetails:fetched-enriched-cached', { id });

      return enrichedDetails;
    });
  }

  private readCachedDetails(storageKey: string): PostDetails | null {
    let cachedDetails: unknown | null;

    try {
      cachedDetails = this.storage.getJson(storageKey);
    } catch (error) {
      if (error instanceof StorageParseError) {
        this.storage.remove(storageKey);
        logger.warn('cache:parse-error-recovered', { key: storageKey });
        return null;
      }

      throw error;
    }

    if (cachedDetails == null) {
      logger.info('cache:empty', { key: storageKey });
      return null;
    }

    if (!isPostDetails(cachedDetails)) {
      this.storage.remove(storageKey);
      logger.warn('cache:invalid-shape-recovered', { key: storageKey });
      return null;
    }

    return cachedDetails;
  }
}

function assertPostId(id: number): void {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Post id must be a positive integer. Received: ${id}`);
  }
}

export const detailsRepository = new DetailsRepository();
