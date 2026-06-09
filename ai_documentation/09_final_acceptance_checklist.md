# 09. Финальный acceptance checklist

## Соответствие требованиям задания
- [ ] React Native `>=0.77`.
- [ ] TypeScript используется.
- [ ] React Navigation `>=7` используется.
- [ ] Expo не используется.
- [ ] FakerJS используется для изображений.
- [ ] State-manager используется.
- [ ] Список постов загружается из `https://jsonplaceholder.typicode.com/posts`.
- [ ] Details загружается из `https://jsonplaceholder.typicode.com/posts/{id}`.
- [ ] Изображения 32x32 для списка генерируются один раз.
- [ ] Изображения 300x300 для details генерируются один раз.
- [ ] Данные сохраняются локально.
- [ ] Повторный запуск не делает повторный запрос при наличии cache.
- [ ] Избранное сохраняется после перезапуска.
- [ ] Избранные посты визуально выделяются.
- [ ] Избранные посты поднимаются вверх списка.
- [ ] Toggle favorite работает на DetailsScreen.

## Архитектура
- [ ] UI не содержит fetch/MMKV логики.
- [ ] Store не содержит низкоуровневую сериализацию MMKV.
- [ ] Repositories инкапсулируют API/cache.
- [ ] Storage adapter скрывает MMKV.
- [ ] Selectors отвечают за derived order.
- [ ] FakerJS enrichment изолирован в factory/helper.

## README/GitHub
- [ ] Код выложен в GitHub.
- [ ] README содержит установку одной командой.
- [ ] README содержит запуск второй командой.
- [ ] README объясняет архитектуру.
- [ ] README описывает AI-only подход.
- [ ] README перечисляет ограничения.

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
- [ ] Скриншоты или выгрузка чата добавлены перед сдачей.
- [ ] Перед публикацией AI-доказательств удалены секреты, токены, приватные URL, персональные данные и лишние локальные пути.

## Перед сдачей
- [ ] `npm install` проходит.
- [ ] `npm run lint` проходит.
- [ ] Android запуск проверен.
- [ ] iOS запуск проверен или документировано, почему не проверялся.
- [ ] Проверены сценарии из `07_testing_strategy.md`.
- [ ] Нет лишних features вне задания.
- [ ] Нет секретов в репозитории.
