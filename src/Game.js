import {
    CANVAS_SIZE,
    ORBITS,
    SW_COOLDOWN_MS,
    NEAR_MISS_RADIUS,
    METEOR_SPAWN_INTERVAL,
    DIFFICULTY_INCREASE_INTERVAL,
    SLOW_TIME_DURATION,
    SLOW_TIME_FACTOR
} from './constants.js';
import { Player } from './entities/Player.js';
import { Meteorite } from './entities/Meteorite.js';

export class Game {
    constructor(ctx) {
        this.ctx = ctx;
        this.player = new Player();
        this.meteorites = [];
        this.scoreVal = document.getElementById('score-val');
        this.finalScoreVal = document.getElementById('final-score');
        this.gameOverScreen = document.getElementById('game-over');

        this.lastSpawnTime = 0;
        this.difficulty = 0;
        this.lastDifficultyIncrease = 0;
        this.isPlaying = true;
        this.currentTime = 0;

        this.slowTimeTimer = 0;
        this.slowTimeActive = false;
        
        this.inputCooldown = SW_COOLDOWN_MS; // Hardcore mode

        this.initInput();
    }

    initInput() {
        const handleAction = () => {
            if (this.isPlaying) {
                this.player.switchOrbit(this.currentTime, this.inputCooldown);
            }
        };

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') handleAction();
        });

        window.addEventListener('mousedown', (e) => {
            handleAction();
        });
    }

    update(delta) {
        if (!this.isPlaying) return;

        this.currentTime += delta * 1000;
        const timeSlowFactor = this.slowTimeActive ? SLOW_TIME_FACTOR : 1.0;

        // Difficulty scaling
        if (this.currentTime - this.lastDifficultyIncrease > DIFFICULTY_INCREASE_INTERVAL) {
            this.difficulty++;
            this.lastDifficultyIncrease = this.currentTime;
            console.log("Current Difficulty: ", this.difficulty);
        }

        // Spawn logic
        const spawnInterval = METEOR_SPAWN_INTERVAL / (1 + this.difficulty * 0.2);
        if (this.currentTime - this.lastSpawnTime > spawnInterval) {
            this.meteorites.push(new Meteorite(this.difficulty/2));
            this.lastSpawnTime = this.currentTime;
        }

        // Update player
        this.player.update(delta, this.currentTime, this.inputCooldown);

        // Update meteorites
        this.meteorites = this.meteorites.filter(m => !m.isOffscreen);
        this.meteorites.forEach(m => {
            m.update(delta, timeSlowFactor);

            // Collision Check
            const dx = m.x - this.player.x;
            const dy = m.y - this.player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Check Collision
            if (dist < m.radius + this.player.radius) {
                this.gameOver();
            }

            // Near Miss Logic
            if (dist < NEAR_MISS_RADIUS && !m.nearMissed) {
                m.nearMissed = true;
                this.player.score += 50 * (this.difficulty + 1);
            }
        });

        // Time Slow powerup (random check)
        if (!this.slowTimeActive && Math.random() < 0.0005) {
             this.slowTimeActive = true;
             this.slowTimeTimer = this.currentTime + SLOW_TIME_DURATION;
        }

        if (this.slowTimeActive && this.currentTime > this.slowTimeTimer) {
             this.slowTimeActive = false;
        }

        // Increment basic score
        this.player.score += delta * 10 * (this.difficulty + 1);
        this.scoreVal.innerText = Math.floor(this.player.score);
    }

    gameOver() {
        this.isPlaying = false;
        this.finalScoreVal.innerText = Math.floor(this.player.score);
        this.gameOverScreen.style.display = 'flex';
    }

    render() {
        this.ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // Draw helper circles for orbits
        this.ctx.strokeStyle = '#111';
        ORBITS.forEach(r => {
            this.ctx.beginPath();
            this.ctx.lineWidth = 2;
            this.ctx.arc(CANVAS_SIZE/2, CANVAS_SIZE/2, r, 0, Math.PI * 2);
            this.ctx.stroke();
        });

        this.meteorites.forEach(m => m.draw(this.ctx));
        this.player.draw(this.ctx);

        // Slow motion overlay effects
        if (this.slowTimeActive) {
            this.ctx.fillStyle = "rgba(0, 255, 255, 0.1)";
            this.ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
            this.ctx.fillStyle = "#0ff";
            this.ctx.font = "16px monospace";
            this.ctx.fillText("SLOW TIME ACTIVE", 20, 60);
        }
    }
}
