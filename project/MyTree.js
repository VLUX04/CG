import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyPyramid } from "./MyPyramid.js";
import { MyTruncatedCone } from "./MyTruncatedCone.js";

export class MyTree extends CGFobject {
    constructor(scene, inclination, rotationAxis, trunkRadius, treeHeight, canopyColor, trunkTexture, canopyTexture) {
        super(scene);

        this.inclination = inclination; 
        this.rotationAxis = rotationAxis; 
        this.trunkRadius = trunkRadius; 
        this.treeHeight = treeHeight;
        this.canopyColor = canopyColor; 

        this.trunkHeight = 0.2 * this.treeHeight; 
        this.canopyHeight = 0.8 * this.treeHeight * 2;
        this.numPyramids = Math.ceil(this.canopyHeight/1.3);
        this.pyramidBaseRadius = this.trunkRadius * 1.5;

        this.trunkMaterial = new CGFappearance(scene);
        this.trunkMaterial.setAmbient(0.4, 0.2, 0.1, 1);
        this.trunkMaterial.setDiffuse(0.6, 0.3, 0.15, 1);
        this.trunkMaterial.setSpecular(0.1, 0.05, 0.025, 1);
        this.trunkMaterial.setShininess(10.0);
        this.trunkMaterial.loadTexture(trunkTexture);
        this.trunkMaterial.setTextureWrap("REPEAT", "REPEAT");

        this.canopyMaterial = new CGFappearance(scene);
        this.canopyMaterial.setAmbient(canopyColor[0], canopyColor[1], canopyColor[2], 1);
        this.canopyMaterial.setDiffuse(canopyColor[0], canopyColor[1], canopyColor[2], 1);
        this.canopyMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.canopyMaterial.setShininess(10.0);
        this.canopyMaterial.loadTexture(canopyTexture);
        this.canopyMaterial.setTextureWrap("REPEAT", "REPEAT");

        this.trunk = new MyTruncatedCone(scene, this.trunkHeight, trunkRadius);
        this.canopy = new MyPyramid(scene, 7, 1); 
    }

    display() {
        this.scene.pushMatrix();
        if (this.rotationAxis === "X") {
            this.scene.rotate((this.inclination * Math.PI) / 180, 1, 0, 0);
        } else if (this.rotationAxis === "Z") {
            this.scene.rotate((this.inclination * Math.PI) / 180, 0, 0, 1);
        }

        this.scene.pushMatrix();
        this.trunkMaterial.apply();
        this.scene.scale(this.trunkRadius, 1, this.trunkRadius);
        this.trunk.display();
        this.scene.popMatrix();

        this.canopyMaterial.apply();
        for (let i = 0; i < this.numPyramids; i++) {
            this.scene.pushMatrix();
            const heightOffset = this.trunkHeight + (i * this.canopyHeight / 2) / this.numPyramids;
            const scaleFactor = 1 - i * 0.1;
            this.scene.translate(0, heightOffset, 0);
            this.scene.scale(this.pyramidBaseRadius * scaleFactor, this.canopyHeight / this.numPyramids, this.pyramidBaseRadius * scaleFactor);
            this.canopy.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }
}