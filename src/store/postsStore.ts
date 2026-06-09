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

export type PostsStoreDependencies = {
  postsRepository?: PostsRepository;
  detailsRepository?: DetailsRepository;
  favoritesRepository?: FavoritesRepository;
};

export type PostsState = {
  posts: PostListItem[];
  detailsById: Record<number, PostDetails>;
  favoriteIds: number[];
  isPostsLoading: boolean;
  detailsLoadingById: Record<number, boolean>;
  postsError: string | null;
  detailsErrorById: Record<number, string | null>;
  loadPosts: () => Promise<void>;
  loadPostDetails: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => void;
};

export function createPostsStore(dependencies: PostsStoreDependencies = {}) {
  const postsRepo = dependencies.postsRepository ?? postsRepository;
  const detailsRepo = dependencies.detailsRepository ?? detailsRepository;
  const favoritesRepo = dependencies.favoritesRepository ?? favoritesRepository;

  return create<PostsState>((set, get) => ({
    posts: [],
    detailsById: {},
    favoriteIds: favoritesRepo.getFavoriteIds(),
    isPostsLoading: false,
    detailsLoadingById: {},
    postsError: null,
    detailsErrorById: {},

    async loadPosts(): Promise<void> {
      set({ isPostsLoading: true, postsError: null });

      try {
        const posts = await postsRepo.getPosts();
        set({ posts, isPostsLoading: false, postsError: null });
      } catch (error) {
        set({
          isPostsLoading: false,
          postsError: getErrorMessage(error),
        });
      }
    },

    async loadPostDetails(id: number): Promise<void> {
      const cachedDetails = get().detailsById[id];

      if (cachedDetails != null) {
        return;
      }

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
      } catch (error) {
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

        return { favoriteIds };
      });
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
