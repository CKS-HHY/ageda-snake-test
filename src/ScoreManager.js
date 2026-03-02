import { LIVES } from "./constants.js";

export class ScoreManager {
    constructor() {
        this.score = 0;
        this.lives = LIVES;
        this.highScore = localStorage.getItem("spaceInvadersHighScore") || 0;
    }

    addScore(points) {
        this.score += points;
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
    }

    loseLife() {
        this.lives--;
    }

    reset() {
        this.score = 0;
        this.lives = LIVES;
    }

    saveHighScore() {
        localStorage.setItem("spaceInvadersHighScore", this.highScore);
    }
}
