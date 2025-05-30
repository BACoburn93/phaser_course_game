import Phaser from "phaser";

import collidable from "../mixins/collidable.js";
import anims from '../mixins/anims.js';

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.config = scene.config;

        // Mixins
        Object.assign(this, collidable);
        Object.assign(this, anims);

        // Initialize methods
        this.init();
        this.initEvents();
    }

    init() {
        this.gravity = 150;
        this.speed = 30;
        this.platformCollidersLayer = null;
        this.currentPatrolDistance = 0;
        this.maxPatrolDistance = 300;

        this.health = 20;
        this.damage = 20;

        this.offsetX = 5;
        this.offsetY = 22;
        this.timeFromPrevTurn = 0;

        this.rayGraphics = this.scene.add.graphics({lineStyle: {width: 2, color: 0xaa00aa}});

        this.body.setGravityY(this.gravity);
        this.setSize(this.width - this.offsetX * 2, this.height - this.offsetY);
        this.setOffset(this.offsetX, this.offsetY);
        this.setCollideWorldBounds(true);
        this.setOrigin(0.5, 1);
        this.setImmovable(true);
        this.setVelocityX(this.speed);
    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {
        if(this.getBounds().bottom > 600) {
            this.scene.events.removeListener(Phaser.Scenes.Events.UPDATE, this.update, this);
            this.setActive(false);
            this.rayGraphics.clear();
            this.destroy();
            return;
        }

        this.patrol(time);
    }

    patrol(time) {
        if(!this.body) {  return; }

        const { ray, hasHit } = this.raycast(this.body, this.platformCollidersLayer, 
            { steepness: 0.1 });

        this.currentPatrolDistance += Math.abs(this.body.deltaX());
        const hasReachMaximumDistance = this.currentPatrolDistance >= this.maxPatrolDistance;

        if((!hasHit || hasReachMaximumDistance) && (time > this.timeFromPrevTurn + 100)) {
            this.setFlipX(!this.flipX);
            this.setVelocityX(this.speed = -this.speed);
            this.timeFromPrevTurn = time;
            this.currentPatrolDistance = 0;
        }

        if(this.config.debug === true) {
            this.rayGraphics.clear();
            this.rayGraphics.strokeLineShape(ray);
        }
    }

    setPlatformColliders(platformCollidersLayer) {
        this.platformCollidersLayer = platformCollidersLayer;
    }

    // Enemy is source of damage for player in Player.takesHit()
    deliversHit() {}

    takesHit(source) {
        source.deliversHit(this);
        this.health -= source.damage;
        
        if(this.health <= 0) {
            this.setTint(0xff0000);
            this.setVelocity(0, -200);
            this.body.checkCollision.none = true;
            this.setCollideWorldBounds(false);
        }
    }
}

export default Enemy;