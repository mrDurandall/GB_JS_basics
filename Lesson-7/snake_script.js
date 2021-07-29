"use strict";

const settings = {
    rowCount: 15,
    colCount: 15,
    speed: 3,
    winFoodCount: 10,
    foodPrice: 1,        // Новая настройка для хранения стоимости еды в очках
    obstacleNumber: 5,        // Количество препятсвий на поле
};

const config = {
    settings,

    init(userSettings) {
        Object.assign(this.settings, userSettings);
    },

    getRowCount() {
        return this.settings.rowCount;        
    },

    getColCount() {
        return this.settings.colCount;        
    },

    getSpeed() {
        return this.settings.speed;        
    },

    getWinFoodCount() {
        return this.settings.winFoodCount;        
    },

    // Геттер для получения стоимости еды
    getFoodPrice() {
        return this.settings.foodPrice;
    },

    // Получение количества препятсвий
    getObstacleNumber() {
        return this.settings.obstacleNumber;
    },

    validate() {
        const result = {
            isValid: true,
            errors: []
        };

        if (this.getRowCount() < 10 || this.getRowCount() > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки. Значение rowCount должно быть в диапазоне [10, 30].')
        };

        if (this.getColCount() < 10 || this.getColCount() > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки. Значение colCount должно быть в диапазоне [10, 30].')
        };

        if (this.getSpeed() < 1 || this.getSpeed() > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки. Значение speed должно быть в диапазоне [1, 10].')
        };

        if (this.getWinFoodCount() < 10 || this.getWinFoodCount() > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки. Значение winFoodCount должно быть в диапазоне [5, 50].')
        };

        // Проверка адекватности стоимости еды
        if (this.getFoodPrice() < 1 || this.getFoodPrice() > 20) {
            result.isValid = false;
            result.errors.push('Неверные настройки. Значение foodPrice должно быть в диапазоне [1, 20].')
        };

        // Проверка адекватности количества препятсвий
        if (this.getObstacleNumber() < 0 || this.getObstacleNumber() > 10) {
            result.isValid = false;
            result.errors.push('Неверные настройки. Значение obstacleNumber должно быть в диапазоне [0, 10].')
        };

        return result;
    }
};

const map = {
    cells: {},
    usedCells: [],

    init(rowCount, colCount) {
        const table = document.getElementById('game');
        table.innerHTML = '';

        this.cells = {};
        this.usedCells = [];

        for (let row = 0; row < rowCount; row++) {
            const tr = document.createElement('tr');
            tr.classList.add('row');
            table.appendChild(tr);

            for (let col = 0; col < colCount; col++) {
                const td = document.createElement('td');
                td.classList.add('cell');
                tr.appendChild(td);

                this.cells[`x${col}_y${row}`] = td;
            };
        };
    },

    render(snakePointsArray, foodPoint, obstaclePoints) {    // Сюда добавим отрисовку препятсвий
        for (const cell of this.usedCells) {
            cell.className = 'cell';
        };

        this.usedCells = [];

        snakePointsArray.forEach((point, index) => {
            const snakeCells = this.cells[`x${point.x}_y${point.y}`];
            snakeCells.classList.add(index === 0 ? 'snakeHead' : 'snakeBody');
            this.usedCells.push(snakeCells);
        });

        for (const obstaclePoint of obstaclePoints) {
            const obstacleCells = this.cells[`x${obstaclePoint.x}_y${obstaclePoint.y}`];
            obstacleCells.classList.add('obstacle');
            this.usedCells.push(obstacleCells);
        };

        const foodCell = this.cells[`x${foodPoint.x}_y${foodPoint.y}`];
        foodCell.classList.add('food');
        this.usedCells.push(foodCell);
    }
};

