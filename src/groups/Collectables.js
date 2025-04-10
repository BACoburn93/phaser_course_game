

import Phaser from "phaser";
import Collectable from "../collectables/Collectable";

class Collectables extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createFromConfig({
            classType: Collectable
        })
    }

    mapProperties(propertiesList) {
        if(!propertiesList || propertiesList.length < 1) return;
        
        return propertiesList.reduce((map, obj) => {
            map[obj.name] = obj.value;
            return map;
        }, {})
    }

    addFromLayer(layer) {
        const { score: defaultScore, type } = this.mapProperties(layer.properties);

        layer.objects.forEach((collectableObj) => {
            const collectable = this.get(collectableObj.x, collectableObj.y, type);
            const props = this.mapProperties(collectableObj.properties);

            if(props) {
                collectable.score = props.score || defaultScore;
            }
        });
    }

}

export default Collectables;