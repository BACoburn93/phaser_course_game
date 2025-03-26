import Phaser from "phaser";

import collidable from "../mixins/collidable.js";

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.config = scene.config;

        // Mixins
        Object.assign(this, collidable);

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

        this.health = 40;
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

    takesHit(source) {
        this.health -= source.damage;

        source.deliversHit(this);
        
        if(this.health <= 0) {
            console.log("Enemy Terminated");
        }
    }
}

export default Enemy;