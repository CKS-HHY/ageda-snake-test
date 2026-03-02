import { ALIEN_H_STEP, ALIEN_V_STEP, ALIEN_COLS, ALIEN_ROWS } from "../constants.js";

export class Alien {
    constructor(game, x, y, type) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.w = 32;
        this.h = 24;
        this.type = type; // 0, 1, or 2 based on row tier
        this.frame = 0; // For animation (0 or 1)
        this.alive = true;
        this.scoreValue = [10, 20, 30][type]; // Example scores, refine from constants
    }

    toggleFrame() {
        this.frame = 1 - this.frame;
    }

    render(ctx) {
        if (!this.alive) return;
        ctx.fillStyle = this.getColor();
        ctx.fillRect(this.x, this.y, this.w, this.h);

        // Optional: Draw simple animation frame markers
        if (this.frame === 0) {
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            ctx.fillRect(this.x + 5, this.y + 5, 5, 5);
        } else {
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            ctx.fillRect(this.x + this.w - 10, this.y + 5, 5, 5);
        }
    }

    getColor() {
        switch (this.type) {
            case 0: return "#00FF00"; // Green (Bottom row)
            case 1: return "#FFFF00"; // Yellow (Middle rows)
            case 2: return "#FF0000"; // Red (Top rows)
            default: return "#FFFFFF"; // White
        }
    }

    markForDeletion() {
        this.alive = false;
    }
}
