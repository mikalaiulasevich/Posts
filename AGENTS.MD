# AGENTS.MD — правила работы AI-агентов в проекте Posts

## Язык

- Общаться с пользователем на русском языке.
- Документацию для тестового задания писать на русском языке.

## Главные источники контекста

Перед изменениями читать:

1. `task.md` — исходное тестовое задание.
2. `prompt.md` — AI-only правила и документационные требования.
3. `ai_documentation/00_task_analysis.md` — анализ требований.
4. `ai_documentation/01_architecture_plan.md` — архитектурный план.
5. `ai_documentation/03_implementation_plan.md` — фазы реализации.
6. `ai_documentation/09_final_acceptance_checklist.md` — финальная проверка.

## Текущие решения

- State-manager: Zustand.
- Persistence: MMKV.
- API: fetch.
- Архитектура: упрощённая Clean Architecture.
- Data access: Repository Pattern. Repositories владеют cache hit/cache miss, API, MMKV и FakerJS enrichment; services/use-cases создавать только при реальной необходимости.
- FakerJS: обязательный источник изображений; `@faker-js/faker` установлен и должен вызываться только в enrichment helper/factories.

## Ограничения

- Не использовать Expo.
- Не добавлять features вне тестового задания без явного запроса.
- Не генерировать FakerJS-изображения в render-компонентах.
- Не делать повторные API-запросы, если данные уже есть в MMKV.
- Не смешивать UI, store, repositories и storage adapter.

## Текущее состояние реализации

- Документационная фаза завершена, `ai_documentation/*` и `AGENTS.MD` созданы.
- Приложение реализовано в `src/` по упрощённой Clean Architecture.
- Допускаются только правки, которые улучшают соответствие тестовому заданию, качество, стабильность или документацию.

## Перед сдачей

- Проверить `ai_documentation/09_final_acceptance_checklist.md`.
- Обновить README по плану из `ai_documentation/08_readme_plan.md`.
- Приложить AI-only доказательства: промпты, правила, скриншоты или выгрузки чата.
- Перед публикацией AI-доказательств удалить секреты, токены, приватные URL, персональные данные и лишние локальные пути.
