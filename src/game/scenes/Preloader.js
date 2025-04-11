import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        // this.add.image(512, 384, 'background');

        // //  A simple progress bar. This is the outline of the bar.
        // this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        // //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        // const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        // //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        // this.load.on('progress', (progress) => {

        //     //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
        //     bar.width = 4 + (460 * progress);

        // });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.tilemapTiledJSON('map', 'crystal_world_map.json');

        this.load.image('tiles-1', 'main_lev_build_1.png');
        this.load.image('tiles-2', 'main_lev_build_2.png');
        this.load.image('bg-spikes-dark', 'bg_spikes_dark.png');

        this.load.image('iceball-1', 'weapons/iceball_001.png');
        this.load.image('iceball-2', 'weapons/iceball_002.png');

        this.load.image('fireball-1', 'weapons/improved_fireball_001.png');
        this.load.image('fireball-2', 'weapons/improved_fireball_002.png');
        this.load.image('fireball-3', 'weapons/improved_fireball_003.png');

        this.load.image('diamond', 'collectables/diamond.png');

        this.load.image('diamond-1', 'collectables/diamond_big_01.png');
        this.load.image('diamond-2', 'collectables/diamond_big_02.png');
        this.load.image('diamond-3', 'collectables/diamond_big_03.png');
        this.load.image('diamond-4', 'collectables/diamond_big_04.png');
        this.load.image('diamond-5', 'collectables/diamond_big_05.png');
        this.load.image('diamond-6', 'collectables/diamond_big_06.png');
        
        this.load.spritesheet('player', 'player/move_sprite_1.png', {
            frameWidth: 32, frameHeight: 38, spacing: 32
        });

        this.load.spritesheet('player-prone', 'player/slide_sheet_2.png', {
            frameWidth: 32, frameHeight: 38, spacing: 32
        });

        this.load.spritesheet('player-throw', 'player/throw_attack_sheet_1.png', {
            frameWidth: 32, frameHeight: 38, spacing: 32
        });

        this.load.spritesheet('birdman', 'enemy/enemy_sheet.png', {
            frameWidth: 32, frameHeight: 64, spacing: 32
        });

        this.load.spritesheet('snaky', 'enemy/enemy_sheet_2.png', {
            frameWidth: 32, frameHeight: 64, spacing: 32
        });

        this.load.spritesheet('hit-sheet', 'weapons/hit_effect_sheet.png', {
            frameWidth: 32, frameHeight: 32
        });

        this.load.spritesheet('sword-default', 'weapons/sword_sheet_1.png', {
            frameWidth: 52, frameHeight: 32, spacing: 16
        });


        
        // Default Phaser App Asset Loaders
        this.load.image('bg', 'bg.png');
        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('Play');
    }
}
