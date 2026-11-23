'use strict';
/**
 * Місія 05 — учнівський файл. Це НЕ готове рішення.
 * Місія 04 (фільтри) вже працює у js/app.js.
 * TODO-A: зв'язок картки страви з формою (частково підготовлений).
 * TODO-Б: самостійна перевірка кількості; без готового розв'язку.
 * TODO-В: валідація, підсумок і стани форми.
 */
const orderForm = document.getElementById('orderForm');
const selectedDishInput = document.getElementById('selectedDish');
const orderPrice = document.getElementById('orderPrice');
const orderSummary = document.getElementById('orderSummary');
let selectedDish = null;
function isValidQuantity(value) {
    // ОБОВ'ЯЗКОВО САМОСТІЙНО: порожнє значення, ціле число, межі 1–5.
    // Підказка: Number.isInteger() перевіряє цілі числа.
    // TODO: замініть цей навчальний результат власною реалізацією.
    return false;
}
function selectDish(dish) {
    // Інкремент А: кнопка вже передає сюди об'єкт страви.
    // TODO: збережіть dish, відобразіть назву, оновіть вартість.
    selectedDish = dish;
    selectedDishInput.value = dish.name;
    orderPrice.textContent = `Ціна за порцію: ${dish.price} грн`;
    orderSummary.hidden = true;
    document.getElementById('order').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function setFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(({ studentName: 'nameError', studentClass: 'classError', selectedDish: 'dishError', quantity: 'quantityError' })[fieldId]);
    input.setAttribute('aria-invalid', String(Boolean(message)));
    error.textContent = message;
}
function validateOrder() {
    // TODO-Б: перевірте ім'я після trim(), клас зі списку,
    // обрану страву та кількість через власну isValidQuantity().
    // Для помилок використовуйте setFieldError(fieldId,message).
    // Поверніть true тільки для повністю коректних даних.
    return false;
}
function calculateTotal() {
    // TODO-В: ціна обраної страви × коректна кількість порцій.
    return null;
}
function resetConfirmation() {
    // TODO-В: після зміни даних сховайте попередній успішний підсумок.
    orderSummary.hidden = true;
}
orderForm.addEventListener('input', resetConfirmation);
orderForm.addEventListener('change', resetConfirmation);
orderForm.addEventListener('submit', event => {
    event.preventDefault();
    orderSummary.hidden = true;
    if (!validateOrder())
        return;
    // TODO-В: викличте calculateTotal() і покажіть навчальний підсумок.
    // Повідомлення: «Дані перевірено. Навчальне замовлення сформовано.
    // Замовлення не надіслано».
});
window.CanteenOrder = { selectDish, isValidQuantity };
