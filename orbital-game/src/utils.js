export function aabbCollides(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const distance_sq = dx * dx + dy * dy;
    const radius_sum = (a.radius || 0) + (b.radius || 0);
    return distance_sq < radius_sum * radius_sum;
}

export function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

export function getCanvasCenter() {
    return { x: 300, y: 300 }; // based on constants
}
