import { createMMKV } from 'react-native-mmkv';

import { createLogger } from '../../shared/lib/logger';

const logger = createLogger('MMKVStorage');

export type JsonStorageAdapter = {
  getJson: (key: string) => unknown | null;
  setJson: (key: string, value: unknown) => void;
  remove: (key: string) => void;
  contains: (key: string) => boolean;
  clearAll: () => void;
};

export class StorageParseError extends Error {
  constructor(public readonly key: string) {
    super(`Invalid JSON in MMKV storage for key: ${key}`);
    this.name = 'StorageParseError';
  }
}

type NativeStorage = ReturnType<typeof createMMKV>;

let nativeStorage: NativeStorage | null = null;

function getNativeStorage(): NativeStorage {
  if (nativeStorage == null) {
    nativeStorage = createMMKV({ id: 'posts-app-storage' });
    logger.info('native-storage:created', { id: 'posts-app-storage' });
  }

  return nativeStorage;
}

export const mmkvStorage: JsonStorageAdapter = {
  getJson(key: string): unknown | null {
    const rawValue = getNativeStorage().getString(key);

    if (rawValue == null) {
      logger.info('json:get:miss', { key });
      return null;
    }

    try {
      const parsedValue = JSON.parse(rawValue);

      logger.info('json:get:hit', { key, size: rawValue.length });

      return parsedValue;
    } catch {
      logger.warn('json:get:parse-error', { key });
      throw new StorageParseError(key);
    }
  },

  setJson(key: string, value: unknown): void {
    const rawValue = JSON.stringify(value);

    getNativeStorage().set(key, rawValue);
    logger.info('json:set', { key, size: rawValue.length });
  },

  remove(key: string): void {
    getNativeStorage().remove(key);
    logger.info('key:remove', { key });
  },

  contains(key: string): boolean {
    const hasKey = getNativeStorage().contains(key);

    logger.info('key:contains', { hasKey, key });

    return hasKey;
  },

  clearAll(): void {
    const keyCount = getNativeStorage().getAllKeys().length;

    getNativeStorage().clearAll();
    logger.warn('storage:clear-all', { keyCount });
  },
};
