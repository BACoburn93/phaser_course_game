import Phaser from "phaser";

class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.speed = 300;
        this.maxDistance = 700;
        this.travelDistance = 0;
        this.cooldown = 500;

        this.damage = 10;

    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        this.travelDistance += this.body.deltaAbsX();

        if(this.isOutOfRange()) {
            this.body.reset(0, 0);
            this.activateProjectile(false);
            this.travelDistance = 0;
        }
    }
 
    fire(x, y) {
        this.activateProjectile(true);
        this.body.reset(x, y);
        this.setVelocity(this.speed, 0);
    }

    deliversHit(target) {
        this.activateProjectile(false);
        this.travelDistance = 0;
        this.body.reset(0, 0);
    }

    activateProjectile(isActive) {
        this.setActive(isActive);
        this.setVisible(isActive);
    }

    isOutOfRange() {
        return this.travelDistance &&
            this.travelDistance >= this.maxDistance;
    }
}

export default Projectile;