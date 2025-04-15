// const MAP_WIDTH = 1600;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const ZOOM_FACTOR = 2;

const zoomedWidth = WIDTH / ZOOM_FACTOR;
const zoomedHeight = HEIGHT / ZOOM_FACTOR;

const offsetX = (WIDTH - zoomedWidth) / 1.9;
const offsetY = (HEIGHT - zoomedHeight) / 1.9;

export const SHARED_CONFIG = {
    mapOffset: 100,
    width: WIDTH,
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
};