import { createMMKV } from 'react-native-mmkv';

export type JsonStorageAdapter = {
  getJson: <TValue>(key: string) => TValue | null;
  setJson: <TValue>(key: string, value: TValue) => void;
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
  getJson<TValue>(key: string): TValue | null {
    const rawValue = getNativeStorage().getString(key);

    if (rawValue == null) {
      return null;
    }

    try {
      return JSON.parse(rawValue) as TValue;
    } catch {
      throw new StorageParseError(key);
    }
  },

  setJson<TValue>(key: string, value: TValue): void {
    getNativeStorage().set(key, JSON.stringify(value));
  },

  remove(key: string): void {
    getNativeStorage().remove(key);
  },

  contains(key: string): boolean {
    return getNativeStorage().contains(key);
  },
};
