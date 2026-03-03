import {
    ORBIT_RADII,
    PLAYER_RADIUS,
    ORBIT_SPEED,
    PLAYER_COOLDOWN,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
} from '../constants.js';

export class Player {
    constructor() {
        this.center = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };
        this.orbitIndex = 1; // Start in the middle orbit
        this.angle = 0;
        this.radius = PLAYER_RADIUS;
        this.color = '#00ffcc';
        this.lastSwitchTime = 0;
        this.x = 0;
        this.y = 0;
        this.updatePosition();
    }

    update(delta, timestamp) {
        this.angle += ORBIT_SPEED * delta;
        this.updatePosition();
    }

    switchOrbit(timestamp) {
        if (timestamp - this.lastSwitchTime < PLAYER_COOLDOWN) return;
        
        this.orbitIndex = (this.orbitIndex + 1) % ORBIT_RADII.length;
        this.lastSwitchTime = timestamp;
    }

    updatePosition() {
        const orbitRadius = ORBIT_RADII[this.orbitIndex];
        this.x = this.center.x + Math.cos(this.angle) * orbitRadius;
        this.y = this.center.y + Math.sin(this.angle) * orbitRadius;
    }

    render(ctx) {
        // Draw the orbits for visual aid (optional)
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1;
        ORBIT_RADII.forEach(r => {
            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, r, 0, Math.PI * 2);
            ctx.stroke();
        });

        // Current orbit highlight
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, ORBIT_RADII[this.orbitIndex], 0, Math.PI * 2);
        ctx.stroke();

        // Player dot
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}
