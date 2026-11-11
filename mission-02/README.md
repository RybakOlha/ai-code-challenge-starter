# NextLab · Місія 02 (v0.6)

## Структура
- `index.html` — семантична структура шести етапів.
- `css/style.css` — оформлення й адаптивність.
- `js/app.js` — навігація, LocalStorage, імпорт та експорт JSON/Markdown, демонстрація їдальні.

## Запуск
У каталозі `NextLab_Mission02_Multifile_v0_6` виконайте `python -m http.server 8000` (або `python3 -m http.server 8000`), відкрийте `http://localhost:8000`.

Важливо: не перейменовуйте шляхи `css/style.css` і `js/app.js` без зміни посилань у HTML. Ключ LocalStorage залишено незмінним: `nextlab:mission02:v1`.

## Публікація
Завантажуйте **всю папку**, а не тільки `index.html`. Для GitHub Pages розмістіть її як каталог репозиторію або скопіюйте три основні файли разом зі структурою папок.
