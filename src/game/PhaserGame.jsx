import PropTypes from 'prop-types';
import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';

export const PhaserGame = forwardRef(function PhaserGame ({ currentActiveScene, changeScene }, ref)
{
    const game = useRef();

    // Create the game inside a useLayoutEffect hook to avoid the game being created outside the DOM
    useLayoutEffect(() => {
        
        if (game.current === undefined)
        {
            game.current = StartGame("game-container");
            
            if (ref !== null)
            {
                ref.current = { game: game.current, scene: null };
            }
        }

        return () => {

            if (game.current)
            {
                game.current.destroy(true);
                game.current = undefined;
            }

        }
    }, [ref]);

    useEffect(() => {

        EventBus.on('current-scene-ready', (currentScene) => {

            if (currentActiveScene instanceof Function)
            {
                currentActiveScene(currentScene);
            }
            ref.current.scene = currentScene;
            
        });

        return () => {

            EventBus.removeListener('current-scene-ready');

        }
        
    }, [currentActiveScene, ref])
    

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div id="game-container" style={{margin: '100px'}}></div>
        </div>
        
    );

});

// Props definitions
PhaserGame.propTypes = {
    currentActiveScene: PropTypes.func 
}
