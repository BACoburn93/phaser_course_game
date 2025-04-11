import Phaser from "phaser";

import Player from "../../entities/Player";
import Enemies from "../../groups/Enemies";
import Collectables from "../../groups/Collectables";
import Hud from "../../hud";
import EventEmitter from "../../events/Emitter.js"

import { SHARED_CONFIG } from "../../globals/sharedConfig";

import initAnims from "../../anims";

export class Play extends Phaser.Scene {

    constructor() {
        super('Play');
    }

    init() {
        this.config = SHARED_CONFIG;
    }

    create({gameStatus}) {
        this.cameras.main.setBackgroundColor('000');
        
        this.score = 0;
        this.hud = new Hud(this, 0, 0);

        const map = this.createMap();

        initAnims(this.anims);

        const layers = this.createLayers(map);
        const playerZones = this.getPlayerZones(layers.playerZones);
        const player = this.createPlayer(playerZones.start);
        const collectables = this.createCollectables(layers.collectables);

        this.createBG(map);

        const enemies = this.createEnemies(layers.enemySpawns, layers.platformsColliders);

        this.createEnemyColliders(enemies, {
            colliders: {
              platformsColliders: layers.platformsColliders,
              player
            }
        });

        this.createPlayerColliders(player, {
            colliders: {
                platformsColliders: layers.platformsColliders,
                projectiles: enemies.getProjectiles(),
                collectables: collectables,
                traps: layers.traps
            }
        });

        this.createEndOfLevel(playerZones.end, player);
        this.setupFollowupCameraOn(player);
        this.plotting = false;

        if(gameStatus === 'PLAYER_LOSE') return;

        this.createGameEvents();

    }

    createBG(map) {
        const bgObj = map.getObjectLayer('distance_bg').objects[0];
        this.add.tileSprite(bgObj.x, bgObj.y, SHARED_CONFIG.width, bgObj.height, 'bg-spikes-dark')
            .setOrigin(0, 1)
            .setDepth(-1000)
            .setScrollFactor(0.1, 0.95)
    }

    createMap() {
        const map = this.make.tilemap({key: 'map'});

        map.addTilesetImage('main_lev_build_1', 'tiles-1');
        // map.addTilesetImage('main_lev_build_2', 'tiles-2');

        return map;
    }

    createLayers(map) {
        const tileset = map.getTileset('main_lev_build_1');
        // const tilesetBg = map.getTileset('Michael');

        // const background = map.createLayer('background', tilesetBg).setDepth(-999);
        const platformsColliders = map.createLayer('platform_colliders', tileset);
        const environment = map.createLayer('environment', tileset).setDepth(-2);
        const platforms = map.createLayer('platforms', tileset);
        const traps = map.createLayer('traps', tileset);
        
        const playerZones = map.getObjectLayer('player_zones');
        const enemySpawns = map.getObjectLayer('enemy_spawns');
        const collectables = map.getObjectLayer('collectables');
    
        // platformsColliders.setCollisionByExclusion(-1, true);

        // After creating custom property for tiles used on the platformsColliders tile layer
        platformsColliders.setCollisionByProperty({ collides: true });
        traps.setCollisionByExclusion(-1);

        return { 
            platformsColliders, 
            environment, 
            platforms, 
            // background, 
            playerZones, 
            enemySpawns, 
            collectables, 
            traps, 
        };
    }

    createGameEvents() {
        EventEmitter.on('PLAYER_LOSE', () => {
            this.scene.restart({
                gameStatus: 'PLAYER_LOSE'
            });
        })
    }

    createCollectables(collectableLayer) {
        const collectables = new Collectables(this).setDepth(-1);

        collectables.addFromLayer(collectableLayer);
        collectables.playAnimation('diamond-shine');

        return collectables;
    }

    createPlayer(startZone) {
        return new Player(this, startZone.x, startZone.y);
    }

    createPlayerColliders(player, { colliders }) {
        player
            .addCollider(colliders.platformsColliders)
            .addCollider(colliders.projectiles, this.onHit)
            .addCollider(colliders.traps, this.onHit)
            .addCollider(colliders.collectables, this.onCollect, this)
    }

    onPlayerCollision(enemy, player) {
        player.takesHit(enemy);
    }

    onHit(entity, source) {
        entity.takesHit(source);
    }

    onCollect(entity, collectable) {
        collectable.disableBody(true, true);
        this.score += collectable.score;
        this.hud.updateScoreboard(this.score);
    }

    createEnemyColliders(enemies, { colliders }) {
        enemies
            .addCollider(colliders.platformsColliders)
            .addCollider(colliders.player, this.onPlayerCollision)
            .addCollider(colliders.player.projectiles, this.onHit)
            .addOverlap(colliders.player.meleeWeapon, this.onHit)
    }

    setupFollowupCameraOn(player) {
        const {height, width, mapOffset, zoomFactor} = this.config;

        this.physics.world.setBounds(0, 0, width + mapOffset, height + 200);
        this.cameras.main.setBounds(0, 0, width + mapOffset, height).setZoom(zoomFactor);
        this.cameras.main.startFollow(player);
    }

    getPlayerZones(playerZonesLayer) {
        const playerZones = playerZonesLayer.objects;

        return {
            start: playerZones.find(zone => zone.name === "startZone"),
            end: playerZones.find(zone => zone.name === "endZone"),
        }
    }

    createEnemies(enemySpawnsPoints, platformColliders) {
        const enemies = new Enemies(this);
        const enemyTypes = enemies.getTypes();
        
        enemySpawnsPoints.objects.forEach((spawnPoint, idx) => {
            // if(idx === 0) {
                const enemy = new enemyTypes[spawnPoint.type](this, spawnPoint.x, spawnPoint.y);
                enemy.setPlatformColliders(platformColliders);
                enemies.add(enemy);
            // }

        })

        return enemies;
    }

    createEndOfLevel(endZone, player) {
        const endOfLevel = this.physics.add.sprite(endZone.x, endZone.y, 'end')
            .setGravityY(-this.physics.config.gravity.y)
            .setAlpha(0)
            .setSize(5, this.config.height)
            .setOrigin(0.5, 1);

            const eolOverlap = this.physics.add.overlap(player, endOfLevel, () => {
                eolOverlap.active = false;
                console.log("Player has won!");
            });
    }
     
    changeScene ()
    {
        this.scene.start('GameOver');
    }
}