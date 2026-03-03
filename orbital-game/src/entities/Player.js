import { PLAYER_ORBIT_SPEED, PLAYER_RADIUS, ORBIT_INNER, ORBIT_MID, ORBIT_OUTER, SWITCH_COOLDOWN } from '../constants.js';

export class Player {
    constructor() {
        this.orbits = [ORBIT_INNER, ORBIT_MID, ORBIT_OUTER];
        this.orbitIndex = 1; // Start in the middle
        this.theta = 0; // current angle in radians
        this.radius = PLAYER_RADIUS;
        this.lastSwitchTime = 0;
        
        this.updatePosition();
    }

    updatePosition() {
        // Player moves around the center (300, 300)
        this.orbitRadius = this.orbits[this.orbitIndex];
        this.x = 300 + Math.cos(this.theta) * this.orbitRadius;
        this.y = 300 + Math.sin(this.theta) * this.orbitRadius;
    }

    switchOrbit() {
        const now = Date.now();
        if (now - this.lastSwitchTime < SWITCH_COOLDOWN) return;
        
        this.orbitIndex = (this.orbitIndex + 1) % this.orbits.length;
        this.lastSwitchTime = now;
    }

    update(delta, gameSpeed) {
        // Update angle
        this.theta += PLAYER_ORBIT_SPEED * gameSpeed;
        this.updatePosition();
    }

    render(ctx) {
        // Draw the orbits (helpful for player)
        ctx.strokeStyle = '#333';
        ctx.setLineDash([5, 5]);
        this.orbits.forEach(r => {
            ctx.beginPath();
            ctx.arc(300, 300, r, 0, Math.PI * 2);
            ctx.stroke();
        });
        ctx.setLineDash([]);

        // Draw Player
        ctx.fillStyle = '#0f8';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#0f8';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}
