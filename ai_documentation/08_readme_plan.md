# 08. План README

## Цель README

README должен позволить проверяющему быстро установить и запустить проект, понять архитектуру и увидеть подтверждение AI-only подхода.

## Предлагаемая структура

1. Название проекта.
2. Краткое описание функциональности.
3. Стек технологий.
4. Требования окружения.
5. Установка.
6. Запуск Android.
7. Запуск iOS.
8. Архитектура.
9. Persistence и one-time fetch.
10. AI-only процесс.
11. Известные ограничения.
12. Скриншоты/демо, если будут подготовлены.

## Команда установки

Финальный README должен дать одну основную install-команду для проверяющего. В текущей реализации базовая команда установки:

```sh
npm run setup
```

`setup` выполняет `npm install`, `bundle install` и `bundle exec pod install`, чтобы сохранить требование одной install-команды.

## Команды запуска

Android:

```sh
npm run android
```

iOS:

```sh
npm run ios
```

Metro отдельно при необходимости:

```sh
npm start
```

## Описание архитектуры в README

Кратко описать слои:

- screens/components;
- navigation;
- Zustand store;
- repositories;
- MMKV storage adapter;
- FakerJS enrichment.

## Описание AI-only подхода

README должен ссылаться на:

- `ai_documentation/00_task_analysis.md`;
- `ai_documentation/03_implementation_plan.md`;
- `ai_documentation/05_ai_prompts.md`;
- `ai_documentation/06_decisions.md`;
- возможные скриншоты/выгрузки чата, если они будут добавлены позже.

## Известные ограничения

- Нет pagination, потому что задание требует простой список.
- Нет pull-to-refresh, потому что данные должны запрашиваться только один раз.
- Нет серверной синхронизации избранного.
- FakerJS уже добавлен как зависимость и используется только в enrichment helper/factories.
