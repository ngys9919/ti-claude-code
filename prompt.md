## Prompt: Snake Game Web App (HTML, CSS, JavaScript)

Create a modern, responsive Snake Game web application using **HTML, CSS, and JavaScript (vanilla JS only, no frameworks)**.

### 🎮 Core Features
1. **Game Board**
   - Render a grid-based game board using `<canvas>` or a styled `<div>` grid.
   - The snake should move smoothly across the grid.

2. **Snake Mechanics**
   - The snake starts with a default length of 3.
   - It grows longer when it eats food.
   - Movement is controlled using keyboard arrow keys (↑ ↓ ← →).
   - Prevent the snake from reversing into itself directly.

3. **Food System**
   - Randomly generate food positions within the grid.
   - Ensure food does not spawn inside the snake’s body.
   - Eating food increases the score and snake length.

4. **Collision Detection**
   - Game ends when:
     - Snake hits the wall (or optionally wraps around edges).
     - Snake collides with itself.

5. **Score Tracking**
   - Display current score prominently.
   - Optionally store and display high score using `localStorage`.

6. **Game Controls**
   - Start / Restart button.
   - Pause / Resume functionality.
   - Display “Game Over” screen with final score.

---

### 🎨 UI / UX Design
- Create a **modern, clean UI** with CSS:
  - Centered game container.
  - Smooth animations for snake movement.
  - Distinct colors for snake, food, and background.
- Add subtle effects:
  - Glow or hover effects on buttons.
  - Transition effects on game over screen.

---

### ⚙️ Technical Requirements
- Use **HTML** for structure.
- Use **CSS** for layout and styling (flexbox or grid).
- Use **JavaScript** for:
  - Game loop (e.g., `requestAnimationFrame` or `setInterval`)
  - Event listeners for keyboard input
  - Game state management (running, paused, game over)

---

### 📱 Responsiveness
- Ensure the game works well on:
  - Desktop (keyboard controls)
  - Mobile (optional: add on-screen touch controls)

---

### ⭐ Optional Enhancements
- Difficulty levels (speed increases over time).
- Sound effects for eating food and game over.
- Dark/light theme toggle.
- Snake skins or color customization.

---

### 📦 Output Format
Provide:
1. `index.html`
2. `style.css`
3. `script.js`

Ensure the code is:
- Well-structured and commented
- Easy to understand for beginners
- Ready to run locally in a browser