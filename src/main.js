import { CANVAS_SIZE } from './constants.js';
import { Game } from './Game.js';

window.onload = () => {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    const ctx = canvas.getContext('2d');

    const game = new Game(ctx);

    let lastTime = 0;

    function gameLoop(timestamp) {
        const delta = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        game.update(delta);
        game.render();

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
};
