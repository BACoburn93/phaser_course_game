import Phaser from "phaser";
import initAnimations from './anims/playerAnims.js';

import collidable from "../mixins/collidable.js";

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Mixins
        Object.assign(this, collidable);

        // Initialize methods
        this.init();
        this.initEvents();
    }

    init() {
        this.gravity = 150;
        this.playerSpeed = 150;
        this.jumpCount = 0;
        this.consecutiveJumps = 1;
        this.hasBeenHit = false;
        this.bounceVelocity = 250;
        this.offsetX = 6;
        this.offsetY = 5;
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.setSize(this.width - this.offsetX * 2, this.height - this.offsetY);
        this.setOffset(this.offsetX, this.offsetY);
        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);
        this.setOrigin(0.5, 1);

        initAnimations(this.scene.anims, this.playerSpeed);
    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update() {
        if(this.hasBeenHit) { return };
        const { left, right, up, space } = this.cursors;

        const isArrOfKeysJustDown = (arrOfKeydowns) => {
            let isPressingDown = false;

            arrOfKeydowns.forEach(keyDown => {
                if(Phaser.Input.Keyboard.JustDown(keyDown)) {
                    isPressingDown = true;
                };
            });

            return isPressingDown;
        }

        const isJumpKeyDown = isArrOfKeysJustDown([space, up]);

        const onFloor = this.body.onFloor();

        if(left.isDown) {
            this.setVelocityX(-this.playerSpeed);
            this.setFlipX(true);
        } else if (right.isDown) {
            this.setVelocityX(this.playerSpeed);
            this.setFlipX(false);
        } else {
            this.setVelocityX(0);
        }

        if((isJumpKeyDown) && (onFloor || this.jumpCount < this.consecutiveJumps)) {
            this.setVelocityY(-this.playerSpeed * 1.5);
            this.jumpCount++;
        }

        if(onFloor) {
            this.jumpCount = 0;
        }

        onFloor ? 
            (this.body.velocity.x !== 0 ?
                this.play('run', true) 
                : 
                this.play('idle', true)
            )
            :
            (
                this.play('jump', true)
            )
    }

    playDamageTween() {
        return this.scene.tweens.add({
            targets: this,
            duration: 200,
            repeat: -1,
            tint: [0xff0000, 0xffffff]
        })
    }

    bounceOff() {
        this.body.touching.right ? 
            this.setVelocityX(-this.bounceVelocity)
            :
            this.setVelocityX(this.bounceVelocity)

            setTimeout(() => {
                this.setVelocityY(-this.bounceVelocity);
            }, 0)
    }

    takesHit(initiator) {
        if(this.hasBeenHit) { return; }
        this.hasBeenHit = true;
        this.bounceOff();
        const hitAnim = this.playDamageTween();

        this.scene.time.delayedCall(1000, () => {
            this.hasBeenHit = false
            hitAnim.stop();
            this.clearTint();
        });

        // this.scene.time.addEvent({
        //     delay: 1000,
        //     callback: () => {
        //         this.hasBeenHit = false;
        //     },
        //     loop: false
        // })
    }

}

export default Player;