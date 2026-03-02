import { Player } from "./entities/Player.js";
import { AlienGrid } from "./entities/AlienGrid.js";
import { UFO } from "./entities/UFO.js";
import { Barrier } from "./entities/Barrier.js";
import { InputHandler } from "./InputHandler.js";
import { ScoreManager } from "./ScoreManager.js";
import { aabbCollides } from "./utils.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, BARRIER_COUNT } from "./constants.js";

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;

        this.player = new Player(this);
        this.alienGrid = new AlienGrid(this);
        this.ufos = [];
        this.barriers = [];
        this.playerBullets = [];
        this.alienBullets = [];

        this.input = new InputHandler();
        this.scoreManager = new ScoreManager();

        this.state = "MENU"; // MENU, PLAYING, GAME_OVER

        this.ufoSpawnTimer = 0;
        this.ufoSpawnInterval = 20 + Math.random() * 20; // 20-40 seconds

        this.initBarriers();
    }

    initBarriers() {
        this.barriers = [];
        const barrierWidth = 60;
        const barrierSpacing = (CANVAS_WIDTH - (BARRIER_COUNT * barrierWidth)) / (BARRIER_COUNT + 1);
        for (let i = 0; i < BARRIER_COUNT; i++) {
            this.barriers.push(new Barrier(this, barrierSpacing * (i + 1) + barrierWidth * i, CANVAS_HEIGHT - 120));
        }
    }

    start() {
        this.state = "PLAYING";
        this.gameStarted = true;
    }

    update(delta) {
        if (this.state === "PLAYING") {
            const newPlayerBullet = this.player.update(delta, this.input);
            if (newPlayerBullet) {
                this.playerBullets.push(newPlayerBullet);
            }

            this.alienGrid.update(delta);

            // Update UFOs
            this.ufoSpawnTimer += delta;
            if (this.ufoSpawnTimer >= this.ufoSpawnInterval) {
                this.ufos.push(new UFO(this));
                this.ufoSpawnInterval = 20 + Math.random() * 20; // Reset interval
                this.ufoSpawnTimer = 0;
            }
            this.ufos.forEach(ufo => ufo.update(delta));
            this.ufos = this.ufos.filter(ufo => !ufo.markedForDeletion);

            this.playerBullets.forEach(bullet => bullet.update(delta));
            this.alienBullets.forEach(bullet => bullet.update(delta));

            this.playerBullets = this.playerBullets.filter(bullet => !bullet.markedForDeletion);
            this.alienBullets = this.alienBullets.filter(bullet => !bullet.markedForDeletion);

            this.checkCollisions();

            if (this.scoreManager.lives <= 0 || this.checkAlienVictory()) {
                this.state = "GAME_OVER";
                this.scoreManager.saveHighScore();
            }

            if (this.alienGrid.getLivingAliens().length === 0) {
                // Level clear - reset game state or advance level (for now, just reset for testing)
                this.resetGame();
            }
        }
    }

    checkCollisions() {
        // Player Bullets vs Aliens
        this.playerBullets.forEach(pBullet => {
            this.alienGrid.getLivingAliens().forEach(alien => {
                if (aabbCollides(pBullet, alien)) {
                    alien.markForDeletion();
                    pBullet.markedForDeletion = true;
                    this.scoreManager.addScore(alien.scoreValue);
                }
            });

            // Player Bullets vs UFO
            this.ufos.forEach(ufo => {
                if (aabbCollides(pBullet, ufo)) {
                    ufo.markedForDeletion = true;
                    pBullet.markedForDeletion = true;
                    this.scoreManager.addScore(ufo.scoreValue);
                }
            });

            // Player Bullets vs Alien Bullets (optional - can cancel each other out)
            this.alienBullets.forEach(aBullet => {
                if (aabbCollides(pBullet, aBullet)) {
                    pBullet.markedForDeletion = true;
                    aBullet.markedForDeletion = true;
                }
            });

            // Player Bullets vs Barriers
            this.barriers.forEach(barrier => {
                if (aabbCollides(pBullet, { x: barrier.x, y: barrier.y, w: barrier.w, h: barrier.h })) {
                    barrier.damage(pBullet);
                    pBullet.markedForDeletion = true;
                }
            });
        });

        // Alien Bullets vs Player
        this.alienBullets.forEach(aBullet => {
            if (aabbCollides(aBullet, this.player)) {
                aBullet.markedForDeletion = true;
                this.scoreManager.loseLife();
            }

            // Alien Bullets vs Barriers
            this.barriers.forEach(barrier => {
                if (aabbCollides(aBullet, { x: barrier.x, y: barrier.y, w: barrier.w, h: barrier.h })) {
                    barrier.damage(aBullet);
                    aBullet.markedForDeletion = true;
                }
            });
        });
    }

    checkAlienVictory() {
        // If any alien reaches the player's y position or below
        return this.alienGrid.getLivingAliens().some(alien => alien.y + alien.h >= this.player.y);
    }

    resetGame() {
        this.scoreManager.reset();
        this.player = new Player(this);
        this.alienGrid = new AlienGrid(this);
        this.ufos = [];
        this.playerBullets = [];
        this.alienBullets = [];
        this.initBarriers();
        this.state = "MENU";
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (this.state === "MENU") {
            this.drawText("SPACE INVADERS", this.width / 2, this.height / 2 - 50, 30, "white");
            this.drawText("Press Space to Start", this.width / 2, this.height / 2, 20, "white");
            this.drawText(`High Score: ${this.scoreManager.highScore}`, this.width / 2, this.height / 2 + 50, 15, "white");
        } else if (this.state === "PLAYING") {
            this.player.render(this.ctx);
            this.alienGrid.render(this.ctx);
            this.ufos.forEach(ufo => ufo.render(this.ctx));
            this.barriers.forEach(barrier => barrier.render(this.ctx));
            this.playerBullets.forEach(bullet => bullet.render(this.ctx));
            this.alienBullets.forEach(bullet => bullet.render(this.ctx));
            this.drawHUD();
        } else if (this.state === "GAME_OVER") {
            this.drawText("GAME OVER", this.width / 2, this.height / 2 - 50, 30, "white");
            this.drawText(`Score: ${this.scoreManager.score}`, this.width / 2, this.height / 2, 20, "white");
            this.drawText(`High Score: ${this.scoreManager.highScore}`, this.width / 2, this.height / 2 + 50, 15, "white");
            this.drawText("Press Space to Restart", this.width / 2, this.height / 2 + 100, 15, "white");
        }
    }

    drawHUD() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "16px Arial";
        this.ctx.textAlign = "left";
        this.ctx.fillText(`Score: ${this.scoreManager.score}`, 10, 20);
        this.ctx.textAlign = "right";
        this.ctx.fillText(`Lives: ${this.scoreManager.lives}`, this.width - 10, 20);
    }

    drawText(text, x, y, size, color) {
        this.ctx.fillStyle = color;
        this.ctx.font = `${size}px Arial`;
        this.ctx.textAlign = "center";
        this.ctx.fillText(text, x, y);
    }
}
