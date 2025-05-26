import { CGFobject } from "../lib/CGF.js";
import { MyTriangleLayer } from "./MyTriangleLayer.js";

export class MyFire extends CGFobject {
    constructor(scene, numFlames, flameHeight, flameBase) {
        super(scene);
        this.numFlames = numFlames;
        this.flameHeight = flameHeight;
        this.flameBase = flameBase;

        this.initBuffers();
    }

    initBuffers() {
        this.layers = [
            { radius: this.flameBase, height: this.flameHeight * 0.5, count: Math.floor(this.numFlames * 2) },
            { radius: this.flameBase * 0.8, height: this.flameHeight * 0.8, count: Math.floor(this.numFlames * 1.5) }
        ];

        this.layerObjects = [];
        for (let l = 0; l < this.layers.length; l++) {
            const layer = this.layers[l];
            const count = layer.count;

            let vertices = [];
            let indices = [];
            let texCoords = [];
            let basePoints = [];
            let tipPoints = [];

            for (let i = 0; i < count; i++) {
                let angle = (2 * Math.PI * i) / count;
                let x = Math.cos(angle) * layer.radius;
                let z = Math.sin(angle) * layer.radius;
                basePoints.push([x, 0, z]);
            }

            for (let i = 0; i < count; i++) {
                let b1 = basePoints[i];
                let b2 = basePoints[(i + 1) % count];
                let xTip = (b1[0] + b2[0]) / 2;
                let zTip = (b1[2] + b2[2]) / 2;
                let yTip = layer.height;
                tipPoints.push([xTip, yTip, zTip]);
            }

            for (let i = 0; i < count; i++) {
                let base1 = basePoints[i];
                let base2 = basePoints[(i + 1) % count];
                let tip = tipPoints[i];
                let baseIndex = vertices.length / 3;
                vertices.push(...base1, ...base2, ...tip);
                texCoords.push(0, 1, 1, 1, 0.5, 0);

                indices.push(baseIndex, baseIndex + 1, baseIndex + 2);
                indices.push(baseIndex, baseIndex + 2, baseIndex + 1);
            }

            this.layerObjects.push(new MyTriangleLayer(this.scene, vertices, indices, texCoords));
        }
    }

    displayLayer(layerIndex) {
        this.layerObjects[layerIndex].display();
    }
}