import { CENTER_X, CENTER_Y, ORBIT_RADII, PLAYER_BASE_SPEEDS, PLAYER_SIZE, SWITCH_COOLDOWN } from '../constants.js';

export class Player {
    constructor() {
        this._orbitIndex = 1; // Start in middle orbit
        this.targetOrbitIndex = 1;
        this.angle = 0;
        this.radius = ORBIT_RADII[this._orbitIndex];
        this.targetRadius = ORBIT_RADII[this._orbitIndex];
        this.size = PLAYER_SIZE;
        this.color = '#00ffff';
        this.lastSwitchTime = 0;
        this.isSwitching = false;
        
        // Update positions
        this.x = CENTER_X + Math.cos(this.angle) * this.radius;
        this.y = CENTER_Y + Math.sin(this.angle) * this.radius;
    }

    get orbitIndex() {
        return this._orbitIndex;
    }

    switchOrbit() {
        if (Date.now() - this.lastSwitchTime < SWITCH_COOLDOWN) return false;
        
        // Cycle orbits 0 -> 1 -> 2 -> 0...
        this.targetOrbitIndex = (this._orbitIndex + 1) % ORBIT_RADII.length;
        this.targetRadius = ORBIT_RADII[this.targetOrbitIndex];
        this.lastSwitchTime = Date.now();
        this.isSwitching = true;
        
        // Update the current orbit index immediately for logical purposes,
        // although radius lerps for visual.
        this._orbitIndex = this.targetOrbitIndex;
        
        return true;
    }

    update(dt, isSlowed) {
        // Handle orbit transition (smooth but fast)
        const lerpSpeed = 0.4;
        this.radius += (this.targetRadius - this.radius) * lerpSpeed;
        
        if (Math.abs(this.radius - this.targetRadius) < 1) {
            this.radius = this.targetRadius;
            this.isSwitching = false;
        }

        // Circular motion
        const speedScale = isSlowed ? 0.3 : 1.0;
        const currentSpeed = PLAYER_BASE_SPEEDS[this._orbitIndex] * speedScale;
        this.angle += currentSpeed;

        this.x = CENTER_X + Math.cos(this.angle) * this.radius;
        this.y = CENTER_Y + Math.sin(this.angle) * this.radius;
    }

    draw(ctx) {
        // Draw glow
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
