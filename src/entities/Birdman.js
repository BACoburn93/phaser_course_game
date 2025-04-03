
import Enemy from "./Enemy";

import initAnims from './anims/birdmanAnims'

class Birdman extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'birdman');

        initAnims(scene.anims, this.speed);
    }

    init() {
        super.init();
        this.speed = 50;
        this.setSize(this.width - this.offsetX * 2, this.height - this.offsetY);
        this.setOffset(this.offsetX, this.offsetY);
    }

    update(time, delta) {   
        super.update(time, delta);
        
        if(!this.active) return;

        const onFloor = this.body.onFloor();

        // this.setVelocityX(this.speed);
        onFloor && !this.isPlayingAnims('birdman-hurt') && this.play('birdman-idle', true);
    }

    takesHit(source) {
        super.takesHit(source);
        this.play('birdman-hurt', true);
    }
}

export default Birdman;