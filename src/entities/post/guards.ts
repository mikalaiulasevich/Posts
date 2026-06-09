import type { ApiPost, PostDetails, PostListItem } from './types';

export function isApiPost(value: unknown): value is ApiPost {
  if (!isRecord(value)) {
    return false;
  }

  return (
    Number.isInteger(value.userId) &&
    Number.isInteger(value.id) &&
    typeof value.title === 'string' &&
    typeof value.body === 'string'
  );
}

export function isApiPostArray(value: unknown): value is ApiPost[] {
  return Array.isArray(value) && value.every(isApiPost);
}

export function isPostListItemArray(value: unknown): value is PostListItem[] {
  return Array.isArray(value) && value.every(isPostListItem);
}

export function isPostDetails(value: unknown): value is PostDetails {
  if (!isRecord(value)) {
    return false;
  }

  return (
    Number.isInteger(value.userId) &&
    Number.isInteger(value.id) &&
    typeof value.title === 'string' &&
    typeof value.body === 'string' &&
    typeof value.imageUrl === 'string'
  );
}

function isPostListItem(value: unknown): value is PostListItem {
  if (!isRecord(value)) {
    return false;
  }

  return (
    Number.isInteger(value.userId) &&
    Number.isInteger(value.id) &&
    typeof value.title === 'string' &&
    typeof value.body === 'string' &&
    typeof value.thumbnailUrl === 'string'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
