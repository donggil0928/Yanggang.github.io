let gameState = {
    days: 0,
    lastCleaned: 0,
    feedsToday: 0,
    size: 50
};

const jellyfish = document.getElementById('jellyfish');
const feedButton = document.getElementById('feed-button');
const cleanButton = document.getElementById('clean-button');
const daysSpan = document.getElementById('days');
const lastCleanedSpan = document.getElementById('last-cleaned');
const feedsTodaySpan = document.getElementById('feeds-today');
const container = document.getElementById('game-container');
const food = document.getElementById('food');

function loadGameState() {
    const savedState = localStorage.getItem('jellyfishGameState');
    if (savedState) {
        gameState = JSON.parse(savedState);
        updateDisplay();
    }
}

function saveGameState() {
    localStorage.setItem('jellyfishGameState', JSON.stringify(gameState));
}

function updateDisplay() {
    jellyfish.style.width = `${gameState.size}px`;
    jellyfish.style.height = `${gameState.size}px`;
    daysSpan.textContent = gameState.days;
    lastCleanedSpan.textContent = gameState.lastCleaned;
    feedsTodaySpan.textContent = gameState.feedsToday;

    moveJellyfish();
}

function moveJellyfish() {
    const maxX = container.clientWidth - gameState.size;
    const maxY = container.clientHeight - gameState.size;
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    jellyfish.style.left = `${newX}px`;
    jellyfish.style.top = `${newY}px`;
}

function feedJellyfish() {
    gameState.feedsToday++;
    gameState.size += 0.1;

// Drop food and move jellyfish to food location
    dropFood();
    setTimeout(() => {
        moveJellyfishToFood();
        setTimeout(() => {
            food.style.display = 'none';
            createHeart(jellyfish);
            saveGameState();
            updateDisplay();
        }, 3000);
    }, 3000);
}

function dropFood() {
    const maxX = container.clientWidth - 10;
    const foodX = (container.clientWidth - 10) / 2; // 어항 중앙에 위치

    food.style.left = `${foodX}px`;
    food.style.top = '0px';
    food.style.display = 'block';

    food.animate([
        { top: '0px' },
        { top: `${container.clientHeight / 2 - 5}px` } // 어항 중앙으로 떨어지게 설정
    ], {
        duration: 1000,
        fill: 'forwards'
    });
}

function moveJellyfishToFood() {
    const foodX = parseFloat(food.style.left);
    const foodY = parseFloat(food.style.top) + (container.clientHeight / 2 - 5);

    jellyfish.style.transition = 'all 2s ease';
    jellyfish.style.left = `${foodX}px`;
    jellyfish.style.top = `${foodY}px`;

    jellyfish.addEventListener('transitionend', () => {
        jellyfish.style.transition = ''; // Reset transition
    }, { once: true });
}

function cleanTank() {
    if (gameState.days - gameState.lastCleaned >= 3) {
        gameState.lastCleaned = gameState.days;
        saveGameState();
        updateDisplay();
        alert('어항을 깨끗하게 청소했어요!');
    } else {
        alert('아직 청소할 때가 되지 않았어요.');
    }
}

function createHeart(element) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'heart';
    heart.style.left = `${parseFloat(element.style.left) + gameState.size / 2}px`;
    heart.style.top = `${parseFloat(element.style.top)}px`;
    container.appendChild(하트);
    setTimeout(() => container.removeChild(하트), 2000);
}

function dailyReset() {
    gameState.days++;
    saveGameState();
}

loadGameState();
feedButton.addEventListener('click', feedJellyfish);
cleanButton.addEventListener('click', cleanTank);
jellyfish.addEventListener('click', () => createHeart(jellyfish));

setInterval(dailyReset, 24 * 60 * 60 * 1000);
setInterval(moveJellyfish, 10000);

updateDisplay();
