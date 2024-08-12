const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

// Array of food image URLs
const foodImages = [
  'dogs/food1.png',
  'dogs/food2.png',
  'dogs/food3.png',
  'dogs/food4.png',
  'dogs/food5.png',
  'dogs/food6.png',
  'dogs/food7.png',
  'dogs/food8.png',
  'dogs/food9.png',
  'dogs/food10.png'
];

let gameOver = false;
let foodX, foodY, foodImage;
let snakeX = 5, snakeY = 10;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

let gridRows = 30;  // Default grid size
let gridCols = 30;

const updateGridSize = () => {
  const width = window.innerWidth;

  if (width <= 480) {
    gridRows = 40;
  } else if (width <= 768) {
    gridRows = 35;
  } else {
    gridRows = 30;
  }

  playBoard.style.gridTemplate = `repeat(${gridRows}, 1fr) / repeat(${gridCols}, 1fr)`;
};

const changeFoodPosition = () => {
  foodX = Math.floor(Math.random() * gridCols) + 1;
  foodY = Math.floor(Math.random() * gridRows) + 1;
  // Randomly select a food image
  const randomIndex = Math.floor(Math.random() * foodImages.length);
  foodImage = foodImages[randomIndex];
};

const handleGameOver = () => {
  clearInterval(setIntervalId);
  alert("Oi mama abar morish na pls!\nOK chap diya moyla porishkar kor 🐸");
  location.reload();
};

const changeDirection = (e) => {
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

// Function to check if the snake is within the range of the food
const isSnakeCloseToFood = (snakeX, snakeY, foodX, foodY, range) => {
  return Math.abs(snakeX - foodX) <= range && Math.abs(snakeY - foodY) <= range;
};

const initGame = () => {
  if (gameOver) return handleGameOver();
  
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}; background-image: url('${foodImage}');"></div>`;

  const foodRange = 1;
  if (isSnakeCloseToFood(snakeX, snakeY, foodX, foodY, foodRange)) {
    changeFoodPosition();
    snakeBody.push([foodX, foodY]);
    score++;

    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = [...snakeBody[i - 1]];
  }

  snakeBody[0] = [snakeX, snakeY];

  snakeX += velocityX;
  snakeY += velocityY;

  if (snakeX <= 0 || snakeX > gridCols || snakeY <= 0 || snakeY > gridRows) {
    gameOver = true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
      gameOver = true;
    }
  }

  playBoard.innerHTML = htmlMarkup;
};

// Touch and mouse control variables
let startX = 0;
let startY = 0;

const handleStart = (x, y) => {
  startX = x;
  startY = y;
};

const handleMove = (x, y) => {
  const diffX = x - startX;
  const diffY = y - startY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Horizontal swipe or mouse drag
    if (diffX > 0 && velocityX != -1) {
      velocityX = 1;
      velocityY = 0;
    } else if (diffX < 0 && velocityX != 1) {
      velocityX = -1;
      velocityY = 0;
    }
  } else {
    // Vertical swipe or mouse drag
    if (diffY > 0 && velocityY != -1) {
      velocityX = 0;
      velocityY = 1;
    } else if (diffY < 0 && velocityY != 1) {
      velocityX = 0;
      velocityY = -1;
    }
  }
};

// Add touch event listeners
document.addEventListener("touchstart", (e) => {
  startMusic();
  handleStart(e.touches[0].clientX, e.touches[0].clientY);
});
document.addEventListener("touchmove", (e) => handleMove(e.touches[0].clientX, e.touches[0].clientY));

// Add mouse event listeners
document.addEventListener("mousedown", (e) => {
  startMusic();
  handleStart(e.clientX, e.clientY);
});
document.addEventListener("mousemove", (e) => {
  if (e.buttons === 1) { // Only track movement if the mouse button is pressed
    handleMove(e.clientX, e.clientY);
  }
});

// Flag to check if the music has started
let musicStarted = false;

// Function to start the music
const startMusic = () => {
    if (!musicStarted) {
        backgroundMusic.play().catch(error => {
            console.log("Audio play error:", error);
        });
        musicStarted = true;
    }
};

// Add keyboard event listener
document.addEventListener("keydown", (e) => {
    startMusic();
    changeDirection(e);
});

// Reference the audio element
const backgroundMusic = document.getElementById("backgroundMusic");
backgroundMusic.volume = .7;

// Add event listener for page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        backgroundMusic.pause();
    } else {
        backgroundMusic.play().catch(error => {
            console.log("Audio play error:", error);
        });
    }
});

window.addEventListener("resize", updateGridSize);

updateGridSize();
changeFoodPosition();
setIntervalId = setInterval(initGame, 100);
