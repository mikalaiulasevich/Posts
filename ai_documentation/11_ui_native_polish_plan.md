# 11. Native UI Polish Plan

## Текущее состояние UI

- Приложение уже реализует `PostsScreen`, `DetailsScreen`, loading/error/empty states и native stack navigation.
- UI использует стандартные React Native компоненты без UI-framework и без Expo.
- Данные приходят в UI через Zustand selectors/actions; UI не работает напрямую с API, MMKV или FakerJS.
- Safe Area обеспечивается `SafeAreaProvider`; экраны дополнительно используют нижний safe-area inset.
- Изображения рендерятся стандартным `Image`; URL картинок уже сохранён в MMKV и не генерируется в render-flow.

## Проблемы текущего интерфейса до polish

- Цвета, отступы, радиусы и типографика были размазаны по компонентам как literal values.
- Не было единого theme/tokens слоя для iOS/Android и light/dark режима.
- Карточки выглядели функционально, но недостаточно production-like: мало платформенной глубины, слабый hierarchy.
- Favorite state был заметен цветом и звездой, но без текстового chip-индикатора в списке.
- Accessibility labels/states можно усилить для списка и toggle-кнопки.
- Loading/error/empty states были минимальными и без общего visual language.

## Целевой визуальный стиль

- Строгий, нейтральный, аккуратный и близкий к нативным приложениям.
- Спокойный фон, белые/тёмные surfaces, умеренные borders и мягкая глубина.
- Системная типографика, читаемый body text, компактные captions.
- Favorite state заметен, но не кислотный: мягкий amber-accent + текстовый indicator.
- Press feedback нативный: opacity на iOS и ripple на Android.

## Различия между iOS и Android

- iOS: мягкие shadow-параметры через `shadowColor`, `shadowOpacity`, `shadowRadius`, `shadowOffset`.
- Android: используется `elevation` и `android_ripple` для интерактивных элементов.
- Header и StatusBar берут цвета из общей темы, чтобы выглядеть естественно в light/dark режиме.

## Дизайн-токены

Файл: `src/shared/ui/theme/tokens.ts`.

Содержит:

- `spacing`: `xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `xxxl`;
- `radius`: `sm`, `md`, `lg`, `xl`, `pill`;
- `typography`: `title`, `subtitle`, `body`, `bodyStrong`, `caption`;
- `colors`: light/dark palettes;
- `createCardShadow(theme)`: iOS shadow / Android elevation;
- `createAndroidRipple(theme)`: Android ripple config;
- `minimumHitSlop`: минимальный hitSlop для touch targets.

## План улучшения PostsScreen

- Использовать `SafeAreaView` для нижнего safe area.
- Брать фон и spacing из theme tokens.
- Сохранить `FlatList`, `keyExtractor`, `renderItem` через `useCallback`.
- Не добавлять pull-to-refresh, чтобы не нарушить one-time fetch требование.
- Оставить сортировку избранного через memoized derived order.
- Передавать стабильный `onPress(postId)` в item вместо inline navigation callback.

## План улучшения PostListItem

- Оформить item как production-like card/list item.
- Использовать tokens для spacing, radius, typography, colors.
- Добавить iOS/Android card depth.
- Добавить Android ripple и iOS opacity feedback.
- Добавить `accessibilityLabel`, `accessibilityRole="button"`, `accessibilityState.selected`.
- Использовать `React.memo`, чтобы список меньше перерисовывал item-компоненты.
- Favorite state показывать не только цветом, но и chip `★ Favorite`.

## План улучшения DetailsScreen

- Использовать `SafeAreaView` и themed background.
- Сделать изображение максимум `300x300`, но адаптировать к узкому экрану.
- Добавить meta row `Post #` / `User`.
- Оформить content card с platform-specific depth.
- Сделать toggle favorite button крупной, понятной и доступной.
- Добавить `accessibilityLabel` и `accessibilityState.selected` для toggle favorite.

## План улучшения loading/error/empty states

- Использовать общий theme и нейтральные card surfaces.
- Loading: activity indicator + compact label в card.
- Error: понятный visual marker, сообщение и крупная retry button.
- Empty: спокойный empty card, title и message.

## Accessibility-улучшения

- Интерактивные элементы имеют `accessibilityRole="button"`.
- Список и details button имеют осмысленные `accessibilityLabel`.
- Favorite state отражается через `accessibilityState.selected`.
- Favorite state не зависит только от цвета: есть `★ Favorite` chip и icon/text на details button.
- Touch targets усилены через `minHeight` и `minimumHitSlop`.

## Изменения без новых зависимостей

- Добавлен лёгкий theme/tokens слой в `src/shared/ui/theme`.
- Обновлены `Application`, `RootNavigator`, `PostsScreen`, `PostListItem`, `DetailsScreen`.
- Обновлены shared `LoadingState`, `ErrorState`, `EmptyState`.
- Новые зависимости не добавлялись.
- Data layer, repositories, persistence, store и бизнес-логика one-time fetch не менялись.

## Возможные улучшения с новыми зависимостями

Не требуются для тестового задания. Потенциально можно рассмотреть только после явного запроса:

- `react-native-reanimated` для более богатых micro-interactions;
- icon library для консистентных platform icons;
- screenshot/e2e tooling для визуальной регрессии.

На текущем этапе они не добавлены из-за KISS/YAGNI и ограничения не расширять scope без необходимости.

## Критерии готовности UI

- UI выглядит аккуратно на iOS и Android.
- Light/dark режимы получают корректные базовые цвета.
- Favorite state очевиден визуально и доступен для screen readers.
- Press states ощущаются нативно.
- Loading/error/empty states стилистически согласованы.
- Текст читаемый, без критичного обрезания.
- UI не вызывает API/MMKV/FakerJS напрямую.
- TypeScript, ESLint, Prettier и bundle checks проходят.
