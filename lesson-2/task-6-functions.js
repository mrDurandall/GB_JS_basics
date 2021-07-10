// Сложение
function addition(num1, num2) {
    return num1 + num2;
}

// Умножение
function multiplication(num1, num2) {
    return num1 * num2;
}

// Вычитание
function subtraction(num1, num2) {
    return num1 - num2;
}

// Деление
function division(num1, num2) {
    return num1 / num2
}

// Функция математической операции
function mathOperation(num1, num2, operation) {
    operation = operation.toLowerCase(); //На всякий случай приведем значение переменной operation в нижний регистр
    // Это необходимо для корректного сравнения на случай, если название операции введено с большой буквы или полностью в верхнем регистре

    // Последовательно сравним значение аргумента operation c названиями математических операций
    // Названия операций возьмем на русском и английском языках.
    switch(operation) {
        case 'сложение':
        case 'addition':
        return addition(num1, num2);
        break;

        case 'вычитание':
        case 'subtraction':
        return subtraction(num1, num2);
        break;

        case 'умножение':
        case 'multiplication':
        return multiplication(num1, num2);
        break;

        case 'division':
        case 'деление':
        return division(num1, num2);
        break;
    }
}