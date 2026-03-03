// src/constants.js
export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 600;
export const CENTER_X = CANVAS_WIDTH / 2;
export const CENTER_Y = CANVAS_HEIGHT / 2;

export const ORBIT_RADII = [80, 150, 220]; // Inner, Middle, Outer
export const PLAYER_BASE_SPEEDS = [0.06, 0.045, 0.035]; // Radians per frame
export const PLAYER_SIZE = 8;
export const SWITCH_COOLDOWN = 200; // ms

export const METEOR_SPAWN_INTERVAL = 2000; // ms
export const SLOW_TIME_DURATION = 2000; // ms
export const NEAR_MISS_THRESHOLD = 30; // Extra distance for near-miss

export const GAME_STATE = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    GAME_OVER: 'GAME_OVER'
};
