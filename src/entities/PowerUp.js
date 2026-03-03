import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    POWER_UP_DURATION
} from '../constants.js';
import { randomFloat, circleOverlap } from '../utils.js';

export class PowerUp {
    constructor() {
        this.radius = 12;
        this.color = '#33ff33';
        
        // Random position in canvas
        this.x = randomFloat(this.radius, CANVAS_WIDTH - this.radius);
        this.y = randomFloat(this.radius, CANVAS_HEIGHT - this.radius);
        
        this.spawnTime = Date.now();
        this.lifeTime = 5000; // Will disappear if not collected
    }

    isExpired(timestamp) {
        return timestamp - this.spawnTime > this.lifeTime;
    }

    render(ctx) {
        // Blink effect when expiring
        const timeRemaining = 5000 - (Date.now() - this.spawnTime);
        if (timeRemaining < 2000 && Math.floor(Date.now() / 200) % 2 === 0) return;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Cross in the middle
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x - 6, this.y);
        ctx.lineTo(this.x + 6, this.y);
        ctx.moveTo(this.x, this.y - 6);
        ctx.lineTo(this.x, this.y + 6);
        ctx.stroke();
    }
}