const snake = {
    body: [],
    direction: null,
    lastStepDirection: null,

    init(startBody, direction) {
        this.body = startBody;
        this.direction = direction;
        this.lastStepDirection = direction;
    },

    getBody() {
        return this.body;
    },

    getLastStepDirection() {
        return this.lastStepDirection;
    },

    setDirection(direction) {
        this.direction = direction;
    },

    isOnPoint(point) {
        return this.getBody().some((snakePoint) => {
            return snakePoint.x === point.x && snakePoint.y === point.y;
        });
    },

    makeStep(rows, cols) {
        this.lastStepDirection = this.direction;
        this.getBody().unshift(this.getNextStepHeadPoint(rows, cols));
        this.getBody().pop();
    },

    growUp() {
        const lastBodyIdx = this.getBody().length - 1;
        const lastBodyPoint = this.getBody()[lastBodyIdx];
        const lastBodyPointClone = Object.assign({}, lastBodyPoint);
        
        this.getBody().push(lastBodyPointClone);
    },

    getNextStepHeadPoint(rows, cols) {      // сюда дополнительно передаем колчиество строк и колонок
                                            // Чтобы знать, когда переходить на противоположную сторону
        const firstPoint = this.getBody()[0];


        // Введем дополнительные проверки на то, что змейка у края экрана
        switch(this.direction) {
            case 'up':
                return firstPoint.y === 0 ? {x: firstPoint.x, y: rows - 1} : {x: firstPoint.x, y: firstPoint.y - 1};
            case 'right':
                return firstPoint.x === cols - 1 ? {x: 0, y: firstPoint.y} : {x: firstPoint.x + 1, y: firstPoint.y};
            case 'down':
                return firstPoint.y === rows - 1 ? {x: firstPoint.x, y: 0} : {x: firstPoint.x, y: firstPoint.y + 1};
            case 'left':
                return firstPoint.x === 0 ? {x: cols - 1, y: firstPoint.y} : {x: firstPoint.x - 1, y: firstPoint.y};            
        };
    },
};

const food = {
    x: null,
    y: null,

    getCoordinates() {
        return {
            x: this.x,
            y: this.y,
        };
    },

    setCoordinates(point) {
        this.x = point.x;
        this.y = point.y;
    },

    isOnPoint(point) {
        return this.x === point.x && this.y === point.y;
    },
};

// Объект препятствий (на базе объекта food)
const obstacles = {
    
    // Массив с координатами всех препятсвий на карте
    coordinates: [],

    // Получение координат всех препятсвий
    getCoordinates() {
        return this.coordinates;
    },

    // Добавление нового препятсвия
    setNewCoordinate(point) {
        this.coordinates.push({
            x: point.x,
            y: point.y,
        });
    },

    removeCoordinates() {
        this.coordinates = [];
    },

    // Проверка совпадения координат препятсвий с точкой
    isOnPoint(point) {
        // пытался сделать через return this.coordinates.indexOf(point) == -1; , но почему-то не работает.
        for (const coordinate of this.coordinates) {
            if (point.x === coordinate.x && point.y === coordinate.y) {
                return true;
            };
        }
        return false;
    },
};

const status = {
    condition: null,

    setPlaying() {
        this.condition = 'playing';
    },

    setStopped() {
        this.condition = 'stopped';
    },

    setFinished() {
        this.condition = 'finished';
    },

    isPlaying() {
        return this.condition === 'playing';
    },

    isStopped() {
        return this.condition === 'stopped';
    },
};

// Добавим объект счета
const score = {
    points: null, //переменная для хранения счета. При старте равно 0
    scoreField: null,

    init() {
        this.points = 0;
        this.scoreField = document.getElementById('score');
    },

    // метод отрисовки счета
    render() {
        this.scoreField.innerHTML = `Score: ${this.points}`;
    },

    // Добавим метод изменения количества очков. В параметре передаем количество новых очков.
    // Разное количество позволит реализовать разные типы еды или штрафные очки (в данном случае этого функционала не будет)
    scoreUpdate(addPoints) {
        this.points += addPoints;
    },

    // Метод обнуления счета
    setPointsNull() {
        this.points = 0;
    },

    // Метод получения количества очков
    getScore() {
        return this.points;
    },
};

