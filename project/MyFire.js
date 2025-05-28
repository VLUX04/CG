import { CGFobject } from "../lib/CGF.js";
import { MyTriangleLayer } from "./MyTriangleLayer.js";

export class MyFire extends CGFobject {
    constructor(scene, flameHeight, flameBase) {
        super(scene);
        this.numFlames = 3;
        this.flameHeight = flameHeight;
        this.flameBase = flameBase;

        this.initBuffers();
    }

    initBuffers() {
        this.layers = [
            { radius: this.flameBase, height: this.flameHeight * 0.5, count: Math.floor(this.numFlames * 2) },
            { radius: this.flameBase * 0.75, height: this.flameHeight * 0.75, count: Math.floor(this.numFlames * 1.5) }
        ];

        this.layerObjects = [];

        for (let l = 0; l < this.layers.length; l++) {
            const layer = this.layers[l];
            const count = layer.count;
            const nSegments = 5;

            let vertices = [];
            let indices = [];
            let texCoords = [];
            let basePoints = [];

            for (let i = 0; i < count; i++) {
                let angle = (2 * Math.PI * i) / count;
                let x = Math.cos(angle) * layer.radius;
                let z = Math.sin(angle) * layer.radius;
                basePoints.push([x, 0, z]);
            }

            for (let i = 0; i < count; i++) {
                const b1 = basePoints[i];
                const b2 = basePoints[(i + 1) % count];

                const xTip = (b1[0] + b2[0]) * 0.5 * 0.6;
                const zTip = (b1[2] + b2[2]) * 0.5 * 0.6;
                const yTip = layer.height;

                for (let j = 0; j < nSegments; j++) {
                    const t0 = j / nSegments;
                    const t1 = (j + 1) / nSegments;

                    const interp0 = [
                        b1[0] * (1 - t0) + xTip * t0,
                        yTip * t0,
                        b1[2] * (1 - t0) + zTip * t0
                    ];
                    const interp1 = [
                        b2[0] * (1 - t0) + xTip * t0,
                        yTip * t0,
                        b2[2] * (1 - t0) + zTip * t0
                    ];
                    const interp2 = [
                        b1[0] * (1 - t1) + xTip * t1,
                        yTip * t1,
                        b1[2] * (1 - t1) + zTip * t1
                    ];
                    const interp3 = [
                        b2[0] * (1 - t1) + xTip * t1,
                        yTip * t1,
                        b2[2] * (1 - t1) + zTip * t1
                    ];

                    const baseIdx = vertices.length / 3;

                    vertices.push(...interp0, ...interp1, ...interp2, ...interp3);
                    indices.push(baseIdx, baseIdx + 2, baseIdx + 1);
                    indices.push(baseIdx + 1, baseIdx + 2, baseIdx + 3);

                    texCoords.push(
                        0, t0,
                        1, t0,
                        0, t1,
                        1, t1
                    );
                }
            }

            this.layerObjects.push(new MyTriangleLayer(this.scene, vertices, indices, texCoords));
        }
    }

    displayLayer(layerIndex) {
        this.layerObjects[layerIndex].display();
    }
}