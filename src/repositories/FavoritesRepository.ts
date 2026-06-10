import {
  mmkvStorage,
  type JsonStorageAdapter,
  StorageParseError,
} from '../data/storage/mmkvStorage';
import { STORAGE_KEYS } from '../data/storage/storageKeys';
import { createLogger } from '../shared/lib/logger';

const logger = createLogger('FavoritesRepository');

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
        logger.info('favorites:get:empty');
        return [];
      }

      if (!Array.isArray(favoriteIds)) {
        this.storage.remove(STORAGE_KEYS.favorites);
        logger.warn('favorites:get:invalid-shape-recovered');
        return [];
      }

      const normalizedFavoriteIds = normalizeFavoriteIds(favoriteIds);

      if (normalizedFavoriteIds.length !== favoriteIds.length) {
        this.storage.setJson(STORAGE_KEYS.favorites, normalizedFavoriteIds);
        logger.info('favorites:get:normalized', {
          count: normalizedFavoriteIds.length,
        });
      }

      logger.info('favorites:get:restored', {
        count: normalizedFavoriteIds.length,
      });

      return normalizedFavoriteIds;
    } catch (error) {
      if (error instanceof StorageParseError) {
        this.storage.remove(STORAGE_KEYS.favorites);
        logger.warn('favorites:get:parse-error-recovered');
        return [];
      }

      throw error;
    }
  }

  setFavoriteIds(favoriteIds: number[]): void {
    const normalizedFavoriteIds = normalizeFavoriteIds(favoriteIds);

    this.storage.setJson(STORAGE_KEYS.favorites, normalizedFavoriteIds);
    logger.info('favorites:set', { count: normalizedFavoriteIds.length });
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
