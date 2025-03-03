
import Enemy from "./Enemy";

import initAnims from './anims/birdmanAnims'

class Birdman extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'birdman');

        initAnims(scene.anims, this.speed);
    }

    update(time, delta) {   
        super.update(time, delta);
        const onFloor = this.body.onFloor();

        // this.setVelocityX(this.speed);
        onFloor && this.play('birdman-idle', true);
    }
}

export default Birdman;