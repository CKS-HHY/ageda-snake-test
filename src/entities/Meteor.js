import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    METEOR_RADIUS,
    METEOR_SPEED_MIN,
    METEOR_SPEED_MAX,
    NEAR_MISS_THRESHOLD
} from '../constants.js';
import { randomFloat, randomInt } from '../utils.js';

export class Meteor {
    constructor(speedMultiplier = 1, isFakeChance = 0) {
        this.radius = METEOR_RADIUS;
        this.color = '#ff4444';
        this.speed = randomFloat(METEOR_SPEED_MIN, METEOR_SPEED_MAX) * speedMultiplier;
        this.isFake = Math.random() < isFakeChance;
        this.directionShifted = false;

        // Spawn position: random point outside a circle around the center
        const spawnRadius = Math.max(CANVAS_WIDTH, CANVAS_HEIGHT) * 0.7; // Offscreen
        const spawnAngle = Math.random() * Math.PI * 2;
        this.x = CANVAS_WIDTH / 2 + Math.cos(spawnAngle) * spawnRadius;
        this.y = CANVAS_HEIGHT / 2 + Math.sin(spawnAngle) * spawnRadius;

        // Direction: point towards a random spot within the center area
        const targetX = CANVAS_WIDTH / 2 + randomInt(-50, 50);
        const targetY = CANVAS_HEIGHT / 2 + randomInt(-50, 50);
        
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        this.vx = (dx / dist) * this.speed;
        this.vy = (dy / dist) * this.speed;

        this.hasTriggeredNearMiss = false;
    }

    update(delta, timeScale) {
        // Apply slowed time
        const effectiveDelta = delta * timeScale;
        
        this.x += this.vx * effectiveDelta * 0.1;
        this.y += this.vy * effectiveDelta * 0.1;

        // Fake meteor behavior: shifts direction at 50% through the scene
        if (this.isFake && !this.directionShifted) {
            const distFromCenter = Math.sqrt(
                Math.pow(this.x - CANVAS_WIDTH / 2, 2) + 
                Math.pow(this.y - CANVAS_HEIGHT / 2, 2)
            );
            if (distFromCenter < 150) { // arbitrary threshold to shift
                this.vx *= -1; // Reflect! Or shift at random
                this.vy *= 1.2;
                this.directionShifted = true;
                this.color = '#ffaa00'; // visually show the shift
            }
        }
    }

    isOffscreen() {
        const margin = 100;
        return (
            this.x < -margin || 
            this.x > CANVAS_WIDTH + margin || 
            this.y < -margin || 
            this.y > CANVAS_HEIGHT + margin
        );
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Trail effect
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * 3, this.y - this.vy * 3);
        ctx.stroke();
    }
}
