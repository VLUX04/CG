import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyWindow } from "./MyWindow.js";
import { MyBox } from "./MyBox.js";
import { MyQuad } from "./MyQuad.js";

export class MyBuilding extends CGFobject {
    constructor(scene, centralWidth, sideWidthPerc, numFloors, numWindows, windowTexture, buildingColor) {
        super(scene);
        this.centralWidth = centralWidth;
        this.sideWidth = Math.min(centralWidth * sideWidthPerc, 15);
        this.numFloors = numFloors;
        this.numWindows = numWindows;
        this.window = new MyWindow(scene, windowTexture);
        this.letreiro = new MyWindow(scene, "textures/letreiro.png");
        this.door = new MyWindow(scene, "textures/door.png");


        this.buildingMaterial = new CGFappearance(scene);
        this.buildingMaterial.setAmbient(buildingColor[0], buildingColor[1], buildingColor[2], 0.5);
        this.buildingMaterial.setDiffuse(buildingColor[0], buildingColor[1], buildingColor[2], 1);
        this.buildingMaterial.setShininess(10.0);

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
        this.scene.translate(-this.centralWidth / 2 - this.sideWidth/2, 0, 0);
        this.drawModule(this.numFloors);
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.depth * 0.25 / 2);
        this.drawModule(this.numFloors + 1, true);
        this.scene.popMatrix();

     
        this.scene.pushMatrix();
        this.scene.translate(this.centralWidth /2 + this.sideWidth/2, 0, 0);
        this.drawModule(this.numFloors);
        this.scene.popMatrix();
    }

    drawModule(floors, isCentral = false) {

        this.scene.pushMatrix();
        this.scene.scale(isCentral ? this.centralWidth : this.sideWidth, floors , isCentral ? this.depth * 1.25 : this.depth);
        this.scene.translate(0, 0.5, 0);
        this.buildingMaterial.apply();
        this.box.display(); 
        this.scene.popMatrix();
    
        for (let i = 0; i < floors; i++) {
            if (!(isCentral && i === 0)) {
                this.drawWindows(isCentral ? this.centralWidth : this.sideWidth, i, isCentral);
            }
            if (isCentral && i === 0) this.drawEntrance();
        }
    
        this.scene.pushMatrix();
        this.scene.translate(0, floors - 0.13, 0);
        this.scene.scale(isCentral ? this.centralWidth : this.sideWidth, 0.75, isCentral ? this.depth * 1.25 : this.depth);
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
            this.scene.scale(0.66, 0.66, 1);
            this.window.display();
            this.scene.popMatrix();
        }
    }
    drawHeliportSign(floors) {
        this.scene.pushMatrix();
    
        this.scene.translate(0, floors + 0.25 + 0.01, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        const heliportSize = Math.min(this.centralWidth, this.depth * 1.25);
        this.scene.scale(heliportSize, heliportSize, 1);
        this.heliportTexture.apply();
        this.heliportQuad.display();
    
        this.scene.popMatrix();
    }
    drawEntrance() {
        this.scene.pushMatrix();
        this.scene.scale(0.7,0.7,1);
        this.scene.translate(0, 0.45, this.depth * 1.25 / 2 + 0.05);
        this.door.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.scale(0.75,0.375,1);
        this.scene.translate(0, 2.5, this.depth * 1.25 / 2 + 0.05);
        this.letreiro.display();
        this.scene.popMatrix();
    }

}