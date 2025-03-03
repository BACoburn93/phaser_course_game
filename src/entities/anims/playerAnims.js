

export default (anims, playerSpeed) => {
    anims.create({
        key: 'idle',
        frames: anims.generateFrameNumbers('player', {start: 0, end: 8}),
        frameRate: Math.floor(playerSpeed / 20),
        repeat: -1
    });

    anims.create({
        key: 'run',
        frames: anims.generateFrameNumbers('player', {start: 11, end: 16}),
        frameRate: Math.floor(playerSpeed / 20),
        repeat: -1
    });

    anims.create({
        key: 'jump',
        frames: anims.generateFrameNumbers('player', {start: 17, end: 21}),
        frameRate: Math.floor(playerSpeed / 25),
        repeat: 0
    });
}