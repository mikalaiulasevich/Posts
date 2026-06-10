# 01. Архитектурный план

## Выбранная архитектура

Используется упрощённая Clean Architecture, достаточная для тестового задания без избыточного enterprise-boilerplate. Цель — разделить UI, состояние, бизнес-логику, data access и storage.

## Слои приложения

1. **Presentation/UI**
   - экраны `PostsScreen`, `DetailsScreen`;
   - компоненты списка, состояния загрузки/ошибки/пустого результата;
   - не содержит сетевой логики и прямой работы с MMKV.
2. **Navigation**
   - root/native stack navigator;
   - типизация route params.
3. **State layer**
   - Zustand store;
   - actions для загрузки списка, деталей и toggle favorite;
   - selectors для сортировки избранных.
4. **Domain/services (опционально)**
   - тонкие use-cases только для бизнес-flow, если они реально упрощают код;
   - не владеют cache/API деталями, чтобы не дублировать repositories.
5. **Data layer**
   - API-клиент на `fetch`;
   - repositories для списка и деталей;
   - repositories владеют one-time fetch: cache hit/cache miss, API-запросом, enrichment и сохранением;
   - storage adapter поверх MMKV.
6. **Shared**
   - типы, константы, helpers, генерация FakerJS-изображений.

## Proposed folder structure

```text
src/
  app/
    Application.tsx
  navigation/
    RootNavigator.tsx
    types.ts
  screens/
    posts/
      PostsScreen.tsx
      components/PostListItem.tsx
    details/
      DetailsScreen.tsx
  store/
    postsStore.ts
    selectors.ts
  repositories/
    PostsRepository.ts
    DetailsRepository.ts
    FavoritesRepository.ts
  data/
    api/
      postsApi.ts
      httpClient.ts
    storage/
      mmkvStorage.ts
      storageKeys.ts
  entities/
    post/
      factories.ts
      guards.ts
      types.ts
  shared/
    ui/
      LoadingState.tsx
      ErrorState.tsx
      EmptyState.tsx
    lib/
      fakerImages.ts
```

## Ответственность слоёв

- UI вызывает store actions и отображает store state.
- Store вызывает repository actions и хранит глобальное состояние.
- Repositories скрывают источник данных: API + storage, владеют cache hit/cache miss и сохранением enriched данных.
- Services/use-cases допустимы только как тонкая orchestration-прослойка, если появится бизнес-логика сверх cache/fetch. В текущей реализации отдельный service layer не создан, потому что flow `UI -> Zustand store -> repositories` достаточен и проще.
- Storage adapter изолирует MMKV и формат сериализации.
- Factories/helpers создают enriched models с FakerJS-картинками один раз.

## Паттерны

- **Repository Pattern** — единая точка доступа к данным, UI не знает про API/storage.
- **Adapter Pattern** — MMKV скрыт за простым интерфейсом `get/set/remove`.
- **Selector Pattern** — derived state для сортировки избранных.
- **Factory/helper** — создание enriched posts/details с изображениями.
- **Single Responsibility** — каждый модуль решает одну задачу.

## Почему Repository Pattern

Repository Pattern нужен, потому что данные приходят из двух источников: сеть и локальное хранилище. Репозиторий позволит реализовать one-time fetch без размазывания условий по UI/store.

## Почему Zustand

Zustand выбран как state-manager, потому что он:

- уже установлен в проекте;
- прост для небольшого приложения;
- даёт минимум boilerplate;
- подходит для глобального избранного и cached posts;
- легко сочетается с selectors и ручной persistence-логикой.

## Persistence-логика

- Storage: MMKV, потому что он уже установлен и подтверждён как выбранное решение.
- В MMKV сохраняются:
  - enriched список постов;
  - details по `postId`;
  - `favoriteIds`;
  - метаданные загрузки, если понадобятся.
- Store при старте пытается восстановить состояние из MMKV.
- Если список есть в MMKV — API не вызывается.
- Если details для `id` есть в MMKV — API не вызывается.
- FakerJS-изображение генерируется только при первом enrichment и сохраняется в модели.

## Контракт FakerJS helper

На фазе реализации завести один централизованный helper, например:

- `createListImageUrl(): string` — возвращает URL/ресурс с явными 32x32;
- `createDetailsImageUrl(): string` — возвращает URL/ресурс с явными 300x300.

Helper вызывается только при enrichment в repository/factory. Selectors, store render-flow и UI не вызывают FakerJS.

## Что не усложняем

- Services/use-cases не создавать автоматически: для маленького задания предпочтительный flow — `UI -> Zustand store -> repository -> api/storage/faker helper`.
- Не добавляем серверную синхронизацию избранного.
- Не добавляем pagination, pull-to-refresh и offline queue, так как их нет в задании.
- Не добавляем тяжёлый state framework ради маленького приложения.
