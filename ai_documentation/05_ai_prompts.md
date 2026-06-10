# 05. AI-промпты

## Стартовый промпт

Первичный artifact приложен в репозитории как `ai_prompts/prompt.md`. Ключевая выдержка стартового промпта:

```text
Ты работаешь как AI-агент в режиме AI-only для выполнения тестового задания по React Native.
Твоя текущая задача — НЕ писать сразу весь код приложения, а сначала изучить требования, проанализировать репозиторий, сформировать технический план, подготовить документацию в ai_documentation, разбить работу на фазы и зафиксировать промпты/правила/решения.
```

Полный текст сохранён в `ai_prompts/prompt.md`, чтобы проверяющий видел исходные правила без пересказа.

Дополнительный prompt для UI-polish сохранён в `ai_prompts/polishing.md`.

## Промпт для реализации фазы 1

```text
Реализуй Фазу 1 из ai_documentation/03_implementation_plan.md. Не меняй архитектурные решения без причины. Проверь package.json, добавь только недостающий @faker-js/faker, создай базовую структуру src и убедись, что TypeScript/entrypoint согласованы.
```

## Промпт для data layer

```text
Реализуй Фазу 2: API client на fetch, MMKV storage adapter, PostsRepository, DetailsRepository и FakerJS enrichment. Соблюдай one-time fetch: если данные есть в MMKV, сеть не вызывается. UI не трогай, кроме необходимых импортов не меняй существующие слои.
```

## Промпт для state layer

```text
Реализуй Фазу 3: Zustand store, actions loadPosts/loadPostDetails/toggleFavorite, selectors для избранных сверху и интеграцию с repositories. Избранное и cached данные должны переживать перезапуск.
```

## Промпт для UI/navigation

```text
Реализуй Фазы 4-5: React Navigation native stack, PostsScreen, DetailsScreen, PostListItem, loading/error/empty states и минимальный дизайн. Не добавляй лишние features вне ai_prompts/task.md.
```

## Промпт для ревью архитектуры

```text
Проведи архитектурное ревью реализации относительно ai_documentation/01_architecture_plan.md: проверь разделение UI/store/services/repositories/storage, отсутствие сетевой логики в UI и соблюдение Repository Pattern.
```

## Промпт для ревью кода

```text
Проведи code review: TypeScript strictness, обработка ошибок, отсутствие повторной генерации FakerJS-картинок, отсутствие повторных API-запросов при наличии cache, читаемость и KISS/YAGNI.
```

## Промпт для README

```text
Сгенерируй README для проверяющего: краткое описание, стек, архитектура, установка одной командой, запуск второй командой, iOS/Android примечания, AI-only evidence и ограничения.
```

## Промпт для финальной проверки

```text
Проверь проект перед сдачей по ai_documentation/09_final_acceptance_checklist.md. Сформируй список выполненных требований, рисков и команд, которые были запущены для проверки.
```

## Правила для AI-агентов

- Общаться на русском языке.
- Сначала читать `AGENTS.MD` и `ai_documentation/*`.
- Не усложнять архитектуру без необходимости.
- Не добавлять features вне тестового задания.
- Не генерировать FakerJS-картинки в React render.
- Не делать повторный fetch при наличии сохранённых данных.
- Перед публикацией AI-доказательств удалить секреты, токены, приватные URL, персональные данные и лишние локальные пути.
