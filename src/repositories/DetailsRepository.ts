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

    const storageKey = postDetailsKey(id);
    const cachedDetails = this.readCachedDetails(storageKey);

    if (cachedDetails != null) {
      return cachedDetails;
    }

    const pendingRequest = this.pendingDetailsRequests.get(id);

    if (pendingRequest != null) {
      return pendingRequest;
    }

    const request = this.fetchAndCachePostDetails(id, storageKey);
    this.pendingDetailsRequests.set(id, request);

    try {
      return await request;
    } finally {
      if (this.pendingDetailsRequests.get(id) === request) {
        this.pendingDetailsRequests.delete(id);
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
        return null;
      }

      throw error;
    }

    if (cachedDetails == null) {
      return null;
    }

    if (!isPostDetails(cachedDetails)) {
      this.storage.remove(storageKey);
      return null;
    }

    return cachedDetails;
  }

  clearCache(id: number): void {
    assertPostId(id);
    this.storage.remove(postDetailsKey(id));
  }
}

function assertPostId(id: number): void {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Post id must be a positive integer. Received: ${id}`);
  }
}

export const detailsRepository = new DetailsRepository();
