import Phaser from "phaser";
import HealthBar from "../hud/HealthBar.js";
import initAnimations from './anims/playerAnims.js';
import anims from '../mixins/anims.js';
import Projectiles from "../abilities/Projectiles.js";
import MeleeWeapon from '../abilities/MeleeWeapon.js';
import { getTimestamp } from "../utils/functions";
import EventEmitter from "../events/Emitter.js";

import { SHARED_CONFIG } from "../globals/sharedConfig.js";

import collidable from "../mixins/collidable.js";

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Mixins
        Object.assign(this, collidable);
        Object.assign(this, anims);

        // Initialize methods
        this.init();
        this.initEvents();
    }

    init() {
        this.gravity = 300;
        this.playerSpeed = 500;
        this.jumpCount = 0;
        this.consecutiveJumps = 1;
        this.hasBeenHit = false;
        this.isProne = false;
        this.bounceVelocity = 250;
        this.offsetX = 6;
        this.offsetY = 5;
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
        this.projectiles = new Projectiles(this.scene, 'iceball');
        this.meleeWeapon = new MeleeWeapon(this.scene, 0, 0, "sword-default");
        this.timeFromLastSwing = null;

        this.health = 300;

        this.hp = new HealthBar(
            this.scene, 
            SHARED_CONFIG.topLeftCorner.x, 
            SHARED_CONFIG.topLeftCorner.y, 
            this.health
        );

        this.setSize(this.width - this.offsetX * 2, this.height - this.offsetY);
        this.setOffset(this.offsetX, this.offsetY);
        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);
        this.setOrigin(0.5, 1);

        initAnimations(this.scene.anims, this.playerSpeed);

        this.handleAttacks();
        this.handleMovements();
    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update() {
        if(this.hasBeenHit || this.isProne || !this.body) { return };

        if(this.getBounds().top > this.scene.config.height) {
            EventEmitter.emit('PLAYER_LOSE');
            return;
        }

        const { left, right, up, down, space } = this.cursors;

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
            this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
            this.setVelocityX(-this.playerSpeed);
            this.setFlipX(true);
        } else if (right.isDown) {
            this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
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

        if(this.isPlayingAnims('throw') || this.isPlayingAnims('prone')) {
            return;
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

    handleAttacks() {
        this.scene.input.keyboard.on('keydown-Q', () => {
            this.play('throw', true);
            this.projectiles.fireProjectile(this, 'iceball');
        })

        this.scene.input.keyboard.on('keydown-E', () => {

            if(this.timeFromLastSwing &&
                this.timeFromLastSwing + this.meleeWeapon.attackSpeed > getTimestamp()) {
                return;
            }

            this.play('throw', true);
            this.meleeWeapon.swing(this);
            this.timeFromLastSwing = getTimestamp();
        })
    }

    handleMovements() {
        this.scene.input.keyboard.on('keydown-DOWN', () => {
            if(!this.body.onFloor()) { return };

            this.body.setSize(this.width, this.height / 2);
            this.setOffset(0, this.height / 2);
            this.setVelocityX(0);
            this.play('prone', true);
            this.isProne = true;
        })
        
        this.scene.input.keyboard.on('keyup-DOWN', () => {
            this.body.setSize(this.width, 38);
            this.setOffset(0, 0);
            this.isProne = false;
        })
        
        this.scene.input.keyboard.on('keyup-C', () => {
            console.log(SHARED_CONFIG);
        })

    }

    playDamageTween() {
        return this.scene.tweens.add({
            targets: this,
            duration: 200,
            repeat: -1,
            tint: [0xff0000, 0xffffff]
        })
    }

    bounceOff(source) {
        if(source.body) {
            this.body.touching.right ? 
                this.setVelocityX(-this.bounceVelocity)
                :
                this.setVelocityX(this.bounceVelocity)

                setTimeout(() => {
                    this.setVelocityY(-this.bounceVelocity);
                }, 0)
        } else {
            this.body.blocked.right ? 
                this.setVelocityX(-this.bounceVelocity)
                :
                this.setVelocityX(this.bounceVelocity)

                setTimeout(() => {
                    this.setVelocityY(-this.bounceVelocity);
                }, 0)
        }


    }

    takesHit(source) {
        if(this.hasBeenHit) { return; }

        const sourceDamage = source.damage || source.properties.damage || 0;

        this.health -= sourceDamage;
        if(this.health <= 0) {
            EventEmitter.emit('PLAYER_LOSE');
            return;
        }

        this.hasBeenHit = true;
        this.bounceOff(source);
        const hitAnim = this.playDamageTween();

        this.hp.decrease(sourceDamage);

        source.deliversHit && source.deliversHit(this);

        this.scene.time.delayedCall(1000, () => {
            this.hasBeenHit = false
            hitAnim.stop();
            this.clearTint();
        });
    }

}

export default Player;