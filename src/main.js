import { Game } from "./Game.js";
import { GameLoop } from "./gameLoop.js";

window.addEventListener("load", function () {
    const canvas = document.getElementById("gameCanvas");
    const game = new Game(canvas);

    const gameLoop = new GameLoop(
        (delta) => game.update(delta),
        () => game.render()
    );

    // Start the game loop
    gameLoop.start();

    // Handle game state transitions with Space key
    window.addEventListener("keydown", e => {
        if (e.key === " ") { // Spacebar
            if (game.state === "MENU" || game.state === "GAME_OVER") {
                game.start();
            }
        }
    });
});
