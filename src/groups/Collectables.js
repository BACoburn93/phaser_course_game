

import Phaser from "phaser";
import Collectable from "../collectables/collectable";

class Collectables extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createFromConfig({
            classType: Collectable
        })
    }

}

export default Collectables;