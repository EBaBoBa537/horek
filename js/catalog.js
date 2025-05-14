// загрузка backpacks 

const backpacks = JSON.parse(localStorage.getItem('backpacks')); 
const backpacksContainer = document.querySelector('.backpacks-list');
let cart = JSON.parse(localStorage.getItem('cart')) || {};
if (typeof cart !== 'object' || Array.isArray(cart)) cart = {};
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
if (!Array.isArray(favorites)) favorites = [];

let catalog = backpacks;


function toggleFavorite(id) {
    const index = favorites.indexOf(id);
    if (index !== -1) {
        favorites.splice(index, 1);
        showMessage('Удален из избранного', 'info');
    } else {
        favorites.push(id);
        showMessage('Добавлен в ибранное', 'info');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}


function displayBackpacks() {
    backpacksContainer.innerHTML = '';
    catalog.forEach(backpack => {
        let is_available = backpack.is_available > 0 ? 'yes' : 'no';
        let is_available_text  = backpack.is_available > 0 ? 'В наличии' : 'Нет в наличии';
        
        let button_to_cart_disable = '';
        if (backpack.is_available == "0") { button_to_cart_disable = 'disabled'; }

        let favorite_image_path = 'materials/images/favourites.svg';
        if (Array.isArray(favorites) && favorites.includes(Number(backpack.id))) {
            favorite_image_path = 'materials/images/favourites-colored.svg';
        }


        const div = document.createElement('div');
        div.classList.add('backpack');
        div.innerHTML = `
            <span class="over-to-favorites">
                <button class="button-to-favorite" data-id="${backpack.id}" style="background-image: url('${favorite_image_path}');"></button>
            </span>
            <a href="product.html?id=${backpack.id}" class="image-block">
                <img src="materials/images/backpacks/${backpack.id}-1.png" alt="${backpack.name}">
            </a>
            <a href="product.html?id=${backpack.id}" class="name">${backpack.name}</a>
            <span>
                <span class="price">${parseFloat(backpack.cost).toFixed(2)} р.</span>
                <span class="is-available ${is_available}">${is_available_text}</span> 
            </span>
            <button class="button-add-to-cart" data-id="${backpack.id}" ${button_to_cart_disable}>В корзину</button>
        `;


        // Обработчик для кнопки В избранное
        div.querySelector('.button-to-favorite').addEventListener('click', e => {
            const id = +e.currentTarget.dataset.id;
            toggleFavorite(id);
            const newPath = favorites.includes(id) ? 'materials/images/favourites-colored.svg' : 'materials/images/favourites.svg';
            e.currentTarget.style.backgroundImage = `url('${newPath}')`;
        });


        // Обработчик на кнопку В корзину
        div.querySelector('.button-add-to-cart').addEventListener('click', e => {
            // Можно хранить не только id, но и количество
            const id = +e.currentTarget.dataset.id;
            if (cart[id]) {
                cart[id] += 1;
            } else {
                cart[id] = 1;
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            showMessage('Добавлен в корзину', 'info');
        });

        backpacksContainer.appendChild(div);
    });

    document.querySelector('.right-part .founded').textContent = `Найдено ${catalog.length} шт. товаров`;
}

displayBackpacks();
populateFiltersFromSettings();




// Подгрузка особенностей, материалов и диагоналей из settings


function populateFiltersFromSettings() {
    const settings = JSON.parse(localStorage.getItem('settings'));
    if (!settings) return;

    const features = settings.features_list.split(',').map(f => f.trim()).filter(f => f);
    const diagonals = settings.diagonal_list.split(',').map(d => d.trim()).filter(d => d);
    const materials = settings.material_list.split(',').map(m => m.trim()).filter(m => m);

    const featuresContainer = document.querySelector('.features-list');
    const diagonalSelect = document.querySelector('#select-diagonal');
    const materialsContainer = document.querySelector('.materials-list');

    if (featuresContainer) {
        featuresContainer.innerHTML = createCheckboxHTML('feature', features);
    }

    if (diagonalSelect) {
        diagonalSelect.innerHTML = createSelectOptionsHTML(diagonals);
    }

    if (materialsContainer) {
        materialsContainer.innerHTML = createCheckboxHTML('material', materials);
    }
}

function createCheckboxHTML(namePrefix, values) {
    return values.map((value, index) => `
        <span class="over-checkbox">
            <input type="checkbox" id="${namePrefix}-${index + 1}" name="${namePrefix}-${index + 1}" value="${value}">
            <label for="${namePrefix}-${index + 1}">${value}</label>
        </span>
    `).join('');
}

function createSelectOptionsHTML(values) {
    return ['<option value="none">не выбрано</option>'].concat(
        values.map(value => `<option value="${value}">${value}"</option>`)
    ).join('');
}





const select_category = document.getElementById('select-category');
const money_range_min = document.getElementById('range-money-min');
const money_range_max = document.getElementById('range-money-max');
const color_checkboxes_list = document.querySelectorAll('.color-buttons input[type=checkbox]');
const radio_height = document.getElementById('radio-height-or-volume-one');
const radio_volume = document.getElementById('radio-height-or-volume-two');
const input_height_min = document.getElementById('input-from-height');
const input_height_max = document.getElementById('input-to-height');
const input_volume_min = document.getElementById('input-from-volume');
const input_volume_max = document.getElementById('input-to-volume');
const feature_checkboxes_list = document.querySelectorAll('.features-list input[type=checkbox]');
const select_diagonal = document.getElementById('select-diagonal');
const material_checkboxes_list = document.querySelectorAll('.materials-list input[type=checkbox]');
const radio_strap_1 = document.getElementById('radio-straps-one');
const radio_strap_2 = document.getElementById('radio-straps-two');
const input_section_min = document.getElementById('input-from-section');
const input_section_max = document.getElementById('input-to-section');
const input_pocket_min = document.getElementById('input-from-pocket');
const input_pocket_max = document.getElementById('input-to-pocket');
const checkbox_is_available = document.getElementById('is-available');

const select_sort = document.getElementById('select-sort');

const settings = JSON.parse(localStorage.getItem('settings')); 

money_range_min.min = settings.min_cost;
money_range_min.max = settings.max_cost;
money_range_min.value = settings.min_cost;
money_range_max.min = settings.min_cost;
money_range_max.max = settings.max_cost;
money_range_max.value = settings.max_cost;


// catalog


let filters = {
    category: null,
    cost_from: null,
    cost_to: null,
    colors: [],
    height_from: null,
    height_to: null,
    volume_from: null,
    volume_to: null,
    features: [],
    diagonal: null,
    materials: [],
    straps_num: null,
    section_from: null,
    section_to: null,
    pocket_from: null,
    pocket_to: null,
    available: null
};

let sortKey = 'new'; // new / low-price / high-price / available


// Обновление параметров фильтрации и сортировки 

const button_apply = document.getElementById('button-apply-filter-params');
const button_reset = document.getElementById('button-reset-filter-params');


// Категория
select_category.addEventListener('change', function() {
    if(select_category.value === 'all') { filters.category = null; } 
    else { filters.category = select_category.value; }
});


// Диапазон цен
const money_span_from = document.querySelector('.money-range-from');
const money_span_to = document.querySelector('.money-range-to');
let track = document.querySelector('.range-track');

function updatetrack() {
    let min = parseFloat(money_range_min.value);
    let max = parseFloat(money_range_max.value);
    let percentMin = (min / money_range_min.max) * 100;
    let percentMax = (max / money_range_max.max) * 100;
    track.style.background = `linear-gradient(to right, #cacaca ${percentMin}%, #424242 ${percentMin}%, #424242 ${percentMax}%, #cacaca ${percentMax}%)`;
    money_span_from.textContent = min.toFixed(2);
    money_span_to.textContent = max.toFixed(2);
}

money_range_min.addEventListener('input', function() {
    if (parseFloat(money_range_max.value) - parseFloat(money_range_min.value) <= 0) {
        money_range_min.value = parseFloat(money_range_max.value);
    }
    filters.cost_from = parseFloat(money_range_min.value);
    updatetrack();
});
money_range_max.addEventListener('input', function() {
    if (parseFloat(money_range_max.value) - parseFloat(money_range_min.value) <= 0) {
        money_range_max.value = parseFloat(money_range_min.value);
    }
    filters.cost_to = parseFloat(money_range_max.value);
    updatetrack();
});

updatetrack();


// Цвета
let color_list = [];

function changeColorList(checked, color) {
    if (checked) {
        if (!color_list.includes(color)) {
            color_list.push(color);
        }
    } else {
        color_list = color_list.filter(c => c !== color);
    }
}

color_checkboxes_list.forEach (checkbox => {
    checkbox.addEventListener('change', function () {
        changeColorList(checkbox.checked, checkbox.className);
        filters.colors = color_list;
    });
})


// Переключатель высота/объём
const height_parameters = document.querySelector(".buttons-from-to.from-to-height");
const volume_parameters = document.querySelector(".buttons-from-to.from-to-volume");

radio_height.addEventListener('change', function() {
    if(radio_height.checked) {
        height_parameters.style.display = 'flex'
        volume_parameters.style.display = 'none'
    }
});
radio_volume.addEventListener('change', function() {
    if(radio_volume.checked) {
        height_parameters.style.display = 'none'
        volume_parameters.style.display = 'flex'
    }
});

radio_height.checked = 'true';
height_parameters.style.display = 'flex'
volume_parameters.style.display = 'none'

input_height_min.addEventListener('input', function() {
    if(input_height_min.value == null) { filters.height_from = null; } 
    else { filters.height_from = parseInt(input_height_min.value); }
})
input_height_max.addEventListener('input', function() {
    if(input_height_max.value == null) { filters.height_to = null; } 
    else { filters.height_to = parseInt(input_height_max.value); }
})
input_volume_min.addEventListener('input', function() {
    if(input_volume_min.value == null) { filters.volume_from = null; } 
    else { filters.volume_from = parseInt(input_volume_min.value); }
})
input_volume_max.addEventListener('input', function() {
    if(input_volume_max.value == null) { filters.volume_to = null; } 
    else { filters.volume_to = parseInt(input_volume_max.value); }
})




// Особенности
feature_checkboxes_list.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const feature = document.querySelector(`label[for="${checkbox.id}"]`).textContent.trim();
        if (checkbox.checked) {
            if (!filters.features.includes(feature)) { filters.features.push(feature) };
        } else {
            filters.features = filters.features.filter(f => f !== feature);
        }
    });
});

// Диагональ
select_diagonal.addEventListener('change', function() {
    if(select_diagonal.value === 'none') { filters.diagonal = null; } 
    else { filters.diagonal = select_diagonal.value; }
});

// Материалы
material_checkboxes_list.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const material = document.querySelector(`label[for="${checkbox.id}"]`).textContent.trim();
        if (checkbox.checked) {
            if (!filters.materials.includes(material)) { filters.materials.push(material) };
        } else {
            filters.materials = filters.materials.filter(m => m !== material);
        }
    });
});

// Количество лямок
radio_strap_1.addEventListener('change', function() {
    if(radio_strap_1.checked) { filters.straps_num = 1; }
});
radio_strap_2.addEventListener('change', function() {
    if(radio_strap_2.checked) { filters.straps_num = 2; }
});

// Количество отделений
input_section_min.addEventListener('input', function() {
    if(input_section_min.value == null) { filters.section_from = null; } 
    else { filters.section_from = parseInt(input_section_min.value); }
})
input_section_max.addEventListener('input', function() {
    if(input_section_max.value == null) { filters.section_to = null; } 
    else { filters.section_to = parseInt(input_section_max.value); }
})

// Количество карманов
input_pocket_min.addEventListener('input', function() {
    if(input_pocket_min.value == null) { filters.pocket_from = null; } 
    else { filters.pocket_from = parseInt(input_pocket_min.value); }
})
input_pocket_max.addEventListener('input', function() {
    if(input_pocket_max.value == null) { filters.pocket_to = null; } 
    else { filters.pocket_to = parseInt(input_pocket_max.value); }
})

// Есть в наличии
checkbox_is_available.addEventListener('change', function() {
    filters.available = checkbox_is_available.checked;
});



// Кнопка Сбросить

button_reset.addEventListener('click', function() {
    select_category.value = 'all';
    money_range_min.value = money_range_min.min; 
    money_range_max.value = money_range_max.max;
    updatetrack();
    color_checkboxes_list.forEach(checkbox => { checkbox.checked = false; });
    radio_height.checked = true;
    radio_volume.checked = false;
    height_parameters.style.display = 'flex';
    volume_parameters.style.display = 'none';
    input_height_min.value = '';
    input_height_max.value = '';
    input_volume_min.value = '';
    input_volume_max.value = '';
    feature_checkboxes_list.forEach(checkbox => { checkbox.checked = false; });
    select_diagonal.value = 'none';
    material_checkboxes_list.forEach(checkbox => { checkbox.checked = false; });
    radio_strap_1.checked = false;
    radio_strap_2.checked = false;
    input_section_min.value = '';
    input_section_max.value = '';
    input_pocket_min.value = '';
    input_pocket_max.value = '';
    checkbox_is_available.checked = false;

    for (let key in filters) {
        if (Array.isArray(filters[key])) { filters[key] = []; } 
        else { filters[key] = null; }
    }
    filters.costMin = parseFloat(money_range_min.value);
    filters.costMax = parseFloat(money_range_max.value);
    
    updateCatalog();
});


