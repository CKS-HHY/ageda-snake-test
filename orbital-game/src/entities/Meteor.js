import { METEOR_MIN_SPEED, METEOR_MAX_SPEED, METEOR_RADIUS } from '../constants.js';

export class Meteor {
    constructor(diff_multiplier) {
        this.radius = METEOR_RADIUS;
        this.active = true;
        this.isNearMissed = false; // flag to detect when player is close but doesn't hit
        
        // Spawn from any side
        const side = Math.floor(Math.random() * 4);
        let x, y, vx, vy;

        // Targets center (300, 300) with a bit of randomness
        const targetX = 300 + (Math.random() * 80 - 40);
        const targetY = 300 + (Math.random() * 80 - 40);

        if (side === 0) { // Top
            x = Math.random() * 600;
            y = -this.radius;
        } else if (side === 1) { // Bottom
            x = Math.random() * 600;
            y = 600 + this.radius;
        } else if (side === 2) { // Left
            x = -this.radius;
            y = Math.random() * 600;
        } else { // Right
            x = 600 + this.radius;
            y = Math.random() * 600;
        }

        const angle = Math.atan2(targetY - y, targetX - x);
        const speed = (METEOR_MIN_SPEED + Math.random() * (METEOR_MAX_SPEED - METEOR_MIN_SPEED)) * diff_multiplier;
        
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        // "Finta": sometimes meteor changes direction midway
        this.fintaUsed = false;
        this.fintaThreshold = 0.5 + Math.random() * 0.3; // At what point of their path they change dir
    }

    update(delta, gameSpeed) {
        this.x += this.vx * gameSpeed;
        this.y += this.vy * gameSpeed;

        // Check for "finta" behavior: if within distance of center, slightly adjust angle
        const dx = this.x - 300;
        const dy = this.y - 300;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (!this.fintaUsed && dist < 120 && Math.random() < 0.05) {
            const angleAdjustment = (Math.random() - 0.5) * 1.5;
            const currentAngle = Math.atan2(this.vy, this.vx);
            const newAngle = currentAngle + angleAdjustment;
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            this.vx = Math.cos(newAngle) * speed;
            this.vy = Math.sin(newAngle) * speed;
            this.fintaUsed = true;
        }

        // Deactivate if far off-screen
        if (this.x < -100 || this.x > 700 || this.y < -100 || this.y > 700) {
            this.active = false;
        }
    }

    render(ctx) {
        ctx.fillStyle = '#f50';
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#f50';
        ctx.beginPath();
        // A simple polygon for meteor appearance
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}
