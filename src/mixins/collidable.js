

export default {
    addCollider(collider, callback, context) {
        this.scene.physics.add.collider(this, collider, callback, null, context || this);
        
        return this;
    },
    addOverlap(collider, callback, context) {
        this.scene.physics.add.overlap(this, collider, callback, null, context || this);
        
        return this;
    },

    bodyPositionDifferenceX: 0,
    prevRay: null,
    prevHasHit: null,

    raycast(body, layer, {raylength = 30, precision = 0, steepness = 1}) {
        const { x, y, width, halfHeight } = body;
        const xPositionMovement = body.x - body.prev.x;
        this.bodyPositionDifferenceX += xPositionMovement;

        if ((Math.abs(this.bodyPositionDifferenceX) <= precision) && this.prevHasHit !== null) {
            return {
                ray: this.prevRay,
                hasHit: this.prevHasHit
            }
        }

        const line = new Phaser.Geom.Line();
        let hasHit = false;

        switch(body.facing) {
            case Phaser.Physics.Arcade.FACING_RIGHT: {
                line.x1 = x + width;
                line.y1 = y + halfHeight;
                line.x2 = line.x1 + raylength * steepness;
                line.y2 = line.y1 + raylength;
            }
            break;
            case Phaser.Physics.Arcade.FACING_LEFT: {
                line.x1 = x;
                line.y1 = y + halfHeight;
                line.x2 = line.x1 - raylength * steepness;
                line.y2 = line.y1 + raylength;
            }
            break;
        };

        const hits = layer.getTilesWithinShape(line);

        if (hits.length > 0) {
            hasHit = this.prevHasHit = hits.some(hit => hit.index !== -1);
        }

        this.prevRay = line;
        this.bodyPositionDifferenceX = 0;

        return { ray: line, hasHit };
    }
}