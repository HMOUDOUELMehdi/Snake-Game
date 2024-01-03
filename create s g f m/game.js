const board = document.querySelector(".board");
const cadre = document.querySelector(".cadre");
const score = document.querySelector(".score");
const level = document.querySelector(".level");
const speed = document.querySelector(".speed");

let foodX, foodY;
let snake = { X: 23, Y: 18 };
let directionX = 0,
    directionY = 0;
let snakeBody = [];
let gameover = false;
let scoreE = 0;
let levelE = 1;
let lastRenderTime = 0;
let snakeSpeed = 10;
let lossCount = 0;
let gameOverCalled = false; // Track if gameOver function has been called

function changeFoodPosition() {
    foodX = Math.floor(Math.random() * 45) + 1;
    foodY = Math.floor(Math.random() * 35) + 1;
}

function moveSnake(e) {
    if (e.key === 'ArrowUp' && directionY != 1) {
        directionX = 0;
        directionY = -1;
    } else if (e.key === 'ArrowDown' && directionY != -1) {
        directionX = 0;
        directionY = 1;
    } else if (e.key === 'ArrowLeft' && directionX != 1) {
        directionX = -1;
        directionY = 0;
    } else if (e.key === 'ArrowRight' && directionX != -1) {
        directionX = 1;
        directionY = 0;
    }

    GameAll();
}

function gameOver() {
    if (!gameOverCalled) {
        gameOverCalled = true;
        const replay = confirm("Oh no! You lost the game. 😢\nClick OK to replay and conquer the snake world! 🐍");

        if (replay) {
            lossCount++;
            if (lossCount === 2) {
                alert("You lost again! Maybe try a different strategy?");
                // Perform additional action for the second loss
            }
            window.location.reload();
        }
    }
}

function GameAll(currentTime) {
    window.requestAnimationFrame(GameAll);
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / snakeSpeed) return;
    lastRenderTime = currentTime;

    if (gameover) return gameOver();

    let htmlMark = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if (snake.X == foodX && snake.Y == foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        scoreE++;
    }

    score.innerText = `score : ${scoreE}`;
    level.innerText = `level : ${levelE}`;
    speed.innerText = `speed : ${snakeSpeed}`;

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    if (snake.X <= 0 || snake.X > 46 || snake.Y <= 0 || snake.Y > 36) {
        gameover = true;
    }

    snake.X += directionX;
    snake.Y += directionY;

    snakeBody[0] = [snake.X, snake.Y];

    for (let i = 0; i < snakeBody.length; i++) {
        htmlMark += `<div class="snake" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameover = true;
        }
    }

    switch (scoreE) {
        case 2:
            levelE = 2;
            snakeSpeed = 15;
            break;
        case 10:
            levelE = 3;
            snakeSpeed = 20;
            break;
        case 15:
            levelE = 4;
            snakeSpeed = 25;
            break;
        case 20:
            levelE = 5;
            snakeSpeed = 30;
            break;
        case 25:
            snakeSpeed = 35;
            levelE = "last level";
            break;
    }

    board.innerHTML = htmlMark;
}

changeFoodPosition();
document.addEventListener("keydown", moveSnake);
window.requestAnimationFrame(GameAll);
