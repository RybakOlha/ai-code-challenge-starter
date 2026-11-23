// Запуск: node tests/test_filters.js (з папки NextLab_Mission04_Teacher)
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const code = fs.readFileSync('js/app.js', 'utf8');
const listeners = {};
const element = () => ({ disabled: false, value: '', checked: false, hidden: false, textContent: '', className: '', setAttribute() { }, replaceChildren() { }, append() { }, addEventListener(name, cb) { (listeners[name] ??= []).push(cb); } });
const nodes = new Map();
const sandbox = { document: { getElementById(id) { if (!nodes.has(id))
            nodes.set(id, element()); return nodes.get(id); }, createElement() { return element(); } }, setTimeout, Promise, Error };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const evaluate = (filters) => vm.runInContext(`filterDishes(DEMO_MENU, ${JSON.stringify(filters)}).map(d=>d.name).join('|')`, sandbox).split('|').filter(Boolean);
const tests = [
    ['усі страви', {}, 12],
    ['пошук', { search: 'суп' }, 2],
    ['регістр і пробіли', { search: ' СУП ' }, 2],
    ['категорія', { category: 'Гарнір' }, 2],
    ['ціна до 30', { maxPrice: '30' }, 4],
    ['вегетаріанські', { vegetarianOnly: true }, 8],
    ['категорія + вегетаріанські', { category: 'Перша страва', vegetarianOnly: true }, 1],
    ['пошук + ціна + вегетаріанські', { search: 'суп', maxPrice: '50', vegetarianOnly: true }, 1],
    ['конфліктні умови', { search: 'суп', category: 'Салат' }, 0],
    ['порожній пошук', { search: '   ' }, 12],
    ['ціна включно', { maxPrice: '28' }, 3],
    ['усі 4 фільтри', { search: 'суп', category: 'Перша страва', maxPrice: '50', vegetarianOnly: true }, 1]
];
let passed = 0;
for (const [name, filter, count] of tests) {
    try {
        const result = evaluate(filter);
        assert.equal(result.length, count);
        if (name === 'усі 4 фільтри')
            assert.deepEqual(result, ['Суп овочевий']);
        console.log('PASS', name);
        passed++;
    }
    catch (e) {
        console.error('FAIL', name, e.message);
        process.exitCode = 1;
    }
}
console.log(`${passed}/${tests.length} перевірок пройдено`);
