// Навчальний модуль. Не зберігайте паролі, токени або персональні дані.
// У місії 05 учень самостійно визначить формат і правила збереження.
export function isStorageAvailable() {
  try {
    const key = '__nextlab_check__';
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
