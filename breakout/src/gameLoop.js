// src/gameLoop.js

export class GameLoop {
    constructor(update, render) {
        this.lastFrameTimeMs = 0;
        this.maxFPS = 60;
        this.delta = 0;
        this.timestep = 1000 / this.maxFPS;
        this.update = update;
        this.render = render;
        this.rafHandle = null;
    }

    start() {
        if (!this.rafHandle) {
            this.rafHandle = requestAnimationFrame(this.mainLoop.bind(this));
        }
    }

    stop() {
        if (this.rafHandle) {
            cancelAnimationFrame(this.rafHandle);
            this.rafHandle = null;
            this.lastFrameTimeMs = 0;
        }
    }

    mainLoop(timestamp) {
        if (this.lastFrameTimeMs === 0) this.lastFrameTimeMs = timestamp;
        this.delta = timestamp - this.lastFrameTimeMs;
        this.lastFrameTimeMs = timestamp;

        let numUpdateSteps = 0;
        while (this.delta >= this.timestep) {
            this.update(this.timestep / 1000); // Convert to seconds
            this.delta -= this.timestep;
            numUpdateSteps++;
            if (numUpdateSteps >= 240) { // Safety break to prevent freezing
                this.delta = 0;
                break;
            }
        }

        this.render();
        this.rafHandle = requestAnimationFrame(this.mainLoop.bind(this));
    }
}
