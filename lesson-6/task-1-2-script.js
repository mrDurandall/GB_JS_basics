"use strict";

// Создание и заполнение корзины тестовыми данными.

var shoppingCart = {
    // массив list хранит список товаров
    // Товары должны быть представлены объекстами со свойствами id, name, price, quantity
    list: [],

    // Подсчет стоимости товаров в корзине
    countBasketPrice: function() {
        let summPrice = 0;
        for (let product in this.list) {
            summPrice += this.list[product].price * this.list[product].quantity;
        }
        console.log(`Суммарная стоимость товаров в корзине: ${summPrice}`)
        return summPrice
    },

    // Подсчет общего количества товаров в корзине
    numberOfItems: function() {
        let number = 0;
        for (let product in this.list) {
            number += this.list[product].quantity;
        }
        return number;
    },

    // Добавление товара в корзину
    addToBasket: function(newid, newname, newprice) {
        let notInBasket = true;
        for (let product in this.list) {
            if (newid == this.list[product].id) {
                this.list[product].quantity++;
                notInBasket = false;
                break;
            };
        };
        if (notInBasket) {
            this.list.push({
                id: newid,
                name: newname,
                price: newprice,
                quantity: 1
            })
        };
    },

    cleanBasket: function() {
        this.list = [];
    }
};

shoppingCart.addToBasket(1, 'apple', 30);
shoppingCart.addToBasket(1, 'apple', 30);
shoppingCart.addToBasket(2, 'banana', 40);
shoppingCart.addToBasket(2, 'banana', 40);
shoppingCart.addToBasket(2, 'banana', 40);
shoppingCart.addToBasket(3, 'orange', 50);
console.log(shoppingCart);

// Создание и заполнение каталога
var Product = {
    // массив list хранит список товаров
    // Товары должны быть представлены объекстами со свойствами id, name, price
    list: []
}

Product.list.push({
    id: 1,
    name: 'apple',
    price: 30,
})

Product.list.push({
    id: 2,
    name: 'banana',
    price: 50,
})

Product.list.push({
    id: 3,
    name: 'orange',
    price: 70,
})

// функция отрисовки корзины.
function basketDraw() {

    basket.innerHTML = '';

    var basketHeader = document.createElement('h1');
    basketHeader.innerHTML = 'Содержимое корзины:'
    basket.appendChild(basketHeader);
    
    var basketContent = document.createElement('div');
    if (shoppingCart.numberOfItems() == 0) {
        basketContent.innerHTML = 'Корзина пуста!';
    } else {
        for (let product in shoppingCart.list) {
            var position = document.createElement('div');
            position.className = 'product';
            basket.appendChild(position);
    
            var productName = document.createElement('div');
            productName.className = 'product_name';
            productName.innerHTML = '<p>' + shoppingCart.list[product].name + '</p>';
            position.appendChild(productName);
    
            var productPrice = document.createElement('div');
            productPrice.className = 'product_price';
            productPrice.innerHTML = '<p>' + shoppingCart.list[product].price + '</p>';
            position.appendChild(productPrice);
    
            var productQuantity = document.createElement('div');
            productQuantity.className = 'product_price';
            productQuantity.innerHTML = '<p>' + shoppingCart.list[product].quantity + '</p>';
            position.appendChild(productQuantity);
        };

        basketContent.innerHTML = 'В корзине ' + shoppingCart.numberOfItems() + ' товаров на сумму ' + shoppingCart.countBasketPrice();
    };
    
    basket.appendChild(basketContent);

    var cleanCart = document.createElement('button');
    cleanCart.className = 'clean_button';
    cleanCart.innerHTML = '<p>Очистить корзину</p>';
    cleanCart.id = 'cleanButton';
    basket.appendChild(cleanCart);
}

// функция отрисовки каталога.
function catalogDraw() {

    var catalogHeader = document.createElement('h1');
    catalogHeader.innerHTML = 'Каталог товаров:';
    catalog.appendChild(catalogHeader);

    for (let product in Product.list) {
        var position = document.createElement('div');
        position.className = 'product';
        catalog.appendChild(position);

        var productName = document.createElement('div');
        productName.className = 'product_name';
        productName.innerHTML = '<p>' + Product.list[product].name + '</p>';
        position.appendChild(productName);

        var bigImage = document.createElement('img');
        bigImage.src = './images/big/' + Product.list[product].id + '-' + 1 + '.jpg';
        bigImage.className = 'big_image';
        bigImage.id = 'bigImage_' + Product.list[product].id;
        productName.appendChild(bigImage);

        for (let i = 1; i < 4; i++) {
        var catalogImage = document.createElement('img');
        catalogImage.src = './images/small/' + Product.list[product].id + '-' + i + '.jpg';
        catalogImage.className = 'small_image';
        catalogImage.id = 'smallImage_' + Product.list[product].id + '_' + i;
        productName.appendChild(catalogImage);
        };

        var productPrice = document.createElement('div');
        productPrice.className = 'product_price';
        productPrice.innerHTML = '<p>' + Product.list[product].price + '</p>';
        position.appendChild(productPrice);

        var productBuy = document.createElement('button');
        productBuy.className = 'product_buy';
        productBuy.innerHTML = '<p>Купить</p>';
        productBuy.id = 'byuButton_' + Product.list[product].id
        position.appendChild(productBuy);
    };

};

// функция отрисовки страницы
function init() {

    basketDraw();

    catalogDraw();

    var buttons = document.getElementsByClassName('product_buy');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].onclick = addToCart;
    };

    var cleanButton = document.getElementById('cleanButton');
    cleanButton.onclick = clean;

    var small_images = document.getElementsByClassName('small_image');
    for (let i = 0; i < small_images.length; i++) {
        small_images[i].onclick = changeBigPicture;
    }

    function addToCart() {
        var eventElement = this;
        var productId = eventElement.id.split("_")[1];
        console.log(eventElement.id);
        var alredyInBasket = false;
        for (let i = 0; i < shoppingCart.list.length; i++) {
            if (productId == shoppingCart.list[i].id) {
                var productName = shoppingCart.list[i].name;
                var productPrice = shoppingCart.list[i].price;
                alredyInBasket = true;
                break;
            };
        };
        if (!alredyInBasket) {
            var productName = Product.list[productId - 1].name;
            var productPrice = Product.list[productId - 1].price;
        }
        shoppingCart.addToBasket(productId, productName, productPrice);
        basketDraw();
        console.log(shoppingCart);
        var cleanButton = document.getElementById('cleanButton');
        cleanButton.onclick = clean;
    };

    //функция очистки корзины и отрисовки ее заново
    function clean() {
    shoppingCart.cleanBasket();
    console.log(shoppingCart);
    basketDraw();
    var cleanButton = document.getElementById('cleanButton');
    cleanButton.onclick = clean;
    };

    function changeBigPicture() {
        var idElements = this.id.split('_');
        var productNumber = idElements[1];
        var pictureNumber = idElements[2];
        console.log(pictureNumber);
        var bigPicture = document.getElementById('bigImage_' + productNumber);
        bigPicture.src = './images/big/' + productNumber + '-' + pictureNumber + '.jpg';
    };

};

window.onload = init;