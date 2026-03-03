import { Game } from './game.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';

function bootstrap() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const game = new Game(canvas, ctx);

    let lastTime = 0;
    function loop(timestamp) {
        const delta = timestamp - lastTime;
        lastTime = timestamp;

        game.update(delta, timestamp);
        game.render();

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

document.addEventListener('DOMContentLoaded', bootstrap);
