

import BaseScene from './BaseScene';

class MenuScene extends BaseScene {

  constructor() {
    super('MenuScene');

    this.menu = [
      {scene: 'Play', text: 'Play'},
      {scene: 'LevelScene', text: 'Levels'},
      {scene: null, text: 'Exit'},
    ]
  }

  create() {
    super.create();

    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
  }

  setupMenuEvents(menuItem) {
    const textGO = menuItem.textGO;
    textGO.setInteractive();

    textGO.on('pointerover', () => {
      textGO.setStyle({fill: '#ff0'});
    })

    textGO.on('pointerout', () => {
      textGO.setStyle({fill: '#713E01'});
    })

    textGO.on('pointerup', () => {
      menuItem.scene && this.scene.start(menuItem.scene);

      if (menuItem.text === 'Exit') {
        this.game.destroy(true);
      }
    })
  }
}

export default MenuScene;