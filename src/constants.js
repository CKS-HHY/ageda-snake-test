export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 800;
export const CENTER_X = CANVAS_WIDTH / 2;
export const CENTER_Y = CANVAS_HEIGHT / 2;

export const ORBIT_RADII = [80, 160, 240];
export const PLAYER_SIZE = 6;
export const PLAYER_BASE_SPEEDS = [0.04, 0.02, 0.013]; // Radians per frame (60fps)

export const METEOR_BASE_SPEED = 2;
export const METEOR_SPAWN_INTERVAL = 1500; // ms

export const SWITCH_COOLDOWN = 200; // ms
export const SLOW_TIME_DURATION = 2000; // ms
export const NEAR_MISS_THRESHOLD = 30; // pixels

export const GAME_STATE = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    GAME_OVER: 'GAME_OVER'
};
