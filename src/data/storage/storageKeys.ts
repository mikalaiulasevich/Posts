export const STORAGE_KEYS = {
  posts: 'posts:list:v1',
  detailsPrefix: 'posts:details:v1',
  favorites: 'posts:favorites:v1',
} as const;

export function postDetailsKey(id: number): string {
  return `${STORAGE_KEYS.detailsPrefix}:${id}`;
}
