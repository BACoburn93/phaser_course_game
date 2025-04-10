

import Phaser from "phaser";
import { SHARED_CONFIG } from "../globals/sharedConfig";

class Hud extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);

        scene.add.existing(this);

        const { topRightCorner } = SHARED_CONFIG;
        this.setPosition(topRightCorner.x, topRightCorner.y);
        this.setScrollFactor(0);

        this.fontSize = 20;
        this.setupList();
    }

    setupList() {
        const scoreboard = this.createScoreboard();

        this.add([scoreboard]);

        let lineHeight = 0;
        this.list.forEach(item => {
            item.setPosition(item.x, item.y + lineHeight);
            lineHeight += 20;
        })
    }

    createScoreboard() {
        const scoreText = this.scene.add.text(0, 0, '100', {fontSize: `${this.fontSize}px`, fill: '#fff'});
        const scoreImage = this.scene.add.image(scoreText.width + 5, 0, 'diamond')
            .setOrigin(0)
            .setScale(1.3);

        const scoreBoard = this.scene.add.container(0, 0, [scoreText, scoreImage]);

        return scoreBoard;
    }

    updateScoreboard() {

    }
}

export default Hud;