import { CENTER_X, CENTER_Y, CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants.js';

export class Meteorite {
    constructor(speedMult = 1, isFake = false) {
        this.isFake = isFake;
        this.isRedirected = false;
        this.radius = 12 + Math.random() * 8;
        this.speed = (2 + Math.random() * 3) * speedMult;
        this.angle = Math.random() * Math.PI * 2;
        this.color = isFake ? '#ff00ff' : '#ff4d4d';
        this.nearMissTriggered = false;
        
        // Spawn outside screen
        const spawnDist = Math.max(CANVAS_WIDTH, CANVAS_HEIGHT) * 0.7;
        this.x = CENTER_X + Math.cos(this.angle) * spawnDist;
        this.y = CENTER_Y + Math.sin(this.angle) * spawnDist;
        
        // Direction vector towards center (with some randomness)
        const targetX = CENTER_X + (Math.random() - 0.5) * 100;
        const targetY = CENTER_Y + (Math.random() - 0.5) * 100;
        
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        
        this.vx = (dx / len) * this.speed;
        this.vy = (dy / len) * this.speed;
    }

    update(dt, isSlowed) {
        const speedScale = isSlowed ? 0.3 : 1.0;
        
        this.x += this.vx * speedScale;
        this.y += this.vy * speedScale;
        
        // Fake mechanic: sudden redirection towards the center halfway
        if (this.isFake && !this.isRedirected) {
            const distToCenter = Math.sqrt((this.x - CENTER_X) ** 2 + (this.y - CENTER_Y) ** 2);
            if (distToCenter < 150) {
                const dx = CENTER_X - this.x;
                const dy = CENTER_Y - this.y;
                const len = Math.sqrt(dx * dx + dy * dy);
                this.vx = (dx / len) * this.speed * 1.5; // Speed up when redirecting
                this.vy = (dy / len) * this.speed * 1.5;
                this.isRedirected = true;
                this.color = '#ff9900'; // Flash color change
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Simple texture/detail
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x - 3, this.y - 3, this.radius * 0.4, 0, Math.PI * 2);
        ctx.stroke();
    }

    isOffscreen() {
        const margin = 200;
        return (
            this.x < -margin || 
            this.x > CANVAS_WIDTH + margin || 
            this.y < -margin || 
            this.y > CANVAS_HEIGHT + margin
        );
    }
}
