# 10. Предсдачное ревью

## Выполненные требования

### Функциональность

- React Native `0.86` используется.
- TypeScript используется в strict-режиме.
- React Navigation `>=7` используется.
- Expo не используется.
- FakerJS используется для изображений.
- Zustand используется как state-manager.
- Список постов загружается из `https://jsonplaceholder.typicode.com/posts`.
- Details загружается из `https://jsonplaceholder.typicode.com/posts/{id}`.
- Изображения `32x32` для списка генерируются при первом enrichment.
- Изображения `300x300` для details генерируются при первом enrichment.
- Enriched список, details и `favoriteIds` сохраняются локально в MMKV.
- При наличии cache повторный API-запрос не выполняется.
- При parallel first cache miss повторный API/FakerJS flow предотвращается in-flight dedupe.
- URL картинок получают `cacheBust` query-параметр.
- Картинки рендерятся стандартным React Native `Image`; URL остаётся стабильным за счёт MMKV cache.
- Избранное сохраняется после перезапуска через MMKV.
- Избранные посты визуально выделяются и поднимаются вверх списка.
- Toggle favorite реализован на `DetailsScreen`.

### Архитектура

- UI не содержит `fetch`/MMKV/FakerJS логики.
- Store не содержит низкоуровневую сериализацию MMKV.
- Repositories инкапсулируют API/cache/enrichment.
- Storage adapter скрывает MMKV.
- Derived order избранных вынесен в selector/helper и мемоизирован в UI.
- FakerJS enrichment изолирован в factory/helper.
- Diagnostic logger добавлен без новых зависимостей и без изменения архитектурных границ.

### README и AI-only

- README содержит установку одной командой: `npm run setup`.
- README содержит команды запуска: `npm start`, `npm run android`, `npm run ios`.
- README объясняет архитектуру.
- README описывает AI-only материалы.
- README перечисляет ограничения.
- `ai_documentation/*` создана.

## Риски и неподтверждённые вручную пункты

- Код ещё нужно выложить в GitHub, если репозиторий не опубликован.
- Скриншоты и краткая выгрузка чата добавлены в репозиторий.
- Перед публикацией AI-доказательств выполнена санитизация известных локальных путей в скриншотах и grep-аудит секретов; перед публичной отправкой всё равно стоит открыть артефакты глазами.
- Реальный Android запуск не выполнялся в этой CLI-сессии.
- Реальный iOS Simulator запуск не выполнялся в этой CLI-сессии; вместо него проверен production bundle для iOS.
- Сценарии из `07_testing_strategy.md` требуют ручной проверки на устройстве/симуляторе.
- Android release signing не хранит production keystore в git; приватный keystore должен настраиваться локально/CI перед реальной публикацией.

## Команды, запущенные для проверки

```sh
npm run setup
npm ls eslint react react-native @faker-js/faker
npm run typecheck
npm run lint -- --max-warnings=0
npx prettier --check 'src/**/*.{ts,tsx}' package.json package-lock.json README.md 'ai_documentation/**/*.md' AGENTS.MD
npx react-native bundle --entry-file index.js --platform ios --dev false --bundle-output /tmp/posts-bundle-check-ios/main.jsbundle --assets-dest /tmp/posts-assets-check-ios
npx react-native bundle --entry-file index.js --platform android --dev false --bundle-output /tmp/posts-bundle-check-android/main.jsbundle --assets-dest /tmp/posts-assets-check-android
git diff --check
grep -RniE "fetch\\(|requestJson|createMMKV|MMKV|mmkvStorage|STORAGE_KEYS|postDetailsKey|@faker-js/faker|faker\\." src/screens src/store src/repositories src/data src/entities src/shared
grep -RniE "react-native-fast-image|FastImage|Clear cache|CacheRepository|clearCache|size: 512" src README.md package.json package-lock.json ios/Podfile.lock
grep -RniE "RefreshControl|pull-to-refresh|offline queue|server sync" src
grep -RniE "(API[_]KEY|SEC[R]ET|TOK[E]N|PRIVATE[ ]KEY|BEGIN[ ]RSA|ghp[_]|sk[-])" AGENTS.MD README.md ai_prompts/ai_dialog.md ai_documentation src package.json Gemfile Gemfile.lock ai_prompts/task.md ai_prompts/prompt.md
```

## Как читать diagnostic logs

- `[PostsApp:HttpClient] request:start` — сетевой запрос начался.
- `[PostsApp:PostsRepository] getPosts:cache-hit` — список взят из cache, API/FakerJS не должны вызываться.
- `[PostsApp:PostsRepository] getPosts:reuse-in-flight-request` — parallel first miss дедуплицирован.
- `[PostsApp:DetailsRepository] getPostDetails:cache-hit` — details взяты из cache.
- `[PostsApp:FakerImages] list-image:generate` — генерация `32x32` картинки списка.
- `[PostsApp:FakerImages] details-image:generate` — генерация `300x300` картинки details.
- `[PostsApp:FavoritesRepository] favorites:set` — избранное сохранено.
- `[PostsApp:PostListItem] thumbnail:loaded` и `[PostsApp:DetailsScreen] image:loaded` — remote image загрузилась.
- Diagnostic logs видны в debug через `console.log`/`console.warn`/`console.error`.
- В production-like runtime (`globalThis.__DEV__ === false`) logger молчит; для временного отключения в debug можно установить `globalThis.POSTS_APP_LOGS_DISABLED = true`.
