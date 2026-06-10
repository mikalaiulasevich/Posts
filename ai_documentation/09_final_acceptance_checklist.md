# 09. Финальный acceptance checklist

## Соответствие требованиям задания

- [x] React Native `>=0.77`.
- [x] TypeScript используется.
- [x] React Navigation `>=7` используется.
- [x] Expo не используется.
- [x] FakerJS используется для изображений.
- [x] State-manager используется.
- [x] Список постов загружается из `https://jsonplaceholder.typicode.com/posts`.
- [x] Details загружается из `https://jsonplaceholder.typicode.com/posts/{id}`.
- [x] Изображения 32x32 для списка генерируются один раз.
- [x] Изображения 300x300 для details генерируются один раз.
- [x] Данные сохраняются локально.
- [x] Повторный запуск не делает повторный запрос при наличии cache.
- [x] Избранное сохраняется после перезапуска.
- [x] Избранные посты визуально выделяются.
- [x] Избранные посты поднимаются вверх списка.
- [x] Toggle favorite работает на DetailsScreen.

## Архитектура

- [x] UI не содержит fetch/MMKV логики.
- [x] Store не содержит низкоуровневую сериализацию MMKV.
- [x] Repositories инкапсулируют API/cache.
- [x] Storage adapter скрывает MMKV.
- [x] Selectors отвечают за derived order.
- [x] FakerJS enrichment изолирован в factory/helper.

## README/GitHub

- [ ] Код выложен в GitHub.
- [x] README содержит установку одной командой.
- [x] README содержит запуск второй командой.
- [x] README объясняет архитектуру.
- [x] README описывает AI-only подход.
- [x] README перечисляет ограничения.

## AI-доказательства

- [x] `ai_documentation/00_task_analysis.md` создан.
- [x] `ai_documentation/01_architecture_plan.md` создан.
- [x] `ai_documentation/02_data_model.md` создан.
- [x] `ai_documentation/03_implementation_plan.md` создан.
- [x] `ai_documentation/04_iteration_checklist.md` создан.
- [x] `ai_documentation/05_ai_prompts.md` создан.
- [x] `ai_documentation/06_decisions.md` создан.
- [x] `ai_documentation/07_testing_strategy.md` создан.
- [x] `ai_documentation/08_readme_plan.md` создан.
- [x] `ai_documentation/09_final_acceptance_checklist.md` создан.
- [x] Скриншоты или выгрузка чата добавлены перед сдачей.
- [ ] Перед публикацией AI-доказательств удалены секреты, токены, приватные URL, персональные данные и лишние локальные пути.

## Перед сдачей

- [x] `npm run setup` проходит.
- [x] `npm run lint` проходит.
- [ ] Android запуск проверен.
- [ ] iOS запуск проверен или документировано, почему не проверялся.
- [ ] Проверены сценарии из `07_testing_strategy.md`.
- [x] Нет лишних features вне задания.
- [ ] Нет секретов в репозитории.
