const MAP_WIDTH = 1600;
const WIDTH = window.innerWidth;
const HEIGHT = Math.min(640, window.innerHeight);
const ZOOM_FACTOR = 2;

const zoomedWidth = WIDTH / ZOOM_FACTOR;
const zoomedHeight = HEIGHT / ZOOM_FACTOR;

const offsetX = (WIDTH - zoomedWidth) / 1.9;
const offsetY = (HEIGHT - zoomedHeight) / 1.9;

export const SHARED_CONFIG = {
    canGoBack: false,
    mapOffset: MAP_WIDTH > WIDTH ? MAP_WIDTH - WIDTH : 0,
    width: MAP_WIDTH < WIDTH ? MAP_WIDTH : WIDTH,
    height: HEIGHT,
    zoomFactor: ZOOM_FACTOR,
    debug: false,

    topLeftCorner: {
        x: offsetX,
        y: offsetY,
    },

    topRightCorner: {
        x: offsetX + zoomedWidth,
        y: offsetY,
    },

    bottomRightCorner: {
        x: offsetX + zoomedWidth,
        y: offsetY + zoomedHeight,
    },
};