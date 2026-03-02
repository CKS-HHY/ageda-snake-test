import { PLAYER_SPEED, CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants.js";
import { clamp } from "../utils.js";
import { Bullet } from "./Bullet.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.w = 48;
        this.h = 32;
        this.x = (CANVAS_WIDTH - this.w) / 2;
        this.y = CANVAS_HEIGHT - this.h - 10; // 10 pixels from bottom
        this.speed = PLAYER_SPEED;
        this.shootCooldown = 0;
        this.maxShootCooldown = 0.5; // seconds
    }

    update(delta, input) {
        // Move left/right
        if (input.keys.includes("ArrowLeft")) {
            this.x -= this.speed * delta * 60; // Multiply by 60 for consistency
        }
        if (input.keys.includes("ArrowRight")) {
            this.x += this.speed * delta * 60;
        }

        // Clamp player to canvas bounds
        this.x = clamp(this.x, 0, CANVAS_WIDTH - this.w);

        // Handle shooting
        if (this.shootCooldown > 0) {
            this.shootCooldown -= delta;
        }
        if (input.keys.includes("Space") && this.shootCooldown <= 0) {
            this.shootCooldown = this.maxShootCooldown;
            return this.shoot();
        }
        return null;
    }

    shoot() {
        // Return a new bullet instance
        return new Bullet(
            this.game,                                   // game instance
            this.x + this.w / 2 - 1.5, // bullet x (centered)
            this.y,                                      // bullet y (top of player)
            -1                                       // direction: -1 for upward
        );
    }

    render(ctx) {
        ctx.fillStyle = "lime"; // Green color for player ship
        ctx.fillRect(this.x, this.y, this.w, this.h);

        // Optional: Draw a triangle top for a more 'ship-like' appearance
        ctx.beginPath();
        ctx.moveTo(this.x + this.w / 2, this.y - 10);
        ctx.lineTo(this.x, this.y + 5);
        ctx.lineTo(this.x + this.w, this.y + 5);
        ctx.fill();
    }
}
