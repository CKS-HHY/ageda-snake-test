// src/utils.js

export function collisionDetect(ball, obj) {
    // Simple AABB collision detection
    const ballLeft = ball.position.x - ball.size / 2;
    const ballRight = ball.position.x + ball.size / 2;
    const ballTop = ball.position.y - ball.size / 2;
    const ballBottom = ball.position.y + ball.size / 2;

    const objLeft = obj.position.x;
    const objRight = obj.position.x + obj.width;
    const objTop = obj.position.y;
    const objBottom = obj.position.y + obj.height;

    return ballRight > objLeft && ballLeft < objRight &&
           ballBottom > objTop && ballTop < objBottom;
}

export function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

