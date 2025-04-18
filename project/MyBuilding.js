import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyWindow } from "./MyWindow.js";
import { MyBox } from "./MyBox.js";
import { MyQuad } from "./MyQuad.js";

export class MyBuilding extends CGFobject {
    constructor(scene, width, numFloors, numWindows, windowTexture, buildingColor) {
        super(scene);
        this.width = width;
        this.numFloors = numFloors;
        this.numWindows = numWindows;
        this.window = new MyWindow(scene, windowTexture);

        this.buildingMaterial = new CGFappearance(scene);
        this.buildingMaterial.setAmbient(buildingColor[0], buildingColor[1], buildingColor[2], 0.5);
        this.buildingMaterial.setDiffuse(buildingColor[0], buildingColor[1], buildingColor[2], 1);
        this.buildingMaterial.setShininess(10.0);

        this.centralWidth = width / 3;
        this.sideWidth = (width / 3) * 0.75;
        this.depth = this.centralWidth * 0.75;

        this.box = new MyBox(scene);

        this.heliportQuad = new MyQuad(scene);

        this.heliportTexture = new CGFappearance(scene);
        this.buildingMaterial.setAmbient(buildingColor[0], buildingColor[1], buildingColor[2], 0.5);
        this.buildingMaterial.setDiffuse(buildingColor[0], buildingColor[1], buildingColor[2], 1);
        this.buildingMaterial.setShininess(10.0);
        this.heliportTexture.loadTexture("textures/heliport.png");
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(-this.centralWidth + this.sideWidth / 6, 0, 0);
        this.drawModule(this.numFloors);
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.depth * 0.25 / 2);
        this.drawModule(this.numFloors + 1, true);
        this.scene.popMatrix();

     
        this.scene.pushMatrix();
        this.scene.translate(this.centralWidth - this.sideWidth / 6, 0, 0);
        this.drawModule(this.numFloors);
        this.scene.popMatrix();
    }

    drawModule(floors, isCentral = false) {
    
        for (let i = 0; i < floors; i++) {
            this.scene.pushMatrix();
            this.scene.translate(0, i, 0);
            this.scene.scale(isCentral ? this.centralWidth : this.sideWidth, 1, isCentral ? this.depth * 1.25 : this.depth);
            this.buildingMaterial.apply();
            this.box.display(); 
            this.scene.popMatrix();
    
            
            if (!(isCentral && i === 0)) {
                this.drawWindows(isCentral ? this.centralWidth : this.sideWidth, i, isCentral);
            }
        }
    
        this.scene.pushMatrix();
        this.scene.translate(0, floors, 0);
        this.scene.scale(isCentral ? this.centralWidth : this.sideWidth, 1, isCentral ? this.depth * 1.25 : this.depth);
        this.buildingMaterial.apply();
        this.box.display(); 
        this.scene.popMatrix();
    
        if (isCentral) this.drawHeliportSign(floors);
    }

    drawWindows(moduleWidth, floor, isCentral) {
        const windowSpacing = moduleWidth / (this.numWindows );
        for (let i = 0; i < this.numWindows; i++) {
            this.scene.pushMatrix();
            this.scene.translate(-moduleWidth / 2 + (i + 0.5) * windowSpacing, floor + 0.5, isCentral ? this.depth * 1.25 / 2 + 0.01 : this.depth / 2 + 0.01);
            this.scene.scale(0.5, 0.5, 1);
            this.window.display();
            this.scene.popMatrix();
        }
    }
    drawHeliportSign(floors) {
        this.scene.pushMatrix();
    
        this.scene.translate(0, floors + 0.5 + 0.01, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        const heliportSize = Math.min(this.centralWidth, this.depth * 1.25);
        this.scene.scale(heliportSize, heliportSize, 1);
        this.heliportTexture.apply();
        this.heliportQuad.display();
    
        this.scene.popMatrix();
    }

}