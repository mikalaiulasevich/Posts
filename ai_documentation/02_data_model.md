# 02. Модель данных

## API Post type

```ts
export type ApiPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};
```

## Enriched post для списка

```ts
export type PostListItem = {
  id: number;
  userId: number;
  title: string;
  body: string;
  thumbnailUrl: string; // FakerJS 32x32, генерируется один раз
};
```

## Details post

```ts
export type PostDetails = {
  id: number;
  userId: number;
  title: string;
  body: string;
  imageUrl: string; // FakerJS 300x300, генерируется один раз
};
```

## Структура store

```ts
type PostsState = {
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
```

## Persisted state в MMKV

```ts
// Список хранится одним ключом:
PostListItem[];

// Details хранится отдельным ключом на каждый postId:
PostDetails;

// Избранное хранится отдельным ключом:
number[];
```

## Storage keys

```ts
const STORAGE_KEYS = {
  posts: 'posts:list:v3',
  detailsPrefix: 'posts:details:v3',
  favorites: 'posts:favorites:v1',
};

const postDetailsKey = (id: number) => `${STORAGE_KEYS.detailsPrefix}:${id}`;
```

## Правила FakerJS-изображений

- Для списка используется изображение 32x32.
- Для деталей используется изображение 300x300 через `faker.image.url({ width: 300, height: 300 })`.
- Изображение генерируется только при создании enriched модели после первого API-запроса.
- Сгенерированный URL сохраняется в MMKV вместе с моделью.
- UI никогда не вызывает FakerJS напрямую.
- Повторное открытие приложения не должно менять URL изображений.

## Сортировка избранных

Selector возвращает новый массив:

1. избранные посты первыми;
2. внутри групп сохраняется исходный порядок списка из API;
3. `favoriteIds` используется только для проверки статуса, не как источник порядка.

Пример правила:

```ts
const sortedPosts = [...posts].sort((a, b) => {
  const aFav = favoriteIds.includes(a.id);
  const bFav = favoriteIds.includes(b.id);
  if (aFav === bFav) return 0;
  return aFav ? -1 : 1;
});
```

## Loading/error/empty state

- `posts.length === 0 && !isPostsLoading && !postsError` — empty state.
- Ошибка загрузки списка не должна очищать уже сохранённый cache.
- Ошибка details для одного поста не должна ломать список.
