const MAP_WIDTH = 1600;
const WIDTH = document.body.offsetWidth;
const HEIGHT = 640;

export const SHARED_CONFIG = {
    mapOffset: MAP_WIDTH > WIDTH ? MAP_WIDTH - WIDTH : 0,
    width: MAP_WIDTH < WIDTH ? MAP_WIDTH : WIDTH,
    height: HEIGHT,
    zoomFactor: 1,
    debug: false
};