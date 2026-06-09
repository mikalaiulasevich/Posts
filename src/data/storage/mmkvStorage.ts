import { createMMKV } from 'react-native-mmkv';

export type JsonStorageAdapter = {
  getJson: (key: string) => unknown | null;
  setJson: (key: string, value: unknown) => void;
  remove: (key: string) => void;
  contains: (key: string) => boolean;
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
  nativeStorage ??= createMMKV({ id: 'posts-app-storage' });
  return nativeStorage;
}

export const mmkvStorage: JsonStorageAdapter = {
  getJson(key: string): unknown | null {
    const rawValue = getNativeStorage().getString(key);

    if (rawValue == null) {
      return null;
    }

    try {
      return JSON.parse(rawValue);
    } catch {
      throw new StorageParseError(key);
    }
  },

  setJson(key: string, value: unknown): void {
    getNativeStorage().set(key, JSON.stringify(value));
  },

  remove(key: string): void {
    getNativeStorage().remove(key);
  },

  contains(key: string): boolean {
    return getNativeStorage().contains(key);
  },
};
