import { setStatus, showCheckResult } from './ui.js';
import { createInitialState } from './state.js';

const state = createInitialState();
setStatus(state.ready ? 'JS підключено' : 'Помилка запуску');

document.querySelector('#check-button')?.addEventListener('click', () => {
  showCheckResult('JavaScript працює. Тепер можна починати Місію 01.');
});
