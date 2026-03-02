import { ALIEN_COLS, ALIEN_ROWS, ALIEN_H_STEP, ALIEN_V_STEP, ALIEN_MARCH_INTERVAL_MS, CANVAS_WIDTH } from "../constants.js";
import { Alien } from "./Alien.js";
import { Bullet } from "./Bullet.js";

export class AlienGrid {
    constructor(game) {
        this.game = game;
        this.aliens = [];
        this.direction = 1; // 1 for right, -1 for left
        this.marchTimer = 0;
        this.marchInterval = ALIEN_MARCH_INTERVAL_MS / 1000; // seconds
        this.animationTimer = 0;
        this.animationInterval = 0.5; // seconds for alien sprite animation
        this.initAliens();
    }

    initAliens() {
        this.aliens = [];
        for (let row = 0; row < ALIEN_ROWS; row++) {
            for (let col = 0; col < ALIEN_COLS; col++) {
                const x = col * (ALIEN_H_STEP + 8) + 30; // 8 is padding
                const y = row * (ALIEN_V_STEP + 8) + 50;  // 8 is padding
                let type;
                if (row === 0) type = 2; // Top row aliens (highest score)
                else if (row < 3) type = 1; // Middle rows
                else type = 0; // Bottom rows
                this.aliens.push(new Alien(this.game, x, y, type));
            }
        }
    }

    update(delta) {
        this.marchTimer += delta;
        this.animationTimer += delta;

        if (this.animationTimer >= this.animationInterval) {
            this.aliens.forEach(alien => alien.toggleFrame());
            this.animationTimer = 0;
        }

        if (this.marchTimer >= this.marchInterval) {
            this.marchTimer = 0;
            let hitEdge = false;
            for (const alien of this.aliens) {
                if (alien.alive) {
                    alien.x += this.direction * ALIEN_H_STEP;
                    if (alien.x + alien.w > CANVAS_WIDTH || alien.x < 0) {
                        hitEdge = true;
                    }
                }
            }

            if (hitEdge) {
                this.direction *= -1; // Flip direction
                for (const alien of this.aliens) {
                    if (alien.alive) {
                        alien.y += ALIEN_V_STEP;
                    }
                }
            }
            this.decreaseMarchInterval();
        }

        // Alien shooting (simplified for now - lowest alien in a random column shoots)
        if (Math.random() < 0.001) { // Small chance to shoot each frame
            const livingAliens = this.getLivingAliens();
            if (livingAliens.length > 0) {
                const shooter = livingAliens[Math.floor(Math.random() * livingAliens.length)];
                this.game.alienBullets.push(new Bullet(this.game, shooter.x + shooter.w / 2 - 1.5, shooter.y + shooter.h, 1)); // direction 1 for downward
            }
        }

    }

    decreaseMarchInterval() {
        const livingAlienCount = this.getLivingAliens().length;
        const initialCount = ALIEN_COLS * ALIEN_ROWS;
        if (livingAlienCount > 0) {
            // Decrease interval as aliens are eliminated
            this.marchInterval = (ALIEN_MARCH_INTERVAL_MS / 1000) * (livingAlienCount / initialCount);
            if (this.marchInterval < 0.1) this.marchInterval = 0.1; // Minimum interval
        }
    }

    getLivingAliens() {
        return this.aliens.filter(alien => alien.alive);
    }

    render(ctx) {
        this.aliens.forEach(alien => alien.render(ctx));
    }
}
