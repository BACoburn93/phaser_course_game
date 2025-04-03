
import Enemy from "./Enemy";

import initAnims from './anims/snakyAnims'

class Snaky extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'snaky');

        initAnims(scene.anims, this.speed);
    }

    init() {
        super.init();
        this.speed = 25;
        this.setSize(13, 55);
        this.setOffset(8, 10);
    }

    update(time, delta) {   
        super.update(time, delta);
        
        if(!this.active) return;

        const onFloor = this.body.onFloor();

        onFloor && !this.isPlayingAnims('snaky-hurt') && this.play('snaky-idle', true);
    }

    takesHit(source) {
        super.takesHit(source);
        this.play('snaky-hurt', true);
    }
}

export default Snaky;