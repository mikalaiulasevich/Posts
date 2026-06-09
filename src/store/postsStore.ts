import { create } from 'zustand';

import {
  cacheRepository,
  type CacheRepository,
} from '../repositories/CacheRepository';
import {
  detailsRepository,
  type DetailsRepository,
} from '../repositories/DetailsRepository';
import {
  favoritesRepository,
  type FavoritesRepository,
} from '../repositories/FavoritesRepository';
import {
  postsRepository,
  type PostsRepository,
} from '../repositories/PostsRepository';
import { createLogger } from '../shared/lib/logger';
import type { PostDetails, PostListItem } from '../entities/post/types';

const logger = createLogger('PostsStore');

export type PostsStoreDependencies = {
  postsRepository?: PostsRepository;
  detailsRepository?: DetailsRepository;
  favoritesRepository?: FavoritesRepository;
  cacheRepository?: CacheRepository;
};

export type PostsState = {
  posts: PostListItem[];
  detailsById: Record<number, PostDetails>;
  favoriteIds: number[];
  cacheVersion: number;
  isPostsLoading: boolean;
  detailsLoadingById: Record<number, boolean>;
  postsError: string | null;
  detailsErrorById: Record<number, string | null>;
  loadPosts: () => Promise<void>;
  loadPostDetails: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => void;
  clearCache: () => void;
};

export function createPostsStore(dependencies: PostsStoreDependencies = {}) {
  const postsRepo = dependencies.postsRepository ?? postsRepository;
  const detailsRepo = dependencies.detailsRepository ?? detailsRepository;
  const favoritesRepo = dependencies.favoritesRepository ?? favoritesRepository;
  const cacheRepo = dependencies.cacheRepository ?? cacheRepository;
  const initialFavoriteIds = favoritesRepo.getFavoriteIds();

  logger.info('store:init', { favoriteCount: initialFavoriteIds.length });

  return create<PostsState>((set, get) => ({
    posts: [],
    detailsById: {},
    favoriteIds: initialFavoriteIds,
    cacheVersion: 0,
    isPostsLoading: false,
    detailsLoadingById: {},
    postsError: null,
    detailsErrorById: {},

    async loadPosts(): Promise<void> {
      logger.info('loadPosts:start');
      set({ isPostsLoading: true, postsError: null });

      try {
        const posts = await postsRepo.getPosts();
        set({ posts, isPostsLoading: false, postsError: null });
        logger.info('loadPosts:success', { count: posts.length });
      } catch (error) {
        logger.error('loadPosts:error', { message: getErrorMessage(error) });
        set({
          isPostsLoading: false,
          postsError: getErrorMessage(error),
        });
      }
    },

    async loadPostDetails(id: number): Promise<void> {
      const cachedDetails = get().detailsById[id];

      if (cachedDetails != null) {
        logger.info('loadPostDetails:memory-cache-hit', { id });
        return;
      }

      logger.info('loadPostDetails:start', { id });

      set(state => ({
        detailsLoadingById: {
          ...state.detailsLoadingById,
          [id]: true,
        },
        detailsErrorById: {
          ...state.detailsErrorById,
          [id]: null,
        },
      }));

      try {
        const details = await detailsRepo.getPostDetails(id);

        set(state => ({
          detailsById: {
            ...state.detailsById,
            [id]: details,
          },
          detailsLoadingById: {
            ...state.detailsLoadingById,
            [id]: false,
          },
          detailsErrorById: {
            ...state.detailsErrorById,
            [id]: null,
          },
        }));
        logger.info('loadPostDetails:success', { id });
      } catch (error) {
        logger.error('loadPostDetails:error', {
          id,
          message: getErrorMessage(error),
        });
        set(state => ({
          detailsLoadingById: {
            ...state.detailsLoadingById,
            [id]: false,
          },
          detailsErrorById: {
            ...state.detailsErrorById,
            [id]: getErrorMessage(error),
          },
        }));
      }
    },

    toggleFavorite(id: number): void {
      assertPostId(id);

      set(state => {
        const isFavorite = state.favoriteIds.includes(id);
        const favoriteIds = isFavorite
          ? state.favoriteIds.filter(favoriteId => favoriteId !== id)
          : [...state.favoriteIds, id];

        favoritesRepo.setFavoriteIds(favoriteIds);
        logger.info('toggleFavorite:success', {
          favoriteCount: favoriteIds.length,
          id,
          nextIsFavorite: !isFavorite,
        });

        return { favoriteIds };
      });
    },

    clearCache(): void {
      logger.warn('clearCache:start');
      cacheRepo.clearAll();

      set(state => ({
        posts: [],
        detailsById: {},
        favoriteIds: [],
        cacheVersion: state.cacheVersion + 1,
        isPostsLoading: false,
        detailsLoadingById: {},
        postsError: null,
        detailsErrorById: {},
      }));

      logger.warn('clearCache:success');
    },
  }));
}

function assertPostId(id: number): void {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Post id must be a positive integer. Received: ${id}`);
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
}

export const usePostsStore = createPostsStore();
