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
      const favoriteIds = this.storage.getJson(STORAGE_KEYS.favorites);

      if (favoriteIds == null) {
        return [];
      }

      if (!Array.isArray(favoriteIds)) {
        this.storage.remove(STORAGE_KEYS.favorites);
        return [];
      }

      const normalizedFavoriteIds = normalizeFavoriteIds(favoriteIds);

      if (normalizedFavoriteIds.length !== favoriteIds.length) {
        this.storage.setJson(STORAGE_KEYS.favorites, normalizedFavoriteIds);
      }

      return normalizedFavoriteIds;
    } catch (error) {
      if (error instanceof StorageParseError) {
        this.storage.remove(STORAGE_KEYS.favorites);
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

function normalizeFavoriteIds(value: unknown[]): number[] {
  return Array.from(
    new Set(
      value.filter(
        (id): id is number =>
          typeof id === 'number' && Number.isInteger(id) && id > 0,
      ),
    ),
  );
}

export const favoritesRepository = new FavoritesRepository();
