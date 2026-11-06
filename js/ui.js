export function setStatus(message) {
  const element = document.querySelector('#app-status');
  if (element) element.textContent = message;
}
export function showCheckResult(message) {
  const element = document.querySelector('#check-result');
  if (element) element.textContent = message;
}
