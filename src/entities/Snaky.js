
import Enemy from "./Enemy";

import initAnims from './anims/snakyAnims';
import Projectiles from '../abilities/Projectiles.js';

class Snaky extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'snaky');

        initAnims(scene.anims, this.speed);
    }

    init() {
        super.init();
        this.speed = 25;

        this.projectiles = new Projectiles(this.scene, 'fireball-1');
        this.timeFromLastAttack = 0;
        this.attackDelay = this.getAttackDelay();
        this.lastDirection = null;

        this.setSize(13, 55);
        this.setOffset(8, 10);
    }

    update(time, delta) {   
        super.update(time, delta);
        
        if(!this.active) return;

        if(this.timeFromLastAttack + this.attackDelay <= time) {
            this.projectiles.fireProjectile(this, 'fireball');

            this.timeFromLastAttack = time;
            this.attackDelay = this.getAttackDelay();
        }

        if(this.body.velocity.x > 0) {
            this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
        } else {
            this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
        }

        const onFloor = this.body.onFloor();

        onFloor && !this.isPlayingAnims('snaky-hurt') && this.play('snaky-idle', true);
    }

    getAttackDelay() {
        return Phaser.Math.Between(500, 1000);
    }

    takesHit(source) {
        super.takesHit(source);
        this.play('snaky-hurt', true);
    }
}

export default Snaky;