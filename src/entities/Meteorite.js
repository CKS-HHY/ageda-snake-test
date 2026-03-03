import { CANVAS_SIZE, CENTER, METEOR_RADIUS } from '../constants.js';

export class Meteorite {
    constructor(difficulty) {
        this.radius = METEOR_RADIUS;
        this.color = '#ff3300';
        this.type = Math.random() < 0.2 ? 'finta' : 'standard';
        this.speed = (2.0 + (difficulty * 0.5)) * (0.8 + Math.random() * 0.4);
        this.angle = Math.random() * Math.PI * 2;
        this.targetAngle = this.angle + Math.PI + (Math.random() - 0.5) * 1.5;

        // Start off-screen
        const spawnDistance = CANVAS_SIZE * 0.8;
        this.x = CENTER.x + Math.cos(this.angle) * spawnDistance;
        this.y = CENTER.y + Math.sin(this.angle) * spawnDistance;

        // Direction vector
        const targetX = CENTER.x + Math.cos(this.targetAngle) * spawnDistance;
        const targetY = CENTER.y + Math.sin(this.targetAngle) * spawnDistance;

        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        this.vx = (dx / dist) * this.speed;
        this.vy = (dy / dist) * this.speed;

        this.hasFaked = false;
        this.isOffscreen = false;
    }

    update(delta, timeSlowFactor) {
        const moveSpeedScale = 60 * delta * timeSlowFactor;
        this.x += this.vx * moveSpeedScale;
        this.y += this.vy * moveSpeedScale;

        // Finta logic: change direction at midway point (near center)
        if (this.type === 'finta' && !this.hasFaked) {
            const distFromCenter = Math.sqrt((this.x - CENTER.x) ** 2 + (this.y - CENTER.y) ** 2);
            if (distFromCenter < 120) {
                // Change direction by 45-90 degrees
                const rotateAngle = (Math.PI / 4) + (Math.random() * Math.PI / 4);
                const originalVX = this.vx;
                const originalVY = this.vy;
                this.vx = originalVX * Math.cos(rotateAngle) - originalVY * Math.sin(rotateAngle);
                this.vy = originalVX * Math.sin(rotateAngle) + originalVY * Math.cos(rotateAngle);
                this.hasFaked = true;
            }
        }

        // Boundary check
        if (this.x < -100 || this.x > CANVAS_SIZE + 100 || this.y < -100 || this.y > CANVAS_SIZE + 100) {
            this.isOffscreen = true;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.hasFakingActive ? 15 : 5;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        // A diamond shape for a meteorite
        ctx.moveTo(this.x, this.y - this.radius);
        ctx.lineTo(this.x + this.radius, this.y);
        ctx.lineTo(this.x, this.y + this.radius);
        ctx.lineTo(this.x - this.radius, this.y);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}
