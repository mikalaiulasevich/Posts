# Posts

Небольшое React Native CLI приложение для тестового задания: список постов из JSONPlaceholder, экран деталей, избранное и persistence через MMKV.

## Стек

- React Native `0.86`
- TypeScript strict
- React Navigation native stack
- Zustand
- MMKV
- FakerJS
- Fetch API

## Требования окружения

- Node.js `>=22.11.0`
- Настроенное React Native CLI окружение для Android и/или iOS
- Для iOS: CocoaPods/Bundler окружение

## Что реализовано

- `PostsScreen` загружает список постов из `https://jsonplaceholder.typicode.com/posts`.
- Каждый пост обогащается FakerJS-картинкой `32x32`.
- `DetailsScreen` загружает пост из `https://jsonplaceholder.typicode.com/posts/{id}`.
- Детали обогащаются FakerJS-картинкой `300x300`.
- Пост можно добавить в избранное и удалить из избранного.
- Избранные посты визуально выделяются и поднимаются вверх списка.
- Enriched список, детали и `favoriteIds` сохраняются в MMKV.
- При наличии cache повторный API-запрос не выполняется.
- FakerJS-картинки генерируются только на первом enrichment и затем читаются из cache.
- В ключевых слоях добавлены безопасные diagnostic logs с префиксом `PostsApp`.

## Архитектура

Упрощённая Clean Architecture:

```text
UI -> Zustand store -> repositories -> api/storage/faker helper
```

Ключевые директории:

```text
src/
  app/                 # Application root
  navigation/          # Native stack navigation
  screens/             # PostsScreen, DetailsScreen, UI components
  store/               # Zustand state, actions, selectors/helpers
  repositories/        # Repository Pattern, cache-first data access
  data/
    api/               # fetch API client
    storage/           # MMKV JSON adapter and keys
  entities/post/       # post types, factories, runtime guards
  shared/              # UI states and FakerJS image helper
```

UI не содержит сетевой логики, прямой работы с MMKV или вызовов FakerJS.

## Persistence, cache и логи

- `PostsRepository` и `DetailsRepository` реализуют cache-first flow.
- При cache hit API и FakerJS enrichment не вызываются.
- При первом parallel cache miss используется in-flight dedupe, чтобы не запускать повторный API/FakerJS flow.
- При повреждённом MMKV JSON cache ключ удаляется и выполняется controlled refetch.
- URL картинок создаются через FakerJS: `faker.image.personPortrait({ size: 32 })` для списка и `faker.image.url({ width: 300, height: 300 })` для деталей. К URL добавляется `cacheBust`, чтобы каждая впервые сгенерированная модель получила стабильный уникальный image URL.
- Для сброса старых серых/неудачных image URL используются новые MMKV keys `posts:list:v3` и `posts:details:v3`.
- Картинки рендерятся стандартным React Native `Image`; URL сохраняется в MMKV, поэтому FakerJS не вызывается повторно при cache hit.
- Логи помогают проверить:
  - `request:start` / `request:success` — фактические network вызовы;
  - `cache-hit` / `cache-miss-fetch-start` — cache behavior;
  - `list-image:generate` / `details-image:generate` — моменты генерации FakerJS;
  - `favorites:set` / `favorites:get:restored` — persistence избранного.
- В debug-режиме логи видны в Metro terminal / React Native DevTools / Xcode или Android Logcat как строки с префиксом `[PostsApp:...]`.
- В production-like runtime (`globalThis.__DEV__ === false`) logger автоматически молчит. Если нужно временно отключить diagnostic logs в debug, установите `globalThis.POSTS_APP_LOGS_DISABLED = true`.

## Установка

```sh
npm run setup
```

## Запуск

Вторая команда после установки — запуск нужной платформы:

Android:

```sh
npm run android
```

iOS:

```sh
npm run ios
```

Metro отдельно нужен только если вы хотите запустить bundler вручную:

```sh
npm start
```

## Проверки

TypeScript:

```sh
npm run typecheck
```

ESLint:

```sh
npm run lint
```

Проверка production bundle:

```sh
npx react-native bundle \
  --entry-file index.js \
  --platform ios \
  --dev false \
  --bundle-output /tmp/posts-bundle-check/main.jsbundle \
  --assets-dest /tmp/posts-assets-check
```

## AI-only материалы

Документация по анализу требований, архитектуре, плану реализации и acceptance checklist находится в `ai_documentation/`.

Ключевые файлы:

- `ai_documentation/00_task_analysis.md`
- `ai_documentation/01_architecture_plan.md`
- `ai_documentation/03_implementation_plan.md`
- `ai_documentation/05_ai_prompts.md`
- `ai_documentation/06_decisions.md`
- `ai_documentation/09_final_acceptance_checklist.md`
- `ai_documentation/11_ui_native_polish_plan.md`
- `ai_prompts/prompt.md`
- `ai_prompts/task.md`
- `ai_prompts/ai_dialog.md`
- `ai_prompts/polishing.md`
- `ai_prompts_screenshots/`

Перед публикацией AI-доказательств нужно удалить секреты, приватные URL, персональные данные и лишние локальные пути из выгрузок чатов/скриншотов.

## Ограничения

- Нет pagination: задание требует простой список.
- Нет pull-to-refresh: данные должны запрашиваться один раз и затем читаться из cache.
- Нет server sync избранного: `favoriteIds` сохраняются локально в MMKV.
- Нет offline queue: вне объёма тестового задания.
- Реальные Android/iOS запуски нужно подтвердить на локальном окружении проверяющего или автора перед финальной публикацией.
