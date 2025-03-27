import Phaser from "phaser";

import Player from "../../entities/Player";
import Enemies from "../../groups/Enemies";
// Birdman
import { SHARED_CONFIG } from "../../globals/sharedConfig";

import initAnims from "../../anims";

export class Play extends Phaser.Scene {

    constructor() {
        super('Play');
    }

    init() {
        this.config = SHARED_CONFIG;
    }

    create() {
        this.cameras.main.setBackgroundColor('000');
        
        const map = this.createMap();
        const layers = this.createLayers(map);
        const playerZones = this.getPlayerZones(layers.playerZones);
        const player = this.createPlayer(playerZones.start);

        const enemies = this.createEnemies(layers.enemySpawns, layers.platformsColliders);

        this.createEnemyColliders(enemies, {
            colliders: {
              platformsColliders: layers.platformsColliders,
              player
            }
        });

        this.createPlayerColliders(player, {
            colliders: {
                platformsColliders: layers.platformsColliders
            }
        });

        this.createEndOfLevel(playerZones.end, player);
        this.setupFollowupCameraOn(player);
        initAnims(this.anims);

        this.plotting = false;

    }

    finishDrawing(pointer, layer) {
        this.line.x2 = pointer.worldX;
        this.line.y2 = pointer.worldY;

        this.graphics.clear();
        this.graphics.strokeLineShape(this.line);

        this.tileHeats = layer.getTilesWithinShape(this.line);

        if(this.tileHeats.length > 0) {
            this.tileHeats.forEach(tile => {
                tile.index !== -1 && tile.setCollision(true);
            })
        }

        this.drawDebug(layer);

        this.plotting = false;
    }

    createMap() {
        const map = this.make.tilemap({key: 'map'});

        map.addTilesetImage('main_lev_build_1', 'tiles-1');
        // map.addTilesetImage('main_lev_build_2', 'tiles-2');
        map.addTilesetImage('Michael', 'tiles-3');

        return map;
    }

    createLayers(map) {
        const tileset = map.getTileset('main_lev_build_1');
        const tilesetBg = map.getTileset('Michael');

        const background = map.createLayer('background', tilesetBg);
        const platformsColliders = map.createLayer('platform_colliders', tileset);
        const environment = map.createLayer('environment', tileset);
        const platforms = map.createLayer('platforms', tileset);
        
        const playerZones = map.getObjectLayer('player_zones');
        const enemySpawns = map.getObjectLayer('enemy_spawns');
    
        // platformsColliders.setCollisionByExclusion(-1, true);

        // After creating custom property for tiles used on the platformsColliders tile layer
        platformsColliders.setCollisionByProperty({ collides: true });

        return { platformsColliders, environment, platforms, background, playerZones, enemySpawns };
    }

    createPlayer(startZone) {
        return new Player(this, startZone.x, startZone.y);
    }

    createPlayerColliders(player, { colliders }) {
        player
            .addCollider(colliders.platformsColliders);
    }

    onPlayerCollision(enemy, player) {
        player.takesHit(enemy);
    }

    onWeaponHit(entity, source) {
        entity.takesHit(source);
    }

    createEnemyColliders(enemies, { colliders }) {
        enemies
            .addCollider(colliders.platformsColliders)
            .addCollider(colliders.player, this.onPlayerCollision)
            .addCollider(colliders.player.projectiles, this.onWeaponHit)
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