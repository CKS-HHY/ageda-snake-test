import { BULLET_SPEED, ALIEN_BULLET_SPEED, CANVAS_HEIGHT } from "../constants.js";

export class Bullet {
    constructor(game, x, y, direction) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.w = 3;
        this.h = 12;
        this.direction = direction; // -1 for player bullet (up), 1 for alien bullet (down)
        this.speed = (direction === -1) ? BULLET_SPEED : ALIEN_BULLET_SPEED;
        this.markedForDeletion = false;
    }

    update(delta) {
        this.y += this.direction * this.speed * delta * 60; // Multiply by 60 for consistency
        if (this.isOffscreen()) {
            this.markedForDeletion = true;
        }
    }

    isOffscreen() {
        return (this.y + this.h < 0 || this.y > CANVAS_HEIGHT);
    }

    render(ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}
