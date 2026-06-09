export const STORAGE_KEYS = {
  posts: 'posts:list:v2',
  detailsPrefix: 'posts:details:v2',
  favorites: 'posts:favorites:v1',
} as const;

export function postDetailsKey(id: number): string {
  return `${STORAGE_KEYS.detailsPrefix}:${id}`;
}
