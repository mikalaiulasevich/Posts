import FastImage from 'react-native-fast-image';

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

  async clearAll(): Promise<void> {
    this.storage.clearAll();
    await FastImage.clearMemoryCache();
    await FastImage.clearDiskCache();
    logger.warn('clearAll:success');
  }
}

export const cacheRepository = new CacheRepository();
