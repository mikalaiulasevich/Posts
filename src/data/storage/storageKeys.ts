export const STORAGE_KEYS = {
  posts: 'posts:list:v3',
  detailsPrefix: 'posts:details:v3',
  favorites: 'posts:favorites:v1',
} as const;

export function postDetailsKey(id: number): string {
  return `${STORAGE_KEYS.detailsPrefix}:${id}`;
}
