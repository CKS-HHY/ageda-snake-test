import { Player } from './entities/Player.js';
import { Meteor } from './entities/Meteor.js';
import { PowerUp } from './entities/PowerUp.js';
import { circleOverlap, distSq } from './utils.js';
import { 
    CANVAS_WIDTH, 
    CANVAS_HEIGHT, 
    METEOR_SPAWN_INTERVAL, 
    NEAR_MISS_THRESHOLD, 
    POWER_UP_CHANCE, 
    SLOW_MO_FACTOR,
    POWER_UP_DURATION 
} from './constants.js';

export class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.state = 'MENU'; // MENU, PLAYING, GAME_OVER
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('orbitalHighScore')) || 0;
        this.player = new Player();
        this.meteors = [];
        this.powerUps = [];
        this.lastMeteorSpawn = 0;
        this.difficultyLevel = 1;
        this.startTime = 0;
        this.slowMoTimer = 0;
        this.isSlowMoActive = false;

        this.initEventListeners();
    }

    initEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') this.handleInput();
        });
        this.canvas.addEventListener('click', () => this.handleInput());
    }

    handleInput() {
        if (this.state === 'MENU') {
            this.start();
        } else if (this.state === 'PLAYING') {
            this.player.switchOrbit(Date.now());
        } else if (this.state === 'GAME_OVER') {
            this.reset();
        }
    }

    start() {
        this.state = 'PLAYING';
        this.startTime = Date.now();
        this.score = 0;
        this.difficultyLevel = 1;
        this.meteors = [];
        this.powerUps = [];
        this.player = new Player();
    }

    reset() {
        this.state = 'MENU';
    }

    update(delta, timestamp) {
        if (this.state !== 'PLAYING') return;

        // Difficulty scaling: speed increase and more frequent meteors
        const elapsedS = (timestamp - this.startTime) / 1000;
        this.difficultyLevel = 1 + Math.floor(elapsedS / 10) * 0.2; // Increase complexity every 10s

        // Handle Slow-motion effect
        if (this.isSlowMoActive) {
            if (timestamp > this.slowMoTimer) {
                this.isSlowMoActive = false;
            }
        }
        const timeScale = this.isSlowMoActive ? SLOW_MO_FACTOR : 1.0;

        this.player.update(delta * timeScale, timestamp);

        // Spawn logic
        const currentSpawnInterval = METEOR_SPAWN_INTERVAL / this.difficultyLevel;
        if (timestamp - this.lastMeteorSpawn > currentSpawnInterval) {
            const isFakeChance = Math.min(0.05 + 0.05 * (this.difficultyLevel - 1), 0.3); // Scale up to 30% fakes
            this.meteors.push(new Meteor(this.difficultyLevel, isFakeChance));
            this.lastMeteorSpawn = timestamp;
            
            // Randomly spawn power up
            if (Math.random() < POWER_UP_CHANCE) {
                this.powerUps.push(new PowerUp());
            }
        }

        // Update & Collision meteor
        this.meteors = this.meteors.filter(meteor => {
            meteor.update(delta, timeScale);

            // Collision check
            if (circleOverlap(this.player, meteor)) {
                this.gameOver();
                return false;
            }

            // Near-miss check
            const dist = Math.sqrt(distSq(this.player, meteor));
            if (!meteor.hasTriggeredNearMiss && dist < NEAR_MISS_THRESHOLD) {
                this.score += 5; // near-miss bonus
                meteor.hasTriggeredNearMiss = true;
            }

            return !meteor.isOffscreen();
        });

        // Update Powerups
        this.powerUps = this.powerUps.filter(p => {
           if (circleOverlap(this.player, p)) {
               this.activateSlowMo(timestamp);
               return false;
           }
           return !p.isExpired(timestamp);
        });

        // Basic score increment
        this.score += (delta * 0.01) * this.difficultyLevel;
    }

    activateSlowMo(timestamp) {
        this.isSlowMoActive = true;
        this.slowMoTimer = timestamp + POWER_UP_DURATION;
    }

    gameOver() {
        this.state = 'GAME_OVER';
        if (this.score > this.highScore) {
            this.highScore = Math.floor(this.score);
            localStorage.setItem('orbitalHighScore', this.highScore);
        }
    }

    render() {
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        if (this.state === 'MENU') {
            this.renderOverlay('ORBITAL DEFENSE', 'CLICK TO START');
        } else if (this.state === 'PLAYING') {
            this.player.render(this.ctx);
            this.meteors.forEach(m => m.render(this.ctx));
            this.powerUps.forEach(p => p.render(this.ctx));
            this.renderUI();
        } else if (this.state === 'GAME_OVER') {
            this.renderOverlay('GAME OVER', 'SCORE: ' + Math.floor(this.score), 'PRESS SPACE TO RESTART');
        }
    }

    renderUI() {
        this.ctx.font = '20px monospace';
        this.ctx.fillStyle = '#fff';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`SCORE: ${Math.floor(this.score)}`, 20, 30);
        this.ctx.fillText(`HI: ${this.highScore}`, 20, 55);

        if (this.isSlowMoActive) {
            this.ctx.fillStyle = '#3f3';
            this.ctx.fillText('SLOW-MO!', 20, 80);
        }
    }

    renderOverlay(title, subtitle, extra = '') {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#00ffcc';
        this.ctx.font = '40px monospace';
        this.ctx.fillText(title, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px monospace';
        this.ctx.fillText(subtitle, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
        
        if (extra) {
            this.ctx.font = '16px monospace';
            this.ctx.fillText(extra, CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 40);
        }
    }
}
