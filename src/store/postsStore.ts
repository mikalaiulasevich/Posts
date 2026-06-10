import { create } from 'zustand';

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
import type { PostDetails, PostListItem } from '../entities/post/types';
import { createLogger } from '../shared/lib/logger';

const logger = createLogger('PostsStore');

export type PostsStoreDependencies = {
  postsRepository?: PostsRepository;
  detailsRepository?: DetailsRepository;
  favoritesRepository?: FavoritesRepository;
};

export type PostsState = {
  posts: PostListItem[];
  detailsById: Record<number, PostDetails>;
  favoriteIds: number[];
  favoriteIdsById: FavoriteIdsById;
  isPostsLoading: boolean;
  detailsLoadingById: Record<number, boolean>;
  postsError: string | null;
  detailsErrorById: Record<number, string | null>;
  loadPosts: () => Promise<void>;
  loadPostDetails: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => void;
};

export type FavoriteIdsById = Partial<Record<number, true>>;

export function createPostsStore(dependencies: PostsStoreDependencies = {}) {
  const postsRepo = dependencies.postsRepository ?? postsRepository;
  const detailsRepo = dependencies.detailsRepository ?? detailsRepository;
  const favoritesRepo = dependencies.favoritesRepository ?? favoritesRepository;
  const initialFavoriteIds = favoritesRepo.getFavoriteIds();

  logger.info('store:init', { favoriteCount: initialFavoriteIds.length });

  return create<PostsState>((set, get) => ({
    posts: [],
    detailsById: {},
    favoriteIds: initialFavoriteIds,
    favoriteIdsById: createFavoriteIdsById(initialFavoriteIds),
    isPostsLoading: false,
    detailsLoadingById: {},
    postsError: null,
    detailsErrorById: {},

    async loadPosts(): Promise<void> {
      const cachedPosts = get().posts;

      if (cachedPosts.length > 0) {
        logger.info('loadPosts:memory-cache-hit', {
          count: cachedPosts.length,
        });
        return;
      }

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

      const currentFavoriteIds = get().favoriteIds;
      const currentFavoriteIdsById = get().favoriteIdsById;
      const isFavorite = currentFavoriteIdsById[id] === true;
      const favoriteIds = isFavorite
        ? currentFavoriteIds.filter(favoriteId => favoriteId !== id)
        : [...currentFavoriteIds, id];
      const favoriteIdsById = isFavorite
        ? removeFavoriteId(currentFavoriteIdsById, id)
        : { ...currentFavoriteIdsById, [id]: true as const };

      favoritesRepo.setFavoriteIds(favoriteIds);
      set({ favoriteIds, favoriteIdsById });

      logger.info('toggleFavorite:success', {
        favoriteCount: favoriteIds.length,
        id,
        nextIsFavorite: !isFavorite,
      });
    },
  }));
}

function createFavoriteIdsById(favoriteIds: number[]): FavoriteIdsById {
  return favoriteIds.reduce<FavoriteIdsById>((lookup, id) => {
    lookup[id] = true;
    return lookup;
  }, {});
}

function removeFavoriteId(
  favoriteIdsById: FavoriteIdsById,
  id: number,
): FavoriteIdsById {
  const nextFavoriteIdsById = { ...favoriteIdsById };

  delete nextFavoriteIdsById[id];

  return nextFavoriteIdsById;
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