// Кнопка Применить

button_apply.addEventListener('click', function() {
    updateCatalog();

    console.log(typeof filters.available, filters.available);
});


// Сортировка
select_sort.addEventListener('change', function() {
    sortKey = select_sort.value;
    updateCatalogBySort();
});

// filter

function applyFilters(data, filters) {
    return data.filter(item => {
        const cost   = parseFloat(item.cost) || 0;
        const height = parseInt(item.size.split('-')[0],10) || 0;
        const vol    = parseInt(item.volume,10) || 0;
        const feats  = item.features ? item.features.split(',').map(s=>s.trim()) : [];

        // 1. Категория
        if (filters.category && item.category !== filters.category) return false;
        // 2. Цена
        if (filters.cost_from !== null && cost < filters.cost_from) return false;
        if (filters.cost_to !== null && cost > filters.cost_to) return false;
        // 3. Цвета (массив)
        if (filters.colors.length && !filters.colors.includes(item.color_category)) return false;
        // 4. Высота
        if (filters.height_from !== null && height < filters.height_from) return false;
        if (filters.height_to !== null && height > filters.height_to) return false;
        // 5. Объём
        if (filters.volume_from !== null && vol < filters.volume_from) return false;
        if (filters.volume_to !== null && vol > filters.volume_to) return false;
        // 6. Особенности (массив)
        if (filters.features.length && !filters.features.every(feat => feats.includes(feat))) return false;
        // 7. Диагональ
        if (filters.diagonal && item.diagonal !== filters.diagonal) return false;
        // 8. Материалы (массив)
        if (filters.materials.length && !filters.materials.includes(item.material)) return false;
        // 9. Лямки
        if (filters.straps_num && parseInt(item.straps_num,10) !== filters.straps_num) return false;
        // 10. Отделения
        if (filters.section_from !== null && parseInt(item.section_num,10) < filters.section_from) return false;
        if (filters.section_to !== null && parseInt(item.section_num,10) > filters.section_to) return false;
        // 11. Карманы
        if (filters.pocket_from !== null && parseInt(item.pocket_num,10) < filters.pocket_from) return false;
        if (filters.pocket_to !== null && parseInt(item.pocket_num,10) > filters.pocket_to) return false;
        // 12. В наличии
        if (filters.available === true && parseInt(item.is_available, 10) <= 0) { return false; }

        return true;
    });
}




// sort
function applySort(data, key) {
    const array = data.slice();
    switch(key) {
        case 'low-price':
            return array.sort((a,b) => parseFloat(a.cost) - parseFloat(b.cost)); 
        case 'high-price':
            return array.sort((a,b) => parseFloat(b.cost) - parseFloat(a.cost)); 
        case 'available':
            return array.sort((a,b) => parseInt(b.is_available) - parseInt(a.is_available)); 
        case 'new':
        default:
            return array.sort((a,b) => parseInt(a.id) - parseInt(b.id)); ;
    }
}

// update

function updateCatalog() {
    catalog = backpacks;
    const filtered = applyFilters(catalog, filters);
    catalog = applySort(filtered, sortKey);
    displayBackpacks(catalog);
}
function updateCatalogByFilters() {
    catalog = backpacks;
    catalog = applyFilters(catalog, filters);
    displayBackpacks(catalog);
}
function updateCatalogBySort() {
    catalog = applySort(catalog, sortKey);
    displayBackpacks(catalog);
}



