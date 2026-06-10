# 13. Полировка анимаций

## Цель

Добавить лёгкие и уместные анимации на стандартных API React Native, чтобы интерфейс ощущался живее, но при этом не усложнять код и не менять бизнес-логику приложения.

## Ограничения

- Новые зависимости не добавлялись.
- Используются только стандартные API React Native: `Animated`, `LayoutAnimation`, `Pressable`, `Easing`, `Platform`.
- Persistence через MMKV не менялся.
- One-time fetch не менялся.
- FakerJS-данные не пересоздаются и по-прежнему генерируются только в enrichment helper/factories.
- Pull-to-refresh не добавлялся.
- Тяжёлые per-item анимации внутри большого списка не добавлялись.

## Какие анимации добавлены

### 1. Shared fade-in helper

Файлы:

- `src/shared/ui/animations/FadeInView.tsx`
- `src/shared/ui/animations/index.ts`

Добавлен небольшой `FadeInView`, который использует:

- `Animated.Value`;
- `Animated.timing`;
- `Easing.out(Easing.cubic)`;
- `useNativeDriver: true`;
- `opacity`, `translateY`, `scale`.

Этот helper нужен, чтобы не дублировать animation-код в экранах и state-компонентах.

### 2. Loading/Error/Empty states

Файлы:

- `src/shared/ui/LoadingState.tsx`
- `src/shared/ui/ErrorState.tsx`
- `src/shared/ui/EmptyState.tsx`

Добавлено мягкое fade-in появление карточки состояния. Это уместно, потому что эти состояния появляются редко и не находятся внутри большого списка.

### 3. PostListItem press feedback и favorite badge

Файлы:

- `src/shared/ui/primitives/UiPressable.tsx`
- `src/shared/ui/primitives/UiButton.tsx`
- `src/screens/posts/components/PostListItem.tsx`

Что добавлено:

- `UiPressable` получил опциональный `pressedScale`.
- `UiButton` использует лёгкий scale feedback при нажатии.
- `PostListItem` на iOS получает очень небольшой scale feedback (`0.985`), Android продолжает использовать `android_ripple` через существующий `UiPressable`.
- Favorite badge появляется через короткий fade/scale (`FadeInView`, `duration: 180`, `initialScale: 0.92`).

Почему это безопасно:

- `PostListItem` остаётся `React.memo`.
- Анимация badge запускается только когда badge появляется.
- Нет loop-анимаций, spring-физики или сложных измерений в списке.

### 4. Favorite order LayoutAnimation

Файлы:

- `src/shared/ui/animations/layoutAnimation.ts`
- `src/screens/posts/PostsScreen.tsx`

Добавлен helper `configureFavoriteLayoutAnimation()`:

- использует `LayoutAnimation.configureNext`;
- не вызывает `UIManager.setLayoutAnimationEnabledExperimental`, потому что в React Native New Architecture этот вызов является no-op и даёт warning на Android;
- анимирует `create`, `update`, `delete` через `easeInEaseOut`, `duration: 220`.

Где вызывается:

- на focus `PostsScreen`, после короткой задержки, чтобы старый порядок успел отрисоваться при возврате;
- прямо перед локальным применением нового visible favorite-order state, чтобы `LayoutAnimation.configureNext` был запланирован до layout update списка;
- дополнительно запускается лёгкий list-level `Animated` settle (`opacity` + `translateY`), чтобы эффект был видим даже если `FlatList` на конкретной платформе не показывает перемещение строк достаточно явно.

Почему это уместно:

- изменение порядка избранных — редкое пользовательское действие;
- global favorite state и persistence обновляются сразу на `DetailsScreen`;
- visible order списка отложен до focus `PostsScreen`, поэтому reorder можно увидеть при возврате;
- `LayoutAnimation.configureNext` вызывается до локального layout update, а не post-commit;
- `LayoutAnimation` не требует ручной анимации каждого элемента списка;
- код остаётся коротким и не добавляет external animation runtime.

### 5. DetailsScreen entrance и favorite pulse

Файлы:

- `src/screens/details/DetailsScreen.tsx`
- `src/shared/ui/animations/usePulseOnChange.ts`

Добавлено:

- плавное появление изображения;
- staggered fade-in для meta/title;
- staggered fade-in для body;
- fade-in для favorite button;
- короткий pulse scale кнопки при изменении favorite state;
- сам toggle favorite остаётся мгновенным для business state/persistence, а порядок списка применяется при возвращении на `PostsScreen`.

`usePulseOnChange` использует:

- `Animated.sequence`;
- `Animated.timing`;
- `Easing.out(Easing.cubic)`;
- `useNativeDriver: true`;
- только `transform: scale`.

Почему кнопка не “прыгает” чрезмерно:

- peak scale ограничен `1.06`;
- длительность короткая (`150ms` туда и обратно);
- первый mount не пульсирует, pulse запускается только при реальном изменении значения.

## Где используется `Animated`

- `FadeInView` — opacity/translateY/scale entrance animations.
- `usePulseOnChange` — scale pulse при toggle favorite.
- `DetailsScreen` — `Animated.View` вокруг favorite button.

Во всех этих местах используется `useNativeDriver: true`, потому что анимируются только opacity и transform.

## Где используется `LayoutAnimation`

- `configureFavoriteLayoutAnimation()` в `src/shared/ui/animations/layoutAnimation.ts`.
- Вызов в `PostsScreen` перед применением deferred visible favorite order.

`LayoutAnimation` выбран для reorder-flow, потому что он проще и легче, чем ручная анимация каждой строки `FlatList`. Короткая задержка после focus нужна, чтобы старый порядок успел появиться на экране, а затем новый порядок применился заметно.

## Какие анимации специально не добавлялись

- Не добавлялись per-row mount animations для всех элементов `FlatList`, чтобы не нагружать большой список.
- Не добавлялись loop-анимации, shimmer/skeleton и постоянные эффекты.
- Не добавлялись gesture-heavy эффекты, drag/drop, shared transitions.
- Не добавлялись Reanimated/Moti/Lottie или другие зависимости.
- Не добавлялась анимация сетевых/cache событий, чтобы не смешивать UI polish с data flow.

## Что нужно проверить вручную на iOS

1. Первый запуск:
   - Loading state плавно появляется.
   - После загрузки список отображается без мерцания.
2. Нажатие на пост:
   - item даёт лёгкий opacity/scale feedback.
   - переход в details работает как раньше.
3. DetailsScreen:
   - изображение, заголовок и текст появляются плавно.
   - favorite button не прыгает чрезмерно.
4. Toggle favorite:
   - кнопка даёт короткий pulse.
   - при возвращении к списку избранный пост выделен и находится сверху.
5. Error/Empty states, если воспроизвести:
   - карточка состояния появляется плавно.

## Что нужно проверить вручную на Android

1. Нажатие на item:
   - виден native `android_ripple`.
   - нет конфликтов ripple с карточкой/скруглениями.
2. Нажатие на favorite button:
   - scale feedback ощущается аккуратно.
   - ripple/scale не ломают layout.
3. Toggle favorite:
   - `LayoutAnimation` не вызывает warning/crash.
   - В логах нет warning `setLayoutAnimationEnabledExperimental is currently a no-op in the New Architecture`.
   - после возврата на список старый порядок кратко виден, затем список мягко применяет новый порядок.
   - итоговый порядок списка корректный.
4. Loading/Error/Empty:
   - fade-in работает плавно.
5. Производительность:
   - список скроллится без заметных лагов;
   - нет постоянных анимаций во время idle.

## Проверки

После изменений нужно выполнить:

```sh
npm run typecheck
npm run lint
```
