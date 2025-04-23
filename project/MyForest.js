import { CGFobject } from "../lib/CGF.js";
import { MyTree } from "./MyTree.js";

export class MyForest extends CGFobject {
    constructor(scene, rows, cols, areaWidth, areaHeight) {
        super(scene);

        this.rows = rows; 
        this.cols = cols; 
        this.areaWidth = areaWidth; 
        this.areaHeight = areaHeight;

        this.trees = [];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const inclination = Math.random() * 15; 
                const rotationAxis = Math.random() > 0.5 ? "X" : "Z"; 
                const trunkRadius = 0.5 + Math.random() * 0.3; 
                const treeHeight = 3 + Math.random() * 2; 
                const canopyColor = [
                    0.1 + Math.random() * 0.2, 
                    0.6 + Math.random() * 0.4,
                    0.1 + Math.random() * 0.2,
                ];

                const tree = new MyTree(scene, inclination, rotationAxis, trunkRadius, treeHeight, canopyColor, "textures/trunk.jpg");

                const xOffset = (Math.random() - 0.5) * (areaWidth / cols) * 0.5; 
                const zOffset = (Math.random() - 0.5) * (areaHeight / rows) * 0.5; 
                this.trees.push({
                    tree: tree,
                    inclination: inclination,
                    x: (j * areaWidth) / cols - areaWidth / 2 + xOffset,
                    z: (i * areaHeight) / rows - areaHeight / 2 + zOffset,
                });
            }
        }
    }

    display() {
        for (const treeData of this.trees) {
            this.scene.pushMatrix();
            this.scene.translate(treeData.x, -Math.sin(treeData.inclination * (Math.PI / 180)), treeData.z);
            treeData.tree.display();
            this.scene.popMatrix();
        }
    }
}