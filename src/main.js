import { 
    CANVAS_WIDTH, 
    CANVAS_HEIGHT, 
    CENTER_X, 
    CENTER_Y, 
    ORBIT_RADII, 
    GAME_STATE, 
    SLOW_TIME_DURATION, 
    NEAR_MISS_THRESHOLD, 
    METEOR_SPAWN_INTERVAL 
} from './constants.js';
import { Player } from './entities/Player.js';
import { Meteorite } from './entities/Meteorite.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;

        this.player = new Player();
        this.meteorites = [];
        this.state = GAME_STATE.PLAYING;
        this.score = 0;
        this.difficulty = 1;
        this.startTime = Date.now();
        this.lastSpawnTime = 0;
        this.slowTimer = 0;
        this.isSlowed = false;

        this._initEvents();
        this.loop();
    }

    _initEvents() {
        const triggerSwitch = () => {
            if (this.state === GAME_STATE.PLAYING) {
                this.player.switchOrbit();
            } else if (this.state === GAME_STATE.GAME_OVER) {
                this.reset();
            }
        };

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                triggerSwitch();
            }
        });
        this.canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            triggerSwitch();
        });
    }

    reset() {
        this.player = new Player();
        this.meteorites = [];
        this.state = GAME_STATE.PLAYING;
        this.score = 0;
        this.difficulty = 1;
        this.startTime = Date.now();
        this.slowTimer = 0;
        this.isSlowed = false;
        this.lastSpawnTime = 0;
    }

    update() {
        if (this.state !== GAME_STATE.PLAYING) return;

        const now = Date.now();
        const elapsed = (now - this.startTime) / 1000;
        
        // Difficulty increase: higher freq, more fakes, faster speeds
        this.difficulty = 1 + Math.floor(elapsed / 10); // +1 every 10s
        const spawnInterval = Math.max(400, METEOR_SPAWN_INTERVAL - (this.difficulty * 80));
        
        // Handle Slow Time
        if (this.isSlowed) {
            this.slowTimer -= 16; // approx ms per frame at 60fps
            if (this.slowTimer <= 0) {
                this.isSlowed = false;
                this.slowTimer = 0;
            }
        }

        // Spawn meteorites
        if (now - this.lastSpawnTime > spawnInterval) {
            const isFake = Math.random() < Math.min(0.4, 0.05 * this.difficulty);
            this.meteorites.push(new Meteorite(1 + (this.difficulty * 0.1), isFake));
            this.lastSpawnTime = now;
        }

        this.player.update(1, this.isSlowed);
        
        for (let i = this.meteorites.length - 1; i >= 0; i--) {
            const m = this.meteorites[i];
            m.update(1, this.isSlowed);
            
            // Distance squared for efficiency
            const dx = m.x - this.player.x;
            const dy = m.y - this.player.y;
            const distSq = dx * dx + dy * dy;
            const collisionDist = (m.radius + this.player.size);
            
            // Collision Detection
            if (distSq < collisionDist * collisionDist) {
                this.gameOver();
                return;
            }

            // Near-miss detection
            const nearMissDist = collisionDist + NEAR_MISS_THRESHOLD;
            if (distSq < nearMissDist * nearMissDist && !m.nearMissTriggered) {
                this.score += 50 * this.difficulty;
                m.nearMissTriggered = true;
                
                // Rarely grant slow time on near-miss
                if (Math.random() < 0.08) {
                    this.isSlowed = true;
                    this.slowTimer = SLOW_TIME_DURATION;
                }
            }
            
            if (m.isOffscreen()) {
                this.meteorites.splice(i, 1);
                this.score += 10;
            }
        }

        // UI Update
        document.getElementById('score').innerText = Math.floor(this.score);
        document.getElementById('difficulty').innerText = this.difficulty;
    }

    gameOver() {
        this.state = GAME_STATE.GAME_OVER;
    }

    draw() {
        this.ctx.fillStyle = '#050505';
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw Orbits
        ORBIT_RADII.forEach(r => {
            this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(CENTER_X, CENTER_Y, r, 0, Math.PI * 2);
            this.ctx.stroke();
        });

        // Central Planet
        const grad = this.ctx.createRadialGradient(CENTER_X, CENTER_Y, 0, CENTER_X, CENTER_Y, 40);
        grad.addColorStop(0, '#1a1a1a');
        grad.addColorStop(1, '#000');
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(CENTER_X, CENTER_Y, 40, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#333';
        this.ctx.stroke();

        this.meteorites.forEach(m => m.draw(this.ctx));
        this.player.draw(this.ctx);

        if (this.isSlowed) {
            this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
            this.ctx.lineWidth = 10;
            this.ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            
            this.ctx.fillStyle = 'rgba(0, 255, 255, 0.05)';
            this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            
            this.ctx.fillStyle = 'cyan';
            this.ctx.font = 'bold 16px Segoe UI';
            this.ctx.fillText('SLOW TIME', 20, 30);
        }

        if (this.state === GAME_STATE.GAME_OVER) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = '48px Segoe UI';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', CENTER_X, CENTER_Y - 20);
            
            this.ctx.font = '24px Segoe UI';
            this.ctx.fillText(`Final Score: ${Math.floor(this.score)}`, CENTER_X, CENTER_Y + 30);
            this.ctx.fillStyle = '#00ffff';
            this.ctx.fillText('Click to Restart', CENTER_X, CENTER_Y + 80);
        }
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}

new Game();
