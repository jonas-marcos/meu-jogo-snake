// Variáveis do Jogo
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startButton'); 
const restartButton = document.getElementById('restartButton');
const leaderboardButton = document.getElementById('showLeaderboardButton');
const leaderboard = document.getElementById('leaderboard');
const endGameModal = document.getElementById('endGameModal');
const restartGameButton = document.getElementById('restartGameButton');
const cancelGameButton = document.getElementById('cancelGameButton');
const endGameMessage = document.getElementById('endGameMessage');

let snake;
let food;
let direction;
let score;
let playerName;
let gameInterval;
let leaderboardData = [];

// posição inicial da cobra e o tamanho
const snakeSize = 20;
const canvasSize = 400;
const maxWidth = canvasSize / snakeSize;
const maxHeight = canvasSize / snakeSize;

function startGame() {
    snake = [
        { x: Math.floor(maxWidth / 2), y: Math.floor(maxHeight / 2) }
    ];
    food = generateFood();
    direction = 'RIGHT';
    score = 0;
    updateScore();
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
}

function gameLoop() {
    moveSnake();
    if (checkCollisions()) {
        endGame();
        return;
    }
    if (checkFoodCollision()) {
        score += 10;
        updateScore();
        snake.push({});
        food = generateFood();
    }
    draw();
}

function moveSnake() {
    let head = { ...snake[0] };

    switch (direction) {
        case 'UP':
            head.y--;
            break;
        case 'DOWN':
            head.y++;
            break;
        case 'LEFT':
            head.x--;
            break;
        case 'RIGHT':
            head.x++;
            break;
    }

    snake.unshift(head);
    snake.pop();
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    // cobra
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * snakeSize, segment.y * snakeSize, snakeSize, snakeSize);
    });
    // alimento
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * snakeSize, food.y * snakeSize, snakeSize, snakeSize);
}

function checkCollisions() {
    const head = snake[0];

    if (head.x < 0 || head.x >= maxWidth || head.y < 0 || head.y >= maxHeight) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

function checkFoodCollision() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
}

function generateFood() {
    const x = Math.floor(Math.random() * maxWidth);
    const y = Math.floor(Math.random() * maxHeight);
    return { x, y };
}

function updateScore() {
    scoreElement.textContent = `Pontuação: ${score}`;
}

function endGame() {
    clearInterval(gameInterval);
    endGameMessage.textContent = `${playerName}, sua pontuação foi: ${score}`;
    endGameModal.style.display = 'flex';

    leaderboardData.push({ name: playerName, score: score });
    leaderboardData.sort((a, b) => b.score - a.score);
    updateLeaderboard();

    restartGameButton.style.display = 'inline-block'; // botão "Jogar Novamente"
}

function updateLeaderboard() {
    leaderboard.innerHTML = '<h3>Ranking</h3>';
    leaderboardData.forEach(player => {
        const playerElement = document.createElement('div');
        playerElement.textContent = `${player.name}: ${player.score}`;
        leaderboard.appendChild(playerElement);
    });
}

function restartGame() {
    endGameModal.style.display = 'none';
    askPlayerName();
    startButton.style.display = 'none'; 
    restartGameButton.style.display = 'none';
}

function cancelGame() {
    endGameModal.style.display = 'none';
    startButton.style.display = 'block'; 
    restartGameButton.style.display = 'none'; 
}


document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction !== 'DOWN') {
        direction = 'UP';
    }
    if (e.key === 'ArrowDown' && direction !== 'UP') {
        direction = 'DOWN';
    }
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') {
        direction = 'LEFT';
    }
    if (e.key === 'ArrowRight' && direction !== 'LEFT') {
        direction = 'RIGHT';
    }
});

// ranking
leaderboardButton.addEventListener('click', () => {
    leaderboard.style.display = leaderboard.style.display === 'none' ? 'block' : 'none';
});

// reiniciar o jogo
restartGameButton.addEventListener('click', () => {
    restartGame();
});

cancelGameButton.addEventListener('click', () => {
    cancelGame();
});

startButton.addEventListener('click', () => {
    askPlayerName();
    startButton.style.display = 'none'; 
});

function askPlayerName() {
    playerName = prompt('Qual é o seu nome?');
    if (playerName) {
        startGame();
    } else {
        alert('O nome é obrigatório para iniciar o jogo!');
        askPlayerName();
    }
}

startButton.style.display = 'block'; 
