import { CANVAS_WIDTH, CANVAS_HEIGHT, SCORE_UFO } from "../constants.js";

export class UFO {
    constructor(game) {
        this.game = game;
        this.w = 60;
        this.h = 28;
        
        // Randomly spawn from left or right
        this.direction = Math.random() < 0.5 ? 1 : -1; // 1 for right, -1 for left
        this.x = this.direction === 1 ? -this.w : CANVAS_WIDTH;
        this.y = 50; // Fixed Y position near the top
        this.speed = 2;
        this.markedForDeletion = false;
        this.scoreValue = SCORE_UFO; // UFO has fixed score or random from a range
    }

    update(delta) {
        this.x += this.direction * this.speed; // No delta * 60 needed if speed is per frame

        // Mark for deletion if offscreen
        if (this.direction === 1 && this.x > CANVAS_WIDTH || this.direction === -1 && this.x + this.w < 0) {
            this.markedForDeletion = true;
        }
    }

    render(ctx) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, this.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillRect(this.x + 10, this.y + this.h / 2, this.w - 20, this.h / 2);
    }
}