const game = {
    config,
    map,
    snake,
    food,
    status,
    score,        // включаем объект очков
    obstacles,    // включаем объект препятсвий
    tickInterval: null,

    init(userSettings = {}) {
        this.config.init(userSettings);
        this.score.init();
        const validation = this.config.validate();

        if (!validation.isValid) {
          for (const err of validation.errors) {
              console.error(err);
          } 
          return;
        };

        this.map.init(this.config.getRowCount(), this.config.getColCount());
        this.setEventHandlers();
        this.reset();
    },

    setEventHandlers() {
        document.getElementById('playButton').addEventListener('click', () => {
            this.playClickHandler();
        });
        document.getElementById('newGameButton').addEventListener('click', () => {
            this.newGameClickHandler();
        });
        document.addEventListener('keydown', (event) => {this.keyDownHandler(event)})
    },

    playClickHandler() {
        if (this.status.isPlaying()) this.stop();
        else if (this.status.isStopped()) this.play();
    },


    newGameClickHandler(){
        this.reset();
    },

    keyDownHandler() {
        if (!this.status.isPlaying()) return;

        const direction = this.getDirectionByCode(event.code);

        if (this.canSetDirection(direction)) this.snake.setDirection(direction);
    },

    getDirectionByCode(code) {
        switch(code) {
            case 'KeyW':
            case 'ArrowUp':
                return 'up';
            case 'KeyD':
            case 'ArrowRight':
                return 'right';
            case 'KeyS':
            case 'ArrowDown':
                return 'down';
            case 'KeyA':
            case 'ArrowLeft':
                return 'left';                                
        };
    },

    canSetDirection(direction) {
        const lastStepDirection = this.snake.getLastStepDirection();

        return direction === 'up' && lastStepDirection !== 'down' ||
         direction === 'right' && lastStepDirection !== 'left' ||
         direction === 'down' && lastStepDirection !== 'up' ||
         direction === 'left' && lastStepDirection !== 'right';
    },

    reset() {
        this.stop();
        this.snake.init(this.getStartSnakeBody(), 'up');
        this.food.setCoordinates(this.getRandomFreeCoordinates());
        this.score.setPointsNull();         // При рестарте обнуляем счет
        this.getObstacleCoordinates();      // При старте генерируем новые препятствия
        this.render();
    },

    getStartSnakeBody() {
        return [
            {
                x: Math.floor(this.config.getColCount() / 2),
                y: Math.floor(this.config.getRowCount() / 2),
            }
        ];
    },

    getRandomFreeCoordinates() {
        const exclude = [this.food.getCoordinates(), ...this.snake.getBody(), ...this.obstacles.getCoordinates()];  // Добавляем препятсвия

        while (true) {
            const rndPoint = {
                x: Math.floor(Math.random() * this.config.getColCount()),
                y: Math.floor(Math.random() * this.config.getRowCount()),
            }

            if (!exclude.some((exPoint) => exPoint.x === rndPoint.x && exPoint.y === rndPoint.y)) return rndPoint;
        }
    },

    // Заполнение массива координат
    getObstacleCoordinates() {
        this.obstacles.removeCoordinates();
        for (let i = 0; i < this.config.getObstacleNumber(); i++) {
            this.obstacles.setNewCoordinate(this.getRandomFreeCoordinates());
        };
        console.log()
    },

    play() {
        this.status.setPlaying();
        this.tickInterval = setInterval(() => {
            this.tickHandler();
        }, 1000 / this.config.getSpeed());
        this.setPlayButton('Stop');
    },

    stop() {
        this.status.setStopped();
        clearInterval(this.tickInterval);
        this.setPlayButton('Start');
    },

    finish() {
        this.status.setFinished();
        clearInterval(this.tickInterval);
        this.setPlayButton('Game finished', true);
    },

    tickHandler() {
        if (!this.canMakeStep()) return this.finish();

        if (this.food.isOnPoint(this.snake.getNextStepHeadPoint(this.config.getRowCount(), this.config.getColCount()))) {
            this.snake.growUp();
            this.food.setCoordinates(this.getRandomFreeCoordinates());
            this.score.scoreUpdate(this.config.getFoodPrice());    //При съедании еды, увеличиваем колчиество очков на foodPrice

            if (this.isGameWon()) this.finish();
        };

        this.snake.makeStep(this.config.getRowCount(), this.config.getColCount());
        this.render();
    },

    canMakeStep() {
        const nextHeadPoint = this.snake.getNextStepHeadPoint(this.config.getRowCount(), this.config.getColCount());

        return !this.snake.isOnPoint(nextHeadPoint) &&
        // Убираем проверки на край поля
        // nextHeadPoint.x < this.config.getColCount() &&
        // nextHeadPoint.y < this.config.getRowCount() &&
        // nextHeadPoint.x >= 0 &&
        // nextHeadPoint.y >= 0 &&
        !this.obstacles.isOnPoint(nextHeadPoint);       // Добавляем проверку на то, что голова змейки не на препятсвии
    },

    isGameWon() {
        // т.к. теперь мы ведем счет, то условие выигрыша теперь основываем на счете, а не на длине 
        // return this.snake.getBody().length > this.config.getWinFoodCount();
        return this.score.getScore() >= this.config.getWinFoodCount();
    },

    setPlayButton(text, isDisabled = false) {
        const playButton = document.getElementById('playButton');

        playButton.textContent = text;

        isDisabled 
            ? playButton.classList.add('disabled') 
            : playButton.classList.remove('disabled');
    },

    render() {
        this.map.render(this.snake.getBody(), this.food.getCoordinates(), this.obstacles.getCoordinates());
        this.score.render(); // Отрисовываем новый счет
    },

};

game.init();