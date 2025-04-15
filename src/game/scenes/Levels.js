

import BaseScene from './BaseScene';
import { SHARED_CONFIG } from '../../globals/sharedConfig';

class LevelScene extends BaseScene {

  constructor() {
    super('LevelScene');

    this.config = {...SHARED_CONFIG, canGoBack: true}


  }

  create() {
    super.create();

    this.menu = [];
    const unlockedLevels = this.registry.get('unlocked-levels');

    for(let i = 1; i <= unlockedLevels; i++) {
        this.menu.push({
            scene: 'Play', text: `Level ${i}`, level: i
        })
    }

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
      

      if(menuItem.scene) {
        this.registry.set('level', menuItem.level);
        this.scene.start(menuItem.scene);
      }

      if (menuItem.text === 'Exit') {
        this.game.destroy(true);
      }
    })
  }
}

export default LevelScene;