import { CGFobject, CGFappearance, CGFtexture } from "../lib/CGF.js";
import { MyPyramid } from "./MyPyramid.js";

class MyTriangleLayer extends CGFobject {
    constructor(scene, vertices, indices, texCoords) {
        super(scene);
        this.vertices = vertices;
        this.indices = indices;
        this.texCoords = texCoords;
        this.normals = [];
        for (let i = 0; i < vertices.length / 3; i++) this.normals.push(0, 1, 0);
        this.primitiveType = scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}

export class MyFire extends CGFobject {
    constructor(scene, numFlames = 8, flameHeight = 2, flameBase = 0.5) {
        super(scene);
        this.numFlames = numFlames;
        this.flameHeight = flameHeight;
        this.flameBase = flameBase;

        this.yellowFireTexture = new CGFtexture(scene, "textures/yellow_fire.jpg");
        this.orangeFireTexture = new CGFtexture(scene, "textures/orange_fire.jpg");
        this.redFireTexture = new CGFtexture(scene, "textures/red_fire.jpg");

        // Appearances for each layer
        this.outerAppearance = new CGFappearance(scene);
        this.outerAppearance.setAmbient(1.0, 1.0, 0.2, 1.0); // yellow
        this.outerAppearance.setDiffuse(1.0, 1.0, 0.2, 1.0);
        this.outerAppearance.setEmission(1.0, 1.0, 0.2, 1.0);
        this.outerAppearance.setTexture(this.yellowFireTexture);

        this.middleAppearance = new CGFappearance(scene);
        this.middleAppearance.setAmbient(1.0, 0.5, 0.1, 1.0); // orange
        this.middleAppearance.setDiffuse(1.0, 0.5, 0.1, 1.0);
        this.middleAppearance.setEmission(1.0, 0.5, 0.1, 1.0);
        this.middleAppearance.setTexture(this.orangeFireTexture);

        this.innerAppearance = new CGFappearance(scene);
        this.innerAppearance.setAmbient(1.0, 0.1, 0.1, 1.0); // red
        this.innerAppearance.setDiffuse(1.0, 0.1, 0.1, 1.0);
        this.innerAppearance.setEmission(1.0, 0.1, 0.1, 1.0);
        this.innerAppearance.setTexture(this.redFireTexture);

        this.initBuffers();
    }

    initBuffers() {
        // Outer and middle: triangle rings (connected, no random offset)
        this.layers = [
            { radius: this.flameBase, height: this.flameHeight * 0.5, count: Math.floor(this.numFlames * 2) }, 
            { radius: this.flameBase * 0.8, height: this.flameHeight * 0.8, count: Math.floor(this.numFlames * 1.5) }
        ];

        this.layerObjects = [];
        for (let l = 0; l < this.layers.length; l++) {
            const layer = this.layers[l];
            const count = layer.count;

            // Precompute base points and tips
            let basePoints = [];
            let tipPoints = [];
            for (let i = 0; i < count; i++) {
                let angle = (2 * Math.PI * i) / count;
                let x = Math.cos(angle) * layer.radius;
                let z = Math.sin(angle) * layer.radius;
                basePoints.push([x, 0, z]);
            }
            for (let i = 0; i < count; i++) {
                // Tip is above the midpoint between this and next base point
                let b1 = basePoints[i];
                let b2 = basePoints[(i + 1) % count];
                let xTip = (b1[0] + b2[0]) / 2;
                let zTip = (b1[2] + b2[2]) / 2;
                let yTip = layer.height;
                tipPoints.push([xTip, yTip, zTip]);
            }

            // Build triangles
            let vertices = [];
            let indices = [];
            let texCoords = [];
            for (let i = 0; i < count; i++) {
                let base1 = basePoints[i];
                let base2 = basePoints[(i + 1) % count];
                let tip = tipPoints[i];

                let baseIndex = vertices.length / 3;
                vertices.push(...base1, ...base2, ...tip);

                texCoords.push(0, 1, 1, 1, 0.5, 0);

                indices.push(baseIndex, baseIndex + 2, baseIndex + 1);
                indices.push(baseIndex, baseIndex + 1, baseIndex + 2);
            }
            this.layerObjects.push(new MyTriangleLayer(this.scene, vertices, indices, texCoords));
        }

        this.innerPyramid = new MyPyramid(
            this.scene,
            this.numFlames,
            1,
        );
    }

    display() {
        // Outer ring (yellow)
        this.outerAppearance.apply();
        this.layerObjects[0].display();

        // Middle ring (orange)
        this.middleAppearance.apply();
        this.layerObjects[1].display();

        // Inner core (red pyramid)
        this.scene.pushMatrix();
        this.innerAppearance.apply();
        this.scene.scale(this.flameBase * 0.7, this.flameHeight * 0.9, this.flameBase * 0.7);
        this.innerPyramid.display();
        this.scene.popMatrix();
    }
}