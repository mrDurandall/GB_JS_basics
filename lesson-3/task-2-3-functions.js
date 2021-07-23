// Создадим функцию для ручного добавления товара в корзину. В качестве аргумента передаем ей название массива для хранения товаров:
function addProduct (cart) {
    var product = {
        name: '',
        price: 0
    }
    product.name = prompt('Введите название товара:')
    product.price = Number(prompt('Введите цену товара:'))
    cart.push(product);
}

// Создадим функцию для подсчета суммарной цены товаров в корзине. В качестве аргумента передаем ей название массива для хранения товаров:
function countBasketPrice (cart) {
    let summPrice = 0;
    for (product in cart) {
        summPrice += cart[product].price;
    }
    return summPrice
}
