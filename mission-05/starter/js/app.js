'use strict';
// Місія 04 — стартовий каркас. Дані та ціни умовні.
const DEMO_MENU = [
    { id: 'dish-01', name: 'Борщ український', category: 'Перша страва', description: '250 мл', price: 38, vegetarian: false, emoji: '🥣' },
    { id: 'dish-02', name: 'Суп овочевий', category: 'Перша страва', description: '250 мл', price: 34, vegetarian: true, emoji: '🍲' },
    { id: 'dish-03', name: 'Суп курячий', category: 'Перша страва', description: '250 мл', price: 46, vegetarian: false, emoji: '🥣' },
    { id: 'dish-04', name: 'Котлета куряча', category: 'Основна страва', description: '120 г', price: 65, vegetarian: false, emoji: '🍗' },
    { id: 'dish-05', name: 'Омлет', category: 'Основна страва', description: '150 г', price: 44, vegetarian: true, emoji: '🍳' },
    { id: 'dish-06', name: 'Рис з овочами', category: 'Основна страва', description: '180 г', price: 52, vegetarian: true, emoji: '🍚' },
    { id: 'dish-07', name: 'Картопляне пюре', category: 'Гарнір', description: '180 г', price: 32, vegetarian: true, emoji: '🥔' },
    { id: 'dish-08', name: 'Гречка', category: 'Гарнір', description: '180 г', price: 28, vegetarian: true, emoji: '🌾' },
    { id: 'dish-09', name: 'Салат овочевий', category: 'Салат', description: '120 г', price: 29, vegetarian: true, emoji: '🥗' },
    { id: 'dish-10', name: 'Салат з куркою', category: 'Салат', description: '140 г', price: 58, vegetarian: false, emoji: '🥗' },
    { id: 'dish-11', name: 'Компот ягідний', category: 'Напій', description: '200 мл', price: 18, vegetarian: true, emoji: '🫐' },
    { id: 'dish-12', name: 'Чай', category: 'Напій', description: '200 мл', price: 12, vegetarian: true, emoji: '🍵' }
];
const loadButton = document.getElementById('loadMenuBtn');
const errorButton = document.getElementById('errorBtn');
const statusElement = document.getElementById('menuStatus');
const resultsElement = document.getElementById('menuResults');
const errorElement = document.getElementById('menuError');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const vegetarianFilter = document.getElementById('vegetarianFilter');
const resetButton = document.getElementById('resetFiltersBtn');
const resultCount = document.getElementById('resultCount');
const controls = [searchInput, categoryFilter, priceFilter, vegetarianFilter, resetButton];
let isLoading = false;
let loadedMenu = [];
function fetchMenuDemo(shouldFail = false) {
    return new Promise((resolve, reject) => setTimeout(() => shouldFail ? reject(new Error('Демонстраційна помилка отримання меню.')) : resolve(DEMO_MENU), 1500));
}
function renderMenu(items) {
    resultsElement.replaceChildren();
    for (const item of items) {
        const article = document.createElement('article');
        article.className = 'dish';
        const emoji = document.createElement('span');
        emoji.className = 'dish-emoji';
        emoji.setAttribute('aria-hidden', 'true');
        emoji.textContent = item.emoji;
        const heading = document.createElement('h3');
        heading.textContent = item.name;
        const description = document.createElement('p');
        description.textContent = item.description;
        const price = document.createElement('span');
        price.className = 'dish-price';
        price.textContent = `${item.price} грн`;
        const orderButton = document.createElement('button');
        orderButton.type = 'button';
        orderButton.className = 'button button-primary order-trigger';
        orderButton.textContent = 'Замовити';
        orderButton.dataset.dishId = item.id;
        article.append(emoji, heading, description, price, orderButton);
        resultsElement.append(article);
    }
    if (items.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'За обраними умовами страв не знайдено.';
        resultsElement.append(p);
    }
    resultCount.textContent = `Знайдено ${items.length} із ${loadedMenu.length} страв.`;
}
function filterDishes(items, { search = '', category = 'all', maxPrice = 'all', vegetarianOnly = false } = {}) {
    const query = String(search).trim().toLocaleLowerCase('uk-UA');
    const limit = maxPrice === 'all' ? Infinity : Number(maxPrice);
    return items.filter(item => item.name.toLocaleLowerCase('uk-UA').includes(query) &&
        (category === 'all' || item.category === category) &&
        item.price <= limit &&
        (!vegetarianOnly || item.vegetarian === true));
}
function applyFilters() {
    const filtered = filterDishes(loadedMenu, {
        search: searchInput.value,
        category: categoryFilter.value,
        maxPrice: priceFilter.value,
        vegetarianOnly: vegetarianFilter.checked
    });
    renderMenu(filtered);
}
async function loadMenu(shouldFail = false) {
    if (isLoading)
        return;
    isLoading = true;
    loadButton.disabled = true;
    errorButton.disabled = true;
    controls.forEach(el => el.disabled = true);
    resultsElement.setAttribute('aria-busy', 'true');
    errorElement.hidden = true;
    statusElement.className = 'status loading';
    statusElement.textContent = 'Завантажуємо меню…';
    try {
        loadedMenu = await fetchMenuDemo(shouldFail);
        controls.forEach(el => el.disabled = false);
        applyFilters();
        statusElement.className = 'status';
        statusElement.textContent = `Готово! Завантажено ${loadedMenu.length} страв.`;
    }
    catch (error) {
        loadedMenu = [];
        resultsElement.replaceChildren();
        errorElement.hidden = false;
        resultCount.textContent = 'Меню недоступне.';
        statusElement.className = 'status error';
        statusElement.textContent = error instanceof Error ? error.message : 'Невідома помилка.';
    }
    finally {
        isLoading = false;
        loadButton.disabled = false;
        errorButton.disabled = false;
        resultsElement.setAttribute('aria-busy', 'false');
    }
}
searchInput.addEventListener('input', applyFilters);
categoryFilter.addEventListener('change', applyFilters);
priceFilter.addEventListener('change', applyFilters);
vegetarianFilter.addEventListener('change', applyFilters);
resetButton.addEventListener('click', () => {
    searchInput.value = '';
    categoryFilter.value = 'all';
    priceFilter.value = 'all';
    vegetarianFilter.checked = false;
    applyFilters();
});
loadButton.addEventListener('click', () => loadMenu(false));
errorButton.addEventListener('click', () => loadMenu(true));
// Місія 05: делегування події з динамічних карток.
resultsElement.addEventListener('click', (event) => {
    const button = event.target.closest?.('button[data-dish-id]');
    if (!button || !resultsElement.contains(button))
        return;
    const dish = loadedMenu.find(item => item.id === button.dataset.dishId);
    if (dish && window.CanteenOrder)
        window.CanteenOrder.selectDish(dish);
});
