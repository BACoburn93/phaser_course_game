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

        initAnims(this.anims);

        const layers = this.createLayers(map);
        const playerZones = this.getPlayerZones(layers.playerZones);
        const player = this.createPlayer(playerZones.start);
        const collectables = this.createCollectables(layers.collectables);

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
            }
        });

        this.createEndOfLevel(playerZones.end, player);
        this.setupFollowupCameraOn(player);

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

        const background = map.createLayer('background', tilesetBg).setDepth(-999);
        const platformsColliders = map.createLayer('platform_colliders', tileset);
        const environment = map.createLayer('environment', tileset).setDepth(-2);
        const platforms = map.createLayer('platforms', tileset);
        
        const playerZones = map.getObjectLayer('player_zones');
        const enemySpawns = map.getObjectLayer('enemy_spawns');
        const collectables = map.getObjectLayer('collectables');
    
        // platformsColliders.setCollisionByExclusion(-1, true);

        // After creating custom property for tiles used on the platformsColliders tile layer
        platformsColliders.setCollisionByProperty({ collides: true });

        return { 
            platformsColliders, 
            environment, 
            platforms, 
            background, 
            playerZones, 
            enemySpawns, 
            collectables, 
        };
    }

    createCollectables(collectableLayer) {
        const collectables = this.physics.add.group();

        collectableLayer.objects.forEach((collectableObj) => {
            collectables.get(collectableObj.x, collectableObj.y, 'diamond').setDepth(-1);
        });

        collectables.playAnimation('diamond-shine');

        return collectables;
    }

    createPlayer(startZone) {
        return new Player(this, startZone.x, startZone.y);
    }

    createPlayerColliders(player, { colliders }) {
        player
            .addCollider(colliders.platformsColliders)
            .addCollider(colliders.projectiles, this.onWeaponHit)
            .addCollider(colliders.collectables, this.onCollect)
    }

    onPlayerCollision(enemy, player) {
        player.takesHit(enemy);
    }

    onWeaponHit(entity, source) {
        entity.takesHit(source);
    }

    onCollect(entity, collectable) {
        // disableGameObject -> deactivates object - default: false
        // hideGameObject -> Hide game object. Default: false
        collectable.disableBody(true, true);
    }

    createEnemyColliders(enemies, { colliders }) {
        enemies
            .addCollider(colliders.platformsColliders)
            .addCollider(colliders.player, this.onPlayerCollision)
            .addCollider(colliders.player.projectiles, this.onWeaponHit)
            .addOverlap(colliders.player.meleeWeapon, this.onWeaponHit)
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