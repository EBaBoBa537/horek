document.addEventListener("DOMContentLoaded", function () {

    // Загрузка данных о рюкзаке 
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    if (typeof cart !== 'object' || Array.isArray(cart)) cart = {};
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!Array.isArray(favorites)) favorites = [];

    // Убедимся, что все значения — числа
    favorites = favorites.map(Number);

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const backpacks = JSON.parse(localStorage.getItem('backpacks')); 
    const item = backpacks.find(b => b.id === id);

    if (!item) {
        document.body.innerHTML = '<p>Товар не найден.</p>';
        return;
    }

    const availabilityEl = document.querySelector('.product-panel .how-many-available');
    const addToCartBtn = document.querySelector('.product-panel .add-to-cart');

    if (parseInt(item.is_available, 10) > 0) {
        availabilityEl.classList.add('yes');
    } else {
        availabilityEl.classList.add('no');
        addToCartBtn.setAttribute('disabled', 'true');
    }

    let favorite_image_path = 'materials/images/favourites.svg';
    if (Array.isArray(favorites) && favorites.includes(Number(item.id))) {
        favorite_image_path = 'materials/images/favourites-colored.svg';
    }
    document.querySelector('.product-panel .add-to-favorite').style.backgroundImage = `url('${favorite_image_path}')`;



    function toggleFavorite(id) {
        id = Number(id);
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

    // Обработчик для кнопки В избранное
    document.querySelector('.product-panel .add-to-favorite').addEventListener('click', e => {
        toggleFavorite(item.id);
        const newPath = favorites.includes(item.id) ? 'materials/images/favourites-colored.svg' : 'materials/images/favourites.svg';
        e.currentTarget.style.backgroundImage = `url('${newPath}')`;
    });


    // Обработчик на кнопку В корзину
    document.querySelector('.product-panel .add-to-cart').addEventListener('click', e => {
        if (cart[item.id]) {
            cart[item.id] += 1;
        } else {
            cart[item.id] = 1;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        showMessage('Добавлен в корзину', 'info');
    });




    document.querySelector('.product-panel h4').textContent = item.name;
    document.querySelector('.how-many-available').textContent = `В наличии ${item.is_available} шт.`;
    document.querySelector('.product-panel .price').textContent = `${parseFloat(item.cost).toFixed(2)} р.`;
    document.querySelector('.characteristic .articul').textContent = item.id;
    document.querySelector('.characteristic .category').textContent = item.category;
    document.querySelector('.characteristic .color').textContent = item.colors;
    document.querySelector('.characteristic .material').textContent = item.material;
    document.querySelector('.characteristic .size').textContent = item.size.split('-').map(n => n + ' см').join(' × ');
    document.querySelector('.characteristic .volume').textContent = item.volume + ' л';
    document.querySelector('.characteristic .straps-num').textContent = item.straps_num;
    document.querySelector('.characteristic .features').textContent = item.features ? item.features : 'нет';
    document.querySelector('.characteristic .section-num').textContent = item.section_num;
    document.querySelector('.characteristic .pocket-num').textContent = item.pocket_num;
    document.querySelector('.characteristic .diagonal').textContent = item.diagonal ? item.diagonal + '"' : 'нет';

    const different_colors_container = document.querySelector('.different-colors-container');
    if (item.different_colors) {
        item.different_colors.split(',').map(s => s.trim()).forEach(otherId => {
            const a = document.createElement('a');
            a.href = `product.html?id=${otherId}`;
            a.classList.add('different-color');
            const img = document.createElement('img');
            img.src = `materials/images/backpacks/${otherId}-1.png`;
            a.appendChild(img);
            different_colors_container.appendChild(a);
        });
    }

    const pictures = document.querySelector('.pictures');
    const slider_container = document.querySelector('.slider-container');
    let slides_all = [];
    let slider_current_index = 0;
    const slider_button_prev = document.querySelector('#button-slider-prev');
    const slider_button_next = document.querySelector('#button-slider-next');

    async function loadImages() {
        let idx = 1;
        const picture_buttons = [];
        while (true) {
            const url = `materials/images/backpacks/${id}-${idx}.png`;
            try {
                const res = await fetch(url, { method: 'HEAD' });
                if (!res.ok) break;
            } catch {
                break;
            }
            // pictures
            const button = document.createElement('button'); 
            button.classList.add('picture');
            const img_picture = document.createElement('img'); 
            img_picture.src = url;
            button.appendChild(img_picture);
            pictures.appendChild(button);
            picture_buttons.push(button);
            // slides
            const slide = document.createElement('div'); 
            slide.classList.add('slide');
            const img_slide = document.createElement('img'); 
            img_slide.src = url;
            slide.appendChild(img_slide);
            slider_container.appendChild(slide);

            idx++;
        }

        slides_all = document.querySelectorAll('.slide');

        // Навешиваем обработчики на миниатюры
        picture_buttons.forEach((button, index) => {
            button.addEventListener('click', function() {
                slider_current_index = index;
                updateSlider();
            });
        });

        updateSlider();
    };

    
    // слайдер

    function updateSlider() {
        slider_container.style.transform = 'translateX(-' + (slider_current_index * 100) + '%)';
    }

    slider_button_next.addEventListener('click', function () {
        slider_current_index = (slider_current_index + 1) % slides_all.length;
        updateSlider();
    });

    slider_button_prev.addEventListener('click', function () {
        slider_current_index = (slider_current_index - 1 + slides_all.length) % slides_all.length;
        updateSlider();
    });

    loadImages();


});