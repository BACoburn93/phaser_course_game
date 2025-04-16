import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        // this.cameras.main.setBackgroundColor(0x00ff00);

        // const config = this.data.get('config');
        // console.log(config);

        const centerPosX = Math.min(document.body.offsetWidth / 2, 800);

        this.add.image(centerPosX, 384, 'background').setAlpha(0.5);

        this.add.text(centerPosX, 384, 'Ready to Play?\n\nClick Next Scene to Test the Game!', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('Play');
    }
}
