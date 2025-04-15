import Phaser from 'phaser';

import { SHARED_CONFIG } from '../../globals/sharedConfig';

class BaseScene extends Phaser.Scene {

  constructor(key) {
    super(key);
    this.config = SHARED_CONFIG;
    this.screenCenter = [SHARED_CONFIG.width / 2, SHARED_CONFIG.height / 2];
    this.fontSize = 75;
    this.lineHeight = 82;
    this.fontOptions = {fontSize: `${this.fontSize}px`, fill: '#713E01'};
  }

  create() {
    this.add.image(0, 0, 'menu-bg')
      .setOrigin(0)
      .setScale(4);

    if (this.config.canGoBack) {
      const backButton = this.add.image(this.SHARED_CONFIG.width - 10, this.SHARED_CONFIG.height -10, 'back')
        .setOrigin(1)
        .setScale(2)
        .setInteractive()

      backButton.on('pointerup', () => {
        this.scene.start('MenuScene');
      })
    }
  }

  createMenu(menu, setupMenuEvents) {
    let lastMenuPositionY = 0;

    menu.forEach(menuItem => {
      const menuPosition = [this.screenCenter[0], this.screenCenter[1] + lastMenuPositionY];
      menuItem.textGO = this.add.text(...menuPosition, menuItem.text, this.fontOptions).setOrigin(0.5, 1);
      lastMenuPositionY += this.lineHeight;
      setupMenuEvents(menuItem);
    })
  }
}

export default BaseScene;