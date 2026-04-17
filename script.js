const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const levelEl = document.getElementById('level');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayMessage = document.getElementById('overlay-message');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const restartBtn = document.getElementById('restart-btn');

// Grid config
const COLS = 20;
const ROWS = 20;
const CELL = canvas.width / COLS; // 20px per cell

// Game state
let snake, direction, nextDirection, food, score, highScore, level;
let gameLoop = null;
let state = 'idle'; // idle | running | paused | over

// Load high score from localStorage
highScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
highScoreEl.textContent = highScore;

// ─── Initialization ────────────────────────────────────────────────────────

function initGame() {
  // Snake starts in the middle facing right, length 3
  const startX = Math.floor(COLS / 2);
  const startY = Math.floor(ROWS / 2);
  snake = [
    { x: startX, y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  level = 1;
  scoreEl.textContent = score;
  levelEl.textContent = level;
  spawnFood();
}

function getSpeed() {
  // Base 150ms, decreases by 10ms per level, min 60ms
  return Math.max(60, 150 - (level - 1) * 10);
}

// ─── Food ──────────────────────────────────────────────────────────────────

function spawnFood() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  food = pos;
}

// ─── Game Loop ─────────────────────────────────────────────────────────────

function startLoop() {
  if (gameLoop) clearInterval(gameLoop);
  gameLoop = setInterval(tick, getSpeed());
}

function tick() {
  direction = { ...nextDirection };

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  // Wall collision
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    endGame();
    return;
  }

  // Self collision (skip tail tip since it will move)
  if (snake.slice(0, -1).some(s => s.x === head.x && s.y === head.y)) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;

    // Level up every 50 points
    const newLevel = Math.floor(score / 50) + 1;
    if (newLevel !== level) {
      level = newLevel;
      levelEl.textContent = level;
      // Restart loop at new speed
      startLoop();
    }

    if (score > highScore) {
      highScore = score;
      highScoreEl.textContent = highScore;
      localStorage.setItem('snakeHighScore', highScore);
    }

    spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

// ─── Drawing ───────────────────────────────────────────────────────────────

function draw() {
  // Background
  ctx.fillStyle = '#111122';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  drawFood();
  drawSnake();
}

function drawGrid() {
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= canvas.width; x += CELL) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += CELL) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawSnake() {
  snake.forEach((seg, i) => {
    const x = seg.x * CELL;
    const y = seg.y * CELL;
    const pad = 1;
    const size = CELL - pad * 2;
    const radius = i === 0 ? 6 : 4;

    // Gradient head vs body
    const alpha = i === 0 ? 1 : Math.max(0.4, 1 - i * 0.03);
    ctx.fillStyle = i === 0 ? '#00e676' : `rgba(0, 200, 100, ${alpha})`;

    roundRect(ctx, x + pad, y + pad, size, size, radius);
    ctx.fill();

    // Eye on head
    if (i === 0) {
      ctx.fillStyle = '#0f0f1a';
      const eyeSize = 3;
      const ex = x + CELL / 2 + direction.x * 4;
      const ey = y + CELL / 2 + direction.y * 4;
      ctx.beginPath();
      ctx.arc(ex, ey, eyeSize, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function drawFood() {
  const x = food.x * CELL + CELL / 2;
  const y = food.y * CELL + CELL / 2;
  const r = CELL / 2 - 2;

  // Glow
  const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 2);
  glow.addColorStop(0, 'rgba(255, 80, 80, 0.5)');
  glow.addColorStop(1, 'rgba(255, 80, 80, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, r * 2, 0, Math.PI * 2);
  ctx.fill();

  // Food circle
  ctx.fillStyle = '#ff5252';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // Shine
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.3, 0, Math.PI * 2);
  ctx.fill();
}

// Helper: rounded rectangle
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─── Game State Transitions ────────────────────────────────────────────────

function startGame() {
  initGame();
  state = 'running';
  overlay.classList.add('hidden');
  pauseBtn.disabled = false;
  restartBtn.disabled = false;
  pauseBtn.textContent = 'Pause';
  draw();
  startLoop();
}

function pauseGame() {
  if (state !== 'running' && state !== 'paused') return;

  if (state === 'running') {
    clearInterval(gameLoop);
    gameLoop = null;
    state = 'paused';
    pauseBtn.textContent = 'Resume';
    showOverlay('Paused', 'Press Resume or P to continue.');
  } else {
    state = 'running';
    pauseBtn.textContent = 'Pause';
    overlay.classList.add('hidden');
    startLoop();
  }
}

function endGame() {
  clearInterval(gameLoop);
  gameLoop = null;
  state = 'over';
  pauseBtn.disabled = true;
  showOverlay('Game Over', `Final score: ${score}. Press Restart to play again.`);
  startBtn.textContent = 'Play Again';
}

function showOverlay(title, message) {
  overlayTitle.textContent = title;
  overlayMessage.textContent = message;
  overlay.classList.remove('hidden');
}

// ─── Event Listeners ───────────────────────────────────────────────────────

startBtn.addEventListener('click', startGame);

pauseBtn.addEventListener('click', pauseGame);

restartBtn.addEventListener('click', () => {
  clearInterval(gameLoop);
  gameLoop = null;
  startGame();
});

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      e.preventDefault();
      if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      e.preventDefault();
      if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      e.preventDefault();
      if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      e.preventDefault();
      if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
      break;
    case 'p':
    case 'P':
      pauseGame();
      break;
    case ' ':
      e.preventDefault();
      if (state === 'idle' || state === 'over') startGame();
      else pauseGame();
      break;
  }
});

// Mobile touch controls
document.getElementById('up-btn').addEventListener('click', () => {
  if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
});
document.getElementById('down-btn').addEventListener('click', () => {
  if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
});
document.getElementById('left-btn').addEventListener('click', () => {
  if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
});
document.getElementById('right-btn').addEventListener('click', () => {
  if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
});

// Swipe support
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;

  if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return; // ignore taps

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && direction.x !== -1) nextDirection = { x: 1, y: 0 };
    else if (dx < 0 && direction.x !== 1) nextDirection = { x: -1, y: 0 };
  } else {
    if (dy > 0 && direction.y !== -1) nextDirection = { x: 0, y: 1 };
    else if (dy < 0 && direction.y !== 1) nextDirection = { x: 0, y: -1 };
  }
  e.preventDefault();
}, { passive: false });

// Initial canvas render
(function initialDraw() {
  ctx.fillStyle = '#111122';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawGrid();
})();
