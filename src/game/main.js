import Phaser from 'phaser';

import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Play } from './scenes/Play';
import { Preloader } from './scenes/Preloader';

import { SHARED_CONFIG } from '../globals/sharedConfig';

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

const MAP_WIDTH = 1600;

const WIDTH = document.body.offsetWidth;
const HEIGHT = 640;

const Scenes = [
    Boot,
    Preloader,
    MainMenu,
    Game,
    Play,
    GameOver,
];
// const createScene = Scene => new Scene(SHARED_CONFIG);
// const initScenes = () => {
//     return Scenes.map(createScene);
// }

const config = {
    type: Phaser.AUTO,
    ...SHARED_CONFIG,
    parent: 'game-container',
    scene: Scenes,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: SHARED_CONFIG.debug
        }
    }
};

const StartGame = (parent) => {

    return new Phaser.Game({ ...config, parent });

}

export default StartGame;
