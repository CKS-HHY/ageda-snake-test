export class GameLoop {
    constructor(updateFn, renderFn) {
        this.updateFn = updateFn;
        this.renderFn = renderFn;
        this.lastFrameTimeMs = 0;
        this.running = false;
        this.rafHandle = null;
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.rafHandle = requestAnimationFrame(this._tick.bind(this));
        }
    }

    stop() {
        if (this.running) {
            this.running = false;
            cancelAnimationFrame(this.rafHandle);
        }
    }

    _tick(timestamp) {
        if (!this.running) return;
        const delta = (timestamp - this.lastFrameTimeMs) / 1000;
        this.lastFrameTimeMs = timestamp;

        this.updateFn(delta);
        this.renderFn();

        this.rafHandle = requestAnimationFrame(this._tick.bind(this));
    }
}
