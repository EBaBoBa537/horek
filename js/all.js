// copy email

function copyEmail(event) {
    let email = event.target.textContent;
    navigator.clipboard.writeText(email).then(() => {
        showMessage('Email скопирован', 'info');
    });
}



// message

function showMessage(text, messageType='info') {
    let messageBox = document.querySelector('.message');
    let span = messageBox.querySelector('span');

    if(messageType == 'error') {
        span.style.border = '1px solid #323232';
        span.style.backgroundColor = ' #f97b74';
        span.style.color = ' #000000';
    } else {
        span.style.border = '1px solid #323232';
        span.style.backgroundColor = ' #d0cdcd';
        span.style.color = ' #000000';
    }

    span.textContent = text;
    messageBox.classList.add('show');

    // Показать на 1 секунду + 0.4с на вход + 0.4с на выход
    setTimeout(() => {
        messageBox.classList.remove('show');
    }, 1800);
}



// load data from .json

async function loadDataFromJSONtoLocalStorage() {
    try {
        const backpacksData   = await fetch('../materials/data/backpacks.json');
        const backpacksJSON   = await backpacksData.json();
        const backpacks = backpacksJSON.backpacks;

        localStorage.setItem('backpacks', JSON.stringify(backpacks));

        // Данные для settings

        let min_cost = Infinity;
        let max_cost = -Infinity;
        for (let i = 0; i < backpacks.length; i++) {
            const cost = parseFloat(backpacks[i].cost);
            if (cost < min_cost) { min_cost = cost; }
            if (cost > max_cost) { max_cost = cost; }
        }

        const features_set = new Set();
        const diagonals_set = new Set();
        const materials_set = new Set();

        for (const backpack of backpacks) {
            if (backpack.features) {
                backpack.features.split(',').forEach(featureList => {
                    const feature = featureList.trim();
                    features_set.add(feature);
                });
            }
            if (backpack.diagonal) {
                const diagonal = backpack.diagonal.trim();
                diagonals_set.add(diagonal);
            }
            if (backpack.material) {
                const material = backpack.material.trim();
                materials_set.add(material);
            }
        }

        const cart = {};
        localStorage.setItem('cart', JSON.stringify(cart));

        const favorites = [];
        localStorage.setItem('favorites', JSON.stringify(favorites));

        const settings = {
            min_cost,
            max_cost,
            features_list: Array.from(features_set).join(', '),
            diagonal_list: Array.from(diagonals_set).join(', '),
            material_list: Array.from(materials_set).join(', '),
        };

        // Сохраняем settings в localStorage
        localStorage.setItem('settings', JSON.stringify(settings));

        // Тема сайта

        const theme_value = 'light';
        const default_theme = {
            theme: theme_value
        };
        localStorage.setItem('theme', JSON.stringify(default_theme));

    } catch (error) {
        console.error('Ошибка при загрузке данных из JSON в localStorage: ', error);
    }
}

// localStorage.clear();

if(localStorage.length == 0) { 
    loadDataFromJSONtoLocalStorage(); 
    console.log('ДАННЫЕ ИЗ JSON ЗАГРУЖЕНЫ');
}


// Выводим содержимое localStorage
console.log('LocalStorage содержит:');
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = JSON.parse(localStorage.getItem(key));
    console.log(`${key}:`, value);
}



// Установка и смена темы

const theme = JSON.parse(localStorage.getItem('theme')) || {"theme": "light"}; 
document.body.classList.add(theme.theme);

const theme_button_1 = document.getElementById('button-theme-1');
const theme_button_2 = document.getElementById('button-theme-2');

function changeTheme() {
    const old_theme = JSON.parse(localStorage.getItem('theme')); 
    let new_theme_value = '';
    if (old_theme.theme == 'light') {
        document.body.classList.remove('light');
        new_theme_value = 'dark';
    } else if (old_theme.theme == 'dark') {
        document.body.classList.remove('dark');
        new_theme_value = 'light';
    }
    const new_theme = {
        theme: new_theme_value
    };
    localStorage.removeItem('theme');
    localStorage.setItem('theme', JSON.stringify(new_theme));
    document.body.classList.add(new_theme.theme);
}

theme_button_1.addEventListener('click', function() { changeTheme(); });
theme_button_2.addEventListener('click', function() { changeTheme(); });



// burger-menu в хедере

document.addEventListener('DOMContentLoaded', function() {
    const burger_menu_button = document.getElementById('burger-menu');
    const burger_menu = document.getElementById('burger-menu-block');

    // Открытие/закрытие по кнопке
    burger_menu_button.addEventListener('click', function(e) {
        e.stopPropagation(); // чтобы не сработал клик вне
        if (burger_menu.style.display === 'flex') { 
            burger_menu.style.display = 'none'; 
            burger_menu.querySelector('span').display = 'none';
            burger_menu.querySelectorAll('span a').forEach (a => { a.style.display = 'none'; })
        } 
        else { 
            burger_menu.style.display = 'flex' ;
            burger_menu.querySelector('span').display = 'inline';
            burger_menu.querySelectorAll('span a').forEach (a => { a.style.display = 'inline'; })
        }
    });

    // Закрытие по клику вне меню
    document.addEventListener('click', function(e) {
        if (!burger_menu.contains(e.target) && !burger_menu_button.contains(e.target)) {
            burger_menu.style.display = 'none';
        }
    });

    // Закрытие по клику на ссылку
    burger_menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            burger_menu.style.display = 'none';
        });
    });
});





