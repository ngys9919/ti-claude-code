# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static, single-page Snake Game built with vanilla HTML/CSS/JavaScript — no frameworks, no build step, no package manager, no tests. Files are served directly as-is.

## Development

- **Run locally**: open [index.html](index.html) in a browser, or serve the directory with any static server (e.g. `python -m http.server`).
- **No build, lint, or test commands exist.** Do not introduce a toolchain (npm, bundlers, TypeScript, frameworks) unless the user explicitly asks — the project is intentionally dependency-free.

## Deployment

GitHub Pages via [.github/workflows/deploy.yml](.github/workflows/deploy.yml). Any push to `main` triggers the workflow, which uploads the repo root as the Pages artifact and publishes to `https://ngys9919.github.io/ti-claude-code/`.

The workflow assumes Pages **Source** is set to "GitHub Actions" in the repo settings. Because the artifact path is `'.'`, every file at the repo root is published — keep non-public assets (screenshots, scratch files) in mind when committing.

## Code Architecture

All game logic lives in [script.js](script.js). Key things to know before editing:

- **Grid model**: a fixed 20×20 grid; `CELL` is derived from `canvas.width / COLS`. Snake segments and food are stored as `{x, y}` cell coordinates, not pixels — only the draw functions multiply by `CELL`.
- **State machine**: `state` is one of `idle | running | paused | over`. Transitions go through `startGame` / `pauseGame` / `endGame`, which are also responsible for enabling/disabling the Pause/Restart buttons and toggling the overlay. Don't mutate `state` from elsewhere.
- **Direction buffering**: input writes to `nextDirection`; the game loop copies it into `direction` at the start of each `tick`. This prevents two rapid key presses within one tick from reversing the snake into itself. Reversal guards must check the *current* `direction`, not `nextDirection`.
- **Speed/level coupling**: `getSpeed()` derives interval from `level`. When the level changes mid-game, `startLoop()` must be re-called to apply the new interval — `setInterval` does not re-read the delay.
- **High score persistence**: `localStorage` key is `snakeHighScore`. Anything that resets progress should be careful not to clear it.
- **Input sources**: keyboard (arrows + WASD + P/Space), on-screen touch buttons (mobile), and canvas swipe gestures all funnel into the same `nextDirection` update — add new input methods the same way rather than mutating `direction` directly.

## Files

- [prompt.md](prompt.md) — the original spec the game was generated from. Treat as historical context, not authoritative; the code is the source of truth.
- [snake-game.txt](snake-game.txt) — one-line seed that produced `prompt.md`.
- `ti-claude-code-*.png` — screenshots committed at the repo root (and therefore deployed to Pages).
