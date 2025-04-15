import Phaser from "phaser";

import { SHARED_CONFIG } from "../globals/sharedConfig";

class HealthBar {
    constructor(scene, x, y, health) {
        this.bar = new Phaser.GameObjects.Graphics(scene);

        // Lock to screen
        this.bar.setScrollFactor(0, 0);

        // Position the graphics object directly
        this.bar.setPosition(x, y);

        this.value = health;

        this.size = {
            width: 200 / SHARED_CONFIG.zoomFactor,
            height: 20 / SHARED_CONFIG.zoomFactor,
        }

        this.pixelPerHealth = this.size.width / this.value;

        scene.add.existing(this.bar);
        this.draw();
    }

    decrease(amount) {
        this.value = Math.max(0, this.value - amount);
        this.draw();
    }

    draw() {
        this.bar.clear();

        const margin = 2 / SHARED_CONFIG.zoomFactor;
        const { width, height } = this.size;

        this.bar.fillStyle(0x9B00FF);
        this.bar.fillRect(0, 0, width + margin, height + margin);

        this.bar.fillStyle(0xFFFFFF);
        this.bar.fillRect(margin, margin, width - margin, height - margin);

        const healthWidth = Math.floor(this.value * this.pixelPerHealth);

        if (healthWidth > 0) {
            if (healthWidth <= width / 4) {
                this.bar.fillStyle(0xFF0000);
            } else if (healthWidth <= width / 2) {
                this.bar.fillStyle(0xFFFF00);
            } else {
                this.bar.fillStyle(0x00FF00);
            }

            this.bar.fillRect(margin, margin, healthWidth - margin, height - margin);
        }
    }
}

export default HealthBar;