

import Phaser from "phaser";
import { SHARED_CONFIG } from "../globals/sharedConfig";

class Hud extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);

        scene.add.existing(this);

        const { topRightCorner } = SHARED_CONFIG;
        this.setPosition(topRightCorner.x, topRightCorner.y);
        this.setScrollFactor(0);

        this.setupList();
    }

    setupList() {
        this.fontSize = 20;
        const scoreBoard = this.scene.add.text(0, 0, 'Score', {fontSize: `${this.fontSize}px`, fill: '#fff'});
        const scoreBoard2 = this.scene.add.text(0, 0, '0', {fontSize: `${this.fontSize}px`, fill: '#fff'});

        this.add([scoreBoard, scoreBoard2]);

        let lineHeight = 0;
        this.list.forEach(item => {
            item.setPosition(item.x, item.y + lineHeight);
            lineHeight += 20;
        })
    }
}

export default Hud;