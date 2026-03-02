// src/main.js
console.log("main.js loaded");

import { GameLoop } from './gameLoop.js';
import { Game } from './game.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const game = new Game(canvas.width, canvas.height);

const gameLoop = new GameLoop(
    (deltaTime) => game.update(deltaTime),
    () => game.render(ctx)
);

gameLoop.start();
