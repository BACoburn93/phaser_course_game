



export default (anims, speed) => {
    anims.remove('birdman-idle');
    anims.create({
        key: 'birdman-idle',
        frames: anims.generateFrameNumbers('birdman', {start: 0, end: 12}),
        frameRate: Math.floor(speed / 3),
        repeat: -1
    });
}