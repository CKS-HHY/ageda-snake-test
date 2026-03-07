# Ageda Retro Snake

A polished, retro-styled Snake game built for the web.

## Features
- **Arcade Aesthetic**: Neon green and black CRT-style visuals.
- **Responsive**: Adapts to various screen sizes.
- **Controls**: Supports keyboard (WASD/Arrows) and on-screen touch controls.
- **Persistence**: High score is saved to LocalStorage.
- **Speed Scaling**: Level difficulty increases as you eat food.

## Running Locally
Since the game is a single-file implementation, you can:
1. Open `snake.html` directly in any modern web browser.
2. Or serve it using a simple HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
   Then navigate to `http://localhost:8000/snake.html`

## How to Play
- Use **Arrow Keys** or **WASD** to move the snake.
- On mobile, use the on-screen direction pads.
- Eat the red food to grow and gain points.
- Avoid hitting the walls or your own tail!

---
*Created as part of the Ageda-Snake-Test suite.*