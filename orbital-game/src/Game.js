import { Player } from './entities/Player.js';
import { Meteor } from './entities/Meteor.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, SPAWN_INTERVAL_INITIAL, NEAR_MISS_DISTANCE, SLOW_TIME_DURATION } from './constants.js';

export class Game {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.width = CANVAS_WIDTH;
        this.height = CANVAS_HEIGHT;
        this.canvas = canvas;
        
        this.player = new Player();
        this.meteors = [];
        this.nextSpawnTime = 0;
        this.score = 0;
        this.state = 'MENU'; // MENU, PLAYING, GAME_OVER
        this.difficulty = 1.0;
        
        this.slowTimer = 0;
        this.slowPowerUpCharge = 0; // charge based on elapsed time or score
        
        this.startTime = 0;
        this.lastTime = 0;

        // Input listener
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
                if (this.state === 'PLAYING') {
                    this.player.switchOrbit();
                } else if (this.state === 'MENU' || this.state === 'GAME_OVER') {
                    this.reset();
                    this.state = 'PLAYING';
                }
            }
            if (e.code === 'KeyZ' && this.slowPowerUpCharge >= 100) {
               this.activateSlowTime();
            }
        });

        canvas.addEventListener('mousedown', () => {
            if (this.state === 'PLAYING') {
                this.player.switchOrbit();
            } else {
                this.reset();
                this.state = 'PLAYING';
            }
        });
    }

    reset() {
        this.player = new Player();
        this.meteors = [];
        this.score = 0;
        this.difficulty = 1.0;
        this.startTime = Date.now();
        this.slowTimer = 0;
        this.slowPowerUpCharge = 0;
        this.nextSpawnTime = Date.now() + 1000;
        this.lastTime = Date.now();
    }

    activateSlowTime() {
        this.slowTimer = SLOW_TIME_DURATION;
        this.slowPowerUpCharge = 0;
    }

    update() {
        if (this.state !== 'PLAYING') return;
        
        const now = Date.now();
        const delta = (now - this.lastTime);
        this.lastTime = now;
        
        // Increase difficulty over time
        this.difficulty = 1.0 + (now - this.startTime) / 20000; // +0.1 every 20 seconds

        // Determine effective game speed
        let gameSpeed = 1.0;
        if (this.slowTimer > 0) {
            gameSpeed = 0.4;
            this.slowTimer -= delta;
        } else {
           this.slowPowerUpCharge = Math.min(100, this.slowPowerUpCharge + 0.1); 
        }

        this.player.update(delta, gameSpeed);

        // Meteor Spawn
        if (now > this.nextSpawnTime) {
            this.meteors.push(new Meteor(this.difficulty));
            const interval = SPAWN_INTERVAL_INITIAL / this.difficulty;
            this.nextSpawnTime = now + interval;
        }

        // Update Meteors & Collisions
        this.meteors.forEach(m => {
            m.update(delta, gameSpeed);
            
            // Check collision
            const dx = m.x - this.player.x;
            const dy = m.y - this.player.y;
            const distSq = dx * dx + dy * dy;
            const minDist = (m.radius + this.player.radius) * (m.radius + this.player.radius);
            
            if (distSq < minDist) {
                this.state = 'GAME_OVER';
            }

            // Near Miss logic
            if (!m.isNearMissed && distSq < (NEAR_MISS_DISTANCE * NEAR_MISS_DISTANCE)) {
                m.isNearMissed = true;
                this.score += 5; // Near miss points
            }
        });

        // Cleanup out-of-screen meteors
        this.meteors = this.meteors.filter(m => m.active);
        
        this.score += 0.1 * gameSpeed; // passive score
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        // Background
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, this.width, this.height);

        // Planet at center
        ctx.fillStyle = '#333344';
        ctx.beginPath();
        ctx.arc(300, 300, 30, 0, Math.PI * 2);
        ctx.fill();

        if (this.state === 'PLAYING') {
            this.player.render(ctx);
            this.meteors.forEach(m => m.render(ctx));

            // HUD
            ctx.fillStyle = '#fff';
            ctx.font = '20px monospace';
            ctx.fillText(`SCORE: ${Math.floor(this.score)}`, 20, 30);
            ctx.fillText(`DIFFICULTY: ${this.difficulty.toFixed(1)}x`, 20, 55);
            
            // Power-up bar
            ctx.strokeStyle = '#fff';
            ctx.strokeRect(480, 20, 100, 10);
            ctx.fillStyle = this.slowPowerUpCharge >= 100 ? '#0ff' : '#07f';
            ctx.fillRect(480, 20, this.slowPowerUpCharge, 10);
            if (this.slowPowerUpCharge >= 100) {
              ctx.font = '12px monospace';
              ctx.fillText('PRESS Z for SLOW', 480, 45);
            }
        } 
        else if (this.state === 'MENU') {
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.font = '40px monospace';
            ctx.fillText('ORBITAL DEFENSE', 300, 260);
            ctx.font = '20px monospace';
            ctx.fillText('CLICK TO START', 300, 320);
            ctx.font = '14px monospace';
            ctx.fillText('SWITCH ORBIT: LEFT CLICK / SPACE', 300, 360);
            ctx.fillText('AVOID METEORS!', 300, 385);
            ctx.textAlign = 'left';
        }
        else if (this.state === 'GAME_OVER') {
            ctx.fillStyle ='rgba(0,0,0,0.7)';
            ctx.fillRect(0,0,600,600);
            ctx.fillStyle = '#f00';
            ctx.textAlign = 'center';
            ctx.font = '50px monospace';
            ctx.fillText('GAME OVER', 300, 280);
            ctx.fillStyle = '#fff';
            ctx.font = '30px monospace';
            ctx.fillText(`FINAL SCORE: ${Math.floor(this.score)}`, 300, 340);
            ctx.font = '20px monospace';
            ctx.fillText('CLICK TO RESTART', 300, 400);
            ctx.textAlign = 'left';
        }
    }
}
