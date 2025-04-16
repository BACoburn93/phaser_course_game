



import { SHARED_CONFIG } from '../../globals/sharedConfig';
import BaseScene from './BaseScene';
import { playerScore } from '../../globals/score';

class CreditsScene extends BaseScene {

    constructor() {
        super('CreditsScene');
        this.config = { ...SHARED_CONFIG, canGoBack: true };

        this.menu = [
            {scene: null, text: 'Thanks for playing!!! :)'},
            {scene: null, text: `Total Score: ${playerScore.total}`},
            {scene: null, text: 'Author: Brandon'},
        ]
    }


    create() {
        super.create();
        
        this.menu = [
            {scene: null, text: 'Thanks for playing!!! :)'},
            {scene: null, text: `Total Score: ${playerScore.total}`}, 
            {scene: null, text: 'Author: Brandon'},
        ];
        
        this.createMenu(this.menu, () => { });
    }

}

export default CreditsScene;