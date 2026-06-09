import {
  mmkvStorage,
  type JsonStorageAdapter,
} from '../data/storage/mmkvStorage';
import { createLogger } from '../shared/lib/logger';

const logger = createLogger('CacheRepository');

export type CacheRepositoryDependencies = {
  storage?: Pick<JsonStorageAdapter, 'clearAll'>;
};

export class CacheRepository {
  private readonly storage: Pick<JsonStorageAdapter, 'clearAll'>;

  constructor(dependencies: CacheRepositoryDependencies = {}) {
    this.storage = dependencies.storage ?? mmkvStorage;
  }

  clearAll(): void {
    this.storage.clearAll();
    logger.warn('clearAll:success');
  }
}

export const cacheRepository = new CacheRepository();
