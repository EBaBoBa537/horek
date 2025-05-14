const backpacks = JSON.parse(localStorage.getItem('backpacks')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || {};
if (typeof cart !== 'object' || Array.isArray(cart)) cart = {};

const cartContainer = document.querySelector('.backpacks-list');
const orderButton = document.querySelector('.button-order');

function renderCart() {
    cartContainer.innerHTML = '';

    const cartBackpacks = backpacks.filter(b => cart.hasOwnProperty(b.id));
    if (cartBackpacks.length === 0) {
        cartContainer.innerHTML = '<p class="empty-message">Корзина пуста.</p>';
        return;
    }

    cartBackpacks.forEach(backpack => {
        const quantity = cart[backpack.id];
        const maxQuantity = backpack.is_available;
        const costPerUnit = parseFloat(backpack.cost);
        const totalCost = (costPerUnit * quantity).toFixed(2);

        const div = document.createElement('div');
        div.classList.add('cart-product');
        div.innerHTML = `
            <a href='product.html?id=${backpack.id}' class="image-block">
                <img src="materials/images/backpacks/${backpack.id}-1.png" alt="${backpack.name}">
            </a>
            <span class="name-container">
                <h4>${backpack.name}</h4>
                <span>
                    <span class="color">${backpack.colors}</span>
                    <button class="button-delete-from-cart" data-id="${backpack.id}">Удалить</button>
                </span>
            </span>
            <span class="cost-container">
                <span>
                    <button class="button-minus-num" data-id="${backpack.id}">-</button>
                    <span class="num" data-id="${backpack.id}">${quantity}</span>
                    <button class="button-plus-num" data-id="${backpack.id}">+</button>
                </span>
                <span class="cost" data-id="${backpack.id}">${totalCost} р.</span>
            </span>
        `;

        // Удаление из корзины
        div.querySelector('.button-delete-from-cart').addEventListener('click', e => {
            const id = +e.currentTarget.dataset.id;
            delete cart[id];
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            updateOrderSummary();
        });

        // Увеличение количества
        div.querySelector('.button-plus-num').addEventListener('click', e => {
            const id = +e.currentTarget.dataset.id;
            if (cart[id] < maxQuantity) {
                cart[id] += 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            } else {
                showMessage(`Максимум на складе: ${maxQuantity}`, 'warning');
            }
            updateOrderSummary();
        });

        // Уменьшение количества
        div.querySelector('.button-minus-num').addEventListener('click', e => {
            const id = +e.currentTarget.dataset.id;
            if (cart[id] > 1) {
                cart[id] -= 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            } else {
                delete cart[id];
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            }
            updateOrderSummary();
        });

        cartContainer.appendChild(div);
    });
    updateOrderSummary();
}


function updateOrderSummary() {
    let totalQuantity = 0;
    let totalCost = 0;

    for (const id in cart) {
        const quantity = cart[id];
        const backpack = backpacks.find(b => b.id == id);
        if (!backpack) continue;

        totalQuantity += quantity;
        totalCost += quantity * parseFloat(backpack.cost);
    }

    document.querySelector('.order-panel .products-num').textContent = `Товаров: ${totalQuantity}`;
    document.querySelector('.order-panel .all-cost').textContent = `Итого: ${totalCost.toFixed(2)} р.`;
}


// Кнопка "Оформить заказ"
orderButton.addEventListener('click', () => {
    cart = {};
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    showMessage('Заказ оформлен! Спасибо!', 'success');
    updateOrderSummary();
});

// Кнопка "Удалить все из корзины"
document.querySelector('.button-clear-cart').addEventListener('click', () => {
    cart = {};
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    showMessage('Корзина очищена', 'success');
    updateOrderSummary();
});


renderCart();
updateOrderSummary();
