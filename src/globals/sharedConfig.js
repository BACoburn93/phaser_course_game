const MAP_WIDTH = 1600;
const WIDTH = document.body.offsetWidth;
const HEIGHT = 640;
const ZOOM_FACTOR = 2;

export const SHARED_CONFIG = {
    mapOffset: MAP_WIDTH > WIDTH ? MAP_WIDTH - WIDTH : 0,
    width: MAP_WIDTH < WIDTH ? MAP_WIDTH : WIDTH,
    height: HEIGHT,
    zoomFactor: ZOOM_FACTOR,
    debug: false,
    topLeftCorner: {
        x: ((WIDTH - (WIDTH / ZOOM_FACTOR)) / 2.35),
        y: ((HEIGHT - (HEIGHT / ZOOM_FACTOR)) / 1.98),
    },
    topRightCorner: {
        x: ((WIDTH / ZOOM_FACTOR) + ((WIDTH - (WIDTH / ZOOM_FACTOR)) / 2)) * 0.78, 
        y: (HEIGHT- (HEIGHT / ZOOM_FACTOR)) / 2 * 1.05,
    }
};