import { CENTER, PLAYER_RADIUS, PLAYER_ANGULAR_SPEED, ORBITS } from './constants.js';

export class Player {
    constructor() {
        this.angle = 0; // Current angle in radians
        this.orbitIndex = 1; // Start in the middle orbit (ORBITS[1])
        this.radius = PLAYER_RADIUS;
        this.color = '#00ffff';
        this.targetOrbitIndex = 1;
        this.transitionProgress = 1; // 1 = fully on orbit
        this.lastSwitchTime = 0;
        this.score = 0;
        this.comboMulti = 1;

        // Current actual radius (interpolated for smooth transit)
        this.currentRadius = ORBITS[this.orbitIndex];
    }

    update(delta, currentTime, cooldown) {
        // Orbit automatically
        this.angle += PLAYER_ANGULAR_SPEED * delta * 60; // Base on 60fps

        // Handle transition
        const targetRadius = ORBITS[this.orbitIndex];
        if (this.currentRadius !== targetRadius) {
            const diff = targetRadius - this.currentRadius;
            const step = 400 * delta; // Switch speed

            if (Math.abs(diff) <= step) {
                this.currentRadius = targetRadius;
            } else {
                this.currentRadius += Math.sign(diff) * step;
            }
        }

        // Calculate world position
        this.x = CENTER.x + Math.cos(this.angle) * this.currentRadius;
        this.y = CENTER.y + Math.sin(this.angle) * this.currentRadius;
    }

    switchOrbit(currentTime, cooldown) {
        if (currentTime - this.lastSwitchTime < cooldown) return false;

        this.orbitIndex = (this.orbitIndex + 1) % ORBITS.length;
        this.lastSwitchTime = currentTime;
        return true;
    }

    draw(ctx) {
        // Draw orbits (visual aid)
        ctx.strokeStyle = '#111';
        ORBITS.forEach(r => {
            ctx.beginPath();
            ctx.arc(CENTER.x, CENTER.y, r, 0, Math.PI * 2);
            ctx.stroke();
        });

        // Draw player
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}
