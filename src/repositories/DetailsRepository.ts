import { postsApiClient, type PostsApiClient } from '../data/api/postsApi';
import {
  mmkvStorage,
  type JsonStorageAdapter,
} from '../data/storage/mmkvStorage';
import { postDetailsKey } from '../data/storage/storageKeys';
import { createPostDetails } from '../entities/post/factories';
import type { PostDetails } from '../entities/post/types';

export type DetailsRepositoryDependencies = {
  apiClient?: Pick<PostsApiClient, 'fetchPostDetails'>;
  storage?: JsonStorageAdapter;
};

export class DetailsRepository {
  private readonly apiClient: Pick<PostsApiClient, 'fetchPostDetails'>;
  private readonly storage: JsonStorageAdapter;

  constructor(dependencies: DetailsRepositoryDependencies = {}) {
    this.apiClient = dependencies.apiClient ?? postsApiClient;
    this.storage = dependencies.storage ?? mmkvStorage;
  }

  async getPostDetails(id: number): Promise<PostDetails> {
    assertPostId(id);

    const storageKey = postDetailsKey(id);
    const cachedDetails = this.storage.getJson<PostDetails>(storageKey);

    if (cachedDetails != null) {
      return cachedDetails;
    }

    const apiPost = await this.apiClient.fetchPostDetails(id);
    const enrichedDetails = createPostDetails(apiPost);

    this.storage.setJson(storageKey, enrichedDetails);

    return enrichedDetails;
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