/* AAAAAAAAAAAa */




// Валидация input[type='tel']

function InputTel(input) {
    let value = input.value;

    value = value.replace(/[^0-9+ ]/g, '');

    input.value = value;
}

// Валидация input[type='email']

function InputEmail(input) {
    let value = input.value;

    // Разбиваем строку по символу '@'
    let parts = value.split('@');
    // Если '@' больше одного, оставляем только первую часть и одну '@' с остальной строкой
    if (parts.length > 2) {
        value = parts[0] + '@' + parts.slice(1).join('');
    }

    input.value = value;
}






// Функция для задания Input Number Double количества знаков после запятой
function InputNumberSetPrecision(input, precision) {
    let value = input.value;

    // Проверка, есть ли точка и более одного числа после неё
    const parts = value.split('.');
    if (parts.length === 2 && parts[1].length > precision) {
        // Обрезаем часть после точки до указанной точности
        parts[1] = parts[1].slice(0, precision);
        value = parts.join('.');
    }

    // Обновляем значение input
    input.value = value;
}



// Функция валидации значения Input Number Double при любом изменении
function InputNumberDouble(input) {
    let value = input.value;

    // Получаем значения min и max
    const min = parseFloat(input.getAttribute('min'));
    const max = parseFloat(input.getAttribute('max'));

    // Удаляем все недопустимые символы, оставляя только цифры, точку и минус
    value = value.replace(/[^0-9.,-]/g, '').replace(',', '.');

    // Если число начинается с нескольких минусов, оставляем только один в начале
    value = value.replace(/^-+/g, '-').replace(/(?!^)-/g, '');
    // Если min >= 0, не оставляем ни одного минуса
    if (min >= 0) {
        value = value.replace(/-/g, '');
    }

    // Ограничиваем точку только одной в числе
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }

    // Если число начинается с точки, добавляем перед ней '0'
    if (value.startsWith('.')) {
        value = '0' + value;
    }

    // Если начинается с '-0', после '-0' можно ввести только точку
    if (value.startsWith('-0') && value.length > 2 && value[2] !== '.') {
        value = '-0.' + value.slice(2).replace('.', '');
    }

    // Если начинается с '0', после '0' можно ввести только точку
    if (value.startsWith('0') && value.length > 1 && value[1] !== '.') {
        value = '0.' + value.slice(1).replace('.', '');
    }

    // Проверка, будет ли значение input в пределах min и max
    const numericValue = parseFloat(value);

    if (value === '' || (!isNaN(numericValue) && (isNaN(min) || numericValue >= min) && (isNaN(max) || numericValue <= max)) || value === '-') {
        // Если значение пустое или в пределах min и max, обновляем input и сохраняем предыдущее значение в data-атрибуте
        input.setAttribute('data-previous-value', value);
    } else {
        // Если значение выходит за пределы, откатываем к предыдущему значению из data-атрибута
        input.value = input.getAttribute('data-previous-value') || '';
        return;
    }

    // Обновляем input на новое корректное значение
    input.value = value;
}



// Функция валидации значения Input Number Integer при любом изменении
function InputNumberInteger(input) {
    let value = input.value;

    // Получаем значения min и max
    const min = parseFloat(input.getAttribute('min'));
    const max = parseFloat(input.getAttribute('max'));

    // Удаляем все недопустимые символы, оставляя только цифры и минус
    value = value.replace(/[^0-9-]/g, '');

    // Если число начинается с нескольких минусов, оставляем только один в начале
    value = value.replace(/^-+/g, '-').replace(/(?!^)-/g, '');
    // Если min >= 0, не оставляем ни одного минуса
    if (min >= 0) {
        value = value.replace(/-/g, '');
    }

    // Если начинается с '-0', после '-0' ничего ввести больше нельзя
    if (value.startsWith('-0') && value.length > 2) {
        value = '-0';
    }

    // Если начинается с '0', после '0' ничего ввести больше нельзя
    if (value.startsWith('0') && value.length > 1) {
        value = '0';
    }

    // Проверка, будет ли значение input в пределах min и max
    const numericValue = parseFloat(value);

    if (value === '' || (!isNaN(numericValue) && (isNaN(min) || numericValue >= min) && (isNaN(max) || numericValue <= max)) || value === '-') {
        // Если значение пустое или в пределах min и max, обновляем input и сохраняем предыдущее значение в data-атрибуте
        input.setAttribute('data-previous-value', value);
    } else {
        // Если значение выходит за пределы, откатываем к предыдущему значению из data-атрибута
        input.value = input.getAttribute('data-previous-value') || '';
        return;
    }

    // Обновляем input на новое корректное значение
    input.value = value;
}
