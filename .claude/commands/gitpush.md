---
description: Push code, create README, add screenshot — all to GitHub in three commits
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, mcp__playwright__browser_navigate, mcp__playwright__browser_take_screenshot, mcp__playwright__browser_resize, mcp__playwright__browser_close
---

Run the following three steps in order. Each step ends with its own commit + push so the history stays readable.

## Step 1 — Push current code to GitHub

1. Run `git status` and `git diff` in parallel to see what's pending.
2. If there are uncommitted changes, stage them (prefer named files over `git add -A`; skip anything that looks like secrets) and create a commit whose message follows the existing log style (check `git log --oneline -10`).
3. If the working tree is clean but the local branch is ahead of `origin/main`, skip the commit and go straight to push.
4. `git push origin main`.
5. If there is nothing to commit AND nothing to push, say so and move on — don't fabricate an empty commit.

## Step 2 — Create a README and push

1. If `README.md` already exists, read it and decide whether to update or leave it. Otherwise, create one.
2. The README should cover, based on [CLAUDE.md](CLAUDE.md) and the actual code:
   - Project title and one-line description
   - How to run locally (open `index.html` or `python -m http.server`)
   - Controls (keyboard, touch, swipe)
   - Live demo link: `https://ngys9919.github.io/ti-claude-code/`
   - A short "Files" section
3. Do NOT add a screenshot reference yet — that's Step 3.
4. Commit with a message like `docs: add README` and `git push origin main`.

## Step 3 — Create a screenshot, add it to the README, push

1. Start a local static server in the background: `python -m http.server 8000` (run with `run_in_background: true`).
2. Use Playwright MCP to navigate to `http://localhost:8000/`, resize the viewport to something reasonable (e.g. 900×700), and take a screenshot saved as `screenshot.png` at the repo root. Close the browser when done.
3. Kill the background server.
4. Edit `README.md` to reference the screenshot near the top: `![Snake Game](screenshot.png)`.
5. Commit (`docs: add screenshot to README`) and `git push origin main`.

## Rules

- Never use `--no-verify`, `--force`, or `--amend` unless the user asks.
- Three separate commits, three separate pushes — don't collapse them.
- After each push, briefly report what was pushed (one line).
- If any step fails, stop and report the error rather than pressing on to the next step.
