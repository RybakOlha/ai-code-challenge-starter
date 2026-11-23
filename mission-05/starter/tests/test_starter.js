const fs = require('node:fs');
const assert = require('node:assert/strict');
const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('js/app.js', 'utf8');
const order = fs.readFileSync('js/order.js', 'utf8');
const tests = [['12 страв із ID', (app.match(/id\s*:\s*['"]dish-\d+['"]/g) || []).length === 12], ['Чотири фільтри', ['searchInput', 'categoryFilter', 'priceFilter', 'vegetarianFilter'].every(x => app.includes(x))], ['Делегування подій', /resultsElement\.addEventListener\(\s*['"]click['"]/.test(app)], ['Кнопка Замовити', /orderButton\.textContent\s*=\s*['"]Замовити['"]/.test(app)], ['Семантична форма', html.includes('<form id="orderForm"')], ['Поля форми', ['studentName', 'studentClass', 'selectedDish', 'quantity', 'comment'].every(x => html.includes('id="' + x + '"'))], ['Обов’язкова самостійна функція', order.includes('function isValidQuantity(value)')], ['Немає реального надсилання', !order.includes('fetch(')], ['Підключено order.js', html.includes('src="js/order.js"')]];
for (const [name, ok] of tests) {
    console.log(ok ? 'PASS' : 'FAIL', name);
    assert.ok(ok, name);
}
console.log(`${tests.length}/${tests.length} структурних перевірок пройдено`);
