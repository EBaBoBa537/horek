// Загрузка данных
const backpacks = JSON.parse(localStorage.getItem('backpacks')) || []; 
const backpacksContainer = document.querySelector('.backpacks-list');
let cart = JSON.parse(localStorage.getItem('cart')) || {};
if (typeof cart !== 'object' || Array.isArray(cart)) cart = {};
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
if (!Array.isArray(favorites)) favorites = [];


// Удаление/добавление в избранное
function toggleFavorite(id) {
    const index = favorites.indexOf(id);
    if (index !== -1) {
        favorites.splice(index, 1);
        showMessage('Удален из избранного', 'info');
    } else {
        favorites.push(id);
        showMessage('Добавлен в избранное', 'info');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}


// Вывод только избранных рюкзаков
function displayFavorites() {
    backpacksContainer.innerHTML = '';
    
    // Фильтруем рюкзаки по favorites
    const favoriteBackpacks = backpacks.filter(backpack => favorites.includes(Number(backpack.id)));

    if (favoriteBackpacks.length === 0) {
        backpacksContainer.innerHTML = '<p class="empty-message">Избранное пусто.</p>';
        return;
    }

    favoriteBackpacks.forEach(backpack => {
        let is_available = backpack.is_available > 0 ? 'yes' : 'no';
        let is_available_text = backpack.is_available > 0 ? 'В наличии' : 'Нет в наличии';
        let favorite_image_path = 'materials/images/favourites-colored.svg';

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
            <button class="button-add-to-cart" data-id="${backpack.id}">В корзину</button>
        `;

        // Кнопка "удалить из избранного"
        div.querySelector('.button-to-favorite').addEventListener('click', e => {
            const id = +e.currentTarget.dataset.id;
            toggleFavorite(id);
            div.remove(); // удаляем карточку с DOM
            if (favorites.length === 0) {
                backpacksContainer.innerHTML = '<p class="empty-message">Избранное пусто.</p>';
            }
        });

        // Кнопка "в корзину"
        div.querySelector('.button-add-to-cart').addEventListener('click', e => {
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
}



// Кнопка "Удалить все из избранного"
document.querySelector('.button-clear-favourites').addEventListener('click', () => {
    favorites = [];
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
    showMessage('Избранные удалены', 'success');
});



displayFavorites();

