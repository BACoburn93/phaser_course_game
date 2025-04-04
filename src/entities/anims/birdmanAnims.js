



export default (anims, speed) => {
    anims.create({
        key: 'birdman-idle',
        frames: anims.generateFrameNumbers('birdman', {start: 0, end: 12}),
        frameRate: Math.floor(speed / 3),
        repeat: -1
    });
    
    anims.create({
        key: 'birdman-hurt',
        frames: anims.generateFrameNumbers('birdman', {start: 25, end: 26}),
        frameRate: Math.floor(speed / 3),
        repeat: 0
    });
}