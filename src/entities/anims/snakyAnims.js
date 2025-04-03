

export default (anims, speed) => {
    anims.create({
        key: 'snaky-idle',
        frames: anims.generateFrameNumbers('snaky', {start: 0, end: 8}),
        frameRate: Math.floor(speed / 3),
        repeat: -1
    });
    
    anims.create({
        key: 'snaky-hurt',
        frames: anims.generateFrameNumbers('snaky', {start: 21, end: 22}),
        frameRate: Math.floor(speed / 3),
        repeat: 0
    });
}