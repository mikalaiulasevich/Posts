import {
  mmkvStorage,
  type JsonStorageAdapter,
  StorageParseError,
} from '../data/storage/mmkvStorage';
import { STORAGE_KEYS } from '../data/storage/storageKeys';

export type FavoritesRepositoryDependencies = {
  storage?: JsonStorageAdapter;
};

export class FavoritesRepository {
  private readonly storage: JsonStorageAdapter;

  constructor(dependencies: FavoritesRepositoryDependencies = {}) {
    this.storage = dependencies.storage ?? mmkvStorage;
  }

  getFavoriteIds(): number[] {
    try {
      const favoriteIds = this.storage.getJson<unknown>(STORAGE_KEYS.favorites);
      return normalizeFavoriteIds(favoriteIds);
    } catch (error) {
      if (error instanceof StorageParseError) {
        return [];
      }

      throw error;
    }
  }

  setFavoriteIds(favoriteIds: number[]): void {
    this.storage.setJson(
      STORAGE_KEYS.favorites,
      normalizeFavoriteIds(favoriteIds),
    );
  }

  clear(): void {
    this.storage.remove(STORAGE_KEYS.favorites);
  }
}

function normalizeFavoriteIds(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(value.filter((id): id is number => Number.isInteger(id) && id > 0)),
  );
}

export const favoritesRepository = new FavoritesRepository();
