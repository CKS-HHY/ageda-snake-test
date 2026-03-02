import { CANVAS_WIDTH } from "../constants.js";

export class Barrier {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.w = 60; // Example width
        this.h = 40; // Example height
        this.pixels = this.initPixels();
        this.pixelSize = 4; // Size of each 'pixel' in the barrier
    }

    initPixels() {
        const pixels = [];
        for (let i = 0; i < this.w / this.pixelSize; i++) {
            pixels[i] = [];
            for (let j = 0; j < this.h / this.pixelSize; j++) {
                // Create a basic barrier shape (initially a solid block)
                pixels[i][j] = 1; // 1 means alive
            }
        }
        return pixels;
    }

    // Damage the barrier based on a bullet's bounding box
    damage(bullet) {
        // Convert bullet's global coords to barrier's local pixel grid coords
        const localBulletX = bullet.x - this.x;
        const localBulletY = bullet.y - this.y;

        const startCol = Math.floor(localBulletX / this.pixelSize);
        const endCol = Math.floor((localBulletX + bullet.w) / this.pixelSize);
        const startRow = Math.floor(localBulletY / this.pixelSize);
        const endRow = Math.floor((localBulletY + bullet.h) / this.pixelSize);

        for (let i = startCol; i <= endCol; i++) {
            for (let j = startRow; j <= endRow; j++) {
                if (this.pixels[i] && this.pixels[i][j] !== undefined) {
                    this.pixels[i][j] = 0; // Mark as destroyed
                }
            }
        }
    }

    render(ctx) {
        ctx.fillStyle = "#00FF00"; // Green color for barrier pixels
        for (let i = 0; i < this.w / this.pixelSize; i++) {
            for (let j = 0; j < this.h / this.pixelSize; j++) {
                if (this.pixels[i][j] === 1) {
                    ctx.fillRect(
                        this.x + i * this.pixelSize,
                        this.y + j * this.pixelSize,
                        this.pixelSize,
                        this.pixelSize
                    );
                }
            }
        }
    }
}
