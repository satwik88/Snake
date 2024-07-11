const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const canvasSize = 400;
canvas.width = canvasSize;
canvas.height = canvasSize;

let snake = [{ x: gridSize * 5, y: gridSize * 5 }];
let direction = { x: 0, y: 0 };
let food = { x: gridSize * 10, y: gridSize * 10 };
let score = 0;
let gameStarted = false;

document.addEventListener('keydown', changeDirection);

function gameLoop() {
    if (isGameOver()) {
        alert('Game Over! Your score: ' + score);
        resetGame();
        return;
    }

    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();

    setTimeout(gameLoop, 100);
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function drawGrid() {
    ctx.strokeStyle = '#ccc';
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}


function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach((part, index) => {
        if (index === 0) {
            ctx.fillStyle = 'black'; // Head color
            ctx.fillRect(part.x, part.y, gridSize, gridSize);
            ctx.fillStyle = 'green'; // Reset for body
        } else {
            ctx.fillRect(part.x, part.y, gridSize, gridSize);
        }
    });
}

function moveSnake() {
    if (direction.x === 0 && direction.y === 0) return;

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
    } else {
        snake.pop();
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = direction.y === -gridSize;
    const goingDown = direction.y === gridSize;
    const goingRight = direction.x === gridSize;
    const goingLeft = direction.x === -gridSize;

    if (keyPressed === LEFT && !goingRight) {
        direction = { x: -gridSize, y: 0 };
        gameStarted = true;
    }

    if (keyPressed === UP && !goingDown) {
        direction = { x: 0, y: -gridSize };
        gameStarted = true;
    }

    if (keyPressed === RIGHT && !goingLeft) {
        direction = { x: gridSize, y: 0 };
        gameStarted = true;
    }

    if (keyPressed === DOWN && !goingUp) {
        direction = { x: 0, y: gridSize };
        gameStarted = true;
    }
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function placeFood() {
    food.x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
}

function isGameOver() {
    const head = snake[0];
    const hitLeftWall = head.x < 0;
    const hitRightWall = head.x >= canvasSize;
    const hitTopWall = head.y < 0;
    const hitBottomWall = head.y >= canvasSize;

    let hitSelf = false;
    for (let i = 4; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            hitSelf = true;
            break;
        }
    }

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall || hitSelf;
}

function resetGame() {
    snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    direction = { x: 0, y: 0 };
    placeFood();
    score = 0;
    gameStarted = false;
}

gameLoop();
