# 12. Ревью производительности и качества кода

## Цель ревью

Проверить проект с фокусом на performance, лишние ререндеры, сложность ключевых операций, читаемость и соответствие архитектурным ограничениям тестового задания.

## Scope и ограничения

- Не переписывать приложение полностью.
- Не менять бизнес-требования.
- Не ломать persistence через MMKV.
- Не ломать one-time fetch для списка и details.
- Не ломать избранное.
- Не ломать FakerJS-кэширование: FakerJS остаётся только в enrichment helper/factories, не в render-flow.

## Найденные performance-проблемы

1. **Проверка избранного через `Array.includes` в render-flow списка.**
   - В `PostsScreen` каждый item проверял `favoriteIds.includes(item.id)`.
   - При `n` постах и `f` избранных это давало до `O(n * f)` проверок на проход списка.

2. **Сортировка избранных через `.sort()` для задачи partition.**
   - Для требования “избранные сверху, исходный порядок внутри групп сохранить” полноценная сортировка не нужна.
   - Старый алгоритм был `O(n log n)` после построения `Set`; достаточно одного прохода `O(n)`.

3. **Render-derived helper писал diagnostic log.**
   - `sortPostsWithFavorites` логировал каждый запуск. Это полезно для отладки, но helper вызывается из `useMemo` в UI render-flow; лишний console I/O может шуметь и замедлять debug-сборки.
   - Важные runtime-логи cache/API/FakerJS/persistence оставлены в repositories/storage/factories.

4. **Повторный вызов `loadPosts` мог читать repository/storage при уже загруженном списке в памяти.**
   - Сеть не вызывалась благодаря cache-first repository, но лишний action мог создавать loading/state churn и читать MMKV повторно.

5. **Theme object пересоздавался при каждом вызове `useAppTheme` и в `Application`.**
   - Это не ломало бизнес-логику, но уменьшало стабильность объектов темы и могло увеличивать число пересозданных style arrays/props.

## Найденные проблемы читаемости

1. Для избранного использовался только массив `favoriteIds`, хотя в коде есть частые membership-checks.
2. Название `sortPostsWithFavorites` оставлено, но реализация теперь делает stable partition; это сохранено ради минимального diff и совместимости импортов.
3. Часть inline-функций уже была оправдана и мемоизирована (`renderItem`, `handlePostPress`, `requestPosts`, `handleToggleFavorite`). Не добавлялись лишние `useCallback` там, где это не даёт пользы.
4. Файлы лежат в корректных слоях: UI в `screens`, state/selectors в `store`, repositories в `repositories`, storage/API в `data`, FakerJS enrichment в `entities`/`shared/lib`.

## Big O ключевых операций

Обозначения:

- `n` — количество постов в списке;
- `f` — количество избранных постов;
- `d` — размер JSON payload details одного поста;
- `s` — размер JSON payload списка в storage.

| Операция                                            |                                                          До |            После | Комментарий                                                                                          |
| --------------------------------------------------- | ----------------------------------------------------------: | ---------------: | ---------------------------------------------------------------------------------------------------- |
| Загрузка списка при memory hit                      | `O(s + n)` через repository/cache read при повторном action |   `O(1)` в store | Добавлен early return, если список уже есть в Zustand memory state.                                  |
| Загрузка списка при MMKV cache hit после cold start |                                                  `O(s + n)` |       `O(s + n)` | Нужно прочитать JSON и validate shape; сеть/FakerJS не вызываются.                                   |
| Загрузка списка при cache miss                      |                                            `O(n)` + network | `O(n)` + network | Fetch, validate, enrichment FakerJS и JSON serialize остаются линейными.                             |
| Поднятие избранных вверх                            |                                            `O(n log n + f)` |           `O(n)` | `.sort()` заменён на один stable partition pass по posts с `favoriteIdsById`.                        |
| Проверка `isFavorite` для item списка               |                                                      `O(f)` |           `O(1)` | Вместо `favoriteIds.includes(id)` используется объект-словарь.                                       |
| Проверка `isFavorite` на DetailsScreen              |                                                      `O(f)` |           `O(1)` | `selectIsFavorite` теперь читает `favoriteIdsById[id]`.                                              |
| Поиск details по id в store                         |                                                      `O(1)` |           `O(1)` | `detailsById` уже normalized record.                                                                 |
| Toggle favorite                                     |                                                      `O(f)` |           `O(f)` | Проверка membership стала `O(1)`, но обновление массива для persistence и serialize остаются `O(f)`. |
| Получение details при memory hit                    |                                                      `O(1)` |           `O(1)` | `detailsById[id]`.                                                                                   |
| Получение details при MMKV cache hit                |                                                      `O(d)` |           `O(d)` | Parse/validate одного объекта.                                                                       |
| Получение details при cache miss                    |                                            `O(d)` + network | `O(d)` + network | Fetch одного поста, enrichment FakerJS, сохранение в MMKV.                                           |

## Что было улучшено

1. Добавлен `favoriteIdsById` в Zustand state как object lookup для `O(1)` membership-checks.
2. `toggleFavorite` обновляет и persisted array `favoriteIds`, и runtime lookup `favoriteIdsById`.
3. `selectIsFavorite` переведён с `Array.includes` на lookup.
4. `PostsScreen` использует lookup для item favorite state.
5. `sortPostsWithFavorites` заменён с comparator sort на stable partition:
   - избранные остаются сверху;
   - порядок внутри группы избранных и обычных постов сохраняется как в исходном списке;
   - сложность снижена с `O(n log n)` до `O(n)`.
6. `keyExtractor` вынесен на уровень модуля, чтобы не создавать функцию при каждом render.
7. В `loadPosts` добавлен memory-cache guard: если posts уже в Zustand state, повторный repository/MMKV flow не запускается.
8. `useAppTheme` и `Application` мемоизируют theme object по `colorScheme`.
9. Убран render-time diagnostic log из selector/helper сортировки; cache/API/FakerJS логи сохранены.
10. Сетевой `fetch` оставлен нативным без `AbortController`/timeout-wrapper: Android runtime-проверка показала, что проблема была во внешнем VPN/network окружении телефона, а не в API или data layer.

## Что оставлено без изменений и почему

1. **Persistence format для избранного оставлен массивом `favoriteIds`.**
   - Это простой JSON-формат, уже совместимый с MMKV cache.
   - Runtime lookup добавлен отдельно, без миграции storage key.

2. **FakerJS enrichment оставлен в factories/helper.**
   - Это соответствует требованию: изображения генерируются один раз при cache miss и сохраняются в модели.

3. **Repositories оставлены владельцами cache hit/cache miss/API/MMKV.**
   - Архитектура `UI -> Zustand store -> repositories -> api/storage/faker helper` сохранена.

4. **FlatList не переписан.**
   - Уже были `keyExtractor`, `renderItem` через `useCallback`, `initialNumToRender`, `maxToRenderPerBatch`, `windowSize`, `removeClippedSubviews` для Android.
   - Pagination/pull-to-refresh не добавлялись, потому что противоречат one-time fetch требованиям.

5. **Services/use-cases не добавлялись.**
   - Для текущего объёма это было бы лишним слоем без performance-пользы.

## Проверки, выполненные автоматически

```sh
npm run typecheck
npm run lint
```

Обе команды должны проходить после внесённых изменений.

## Что нужно проверить вручную

1. Первый запуск приложения:
   - список загружается из API;
   - появляются логи `cache-miss-fetch-start`, `request:start`, `list-image:generate`.
2. Повторный запуск:
   - список берётся из MMKV;
   - network request для списка не выполняется;
   - FakerJS для уже сохранённого списка не вызывается.
3. DetailsScreen:
   - первый вход в details конкретного поста делает один request;
   - повторный вход использует cache/memory cache;
   - details image не регенерируется.
4. Favorite flow:
   - добавление в избранное визуально выделяет item;
   - избранный item поднимается вверх;
   - удаление возвращает item в обычную группу;
   - состояние сохраняется после перезапуска.
5. Runtime UI:
   - прокрутка FlatList остаётся плавной;
   - item press открывает правильный `postId`;
   - iOS/Android визуально не сломаны.
