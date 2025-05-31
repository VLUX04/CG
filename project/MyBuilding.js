import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyWindow } from "./MyWindow.js";
import { MyBox } from "./MyBox.js";
import { MyQuad } from "./MyQuad.js";
import { MySphere } from "./MySphere.js"; 

export class MyBuilding extends CGFobject {
    constructor(scene, width, numFloors, numWindows, buildingColor,windowTexture, letreiroTexture, doorTexture, heliportTextureH, heliportTextureUP, heliportTextureDOWN) {
        super(scene);
        this.sphere = new MySphere(scene, 10, 10);
        this.centralWidth = width / 3;
        this.sideWidth = Math.min(this.centralWidth * 0.75, 15);
        this.numFloors = numFloors;
        this.numWindows = numWindows;
        this.window = new MyWindow(scene, windowTexture);
        this.letreiro = new MyWindow(scene, letreiroTexture);
        this.door = new MyWindow(scene, doorTexture);


        this.buildingMaterial = new CGFappearance(scene);
        this.buildingMaterial.setAmbient(buildingColor[0], buildingColor[1], buildingColor[2], 0.5);
        this.buildingMaterial.setDiffuse(buildingColor[0], buildingColor[1], buildingColor[2], 1);
        this.buildingMaterial.setShininess(10.0);

        this.baseLightMaterial = new CGFappearance(scene);
        this.baseLightMaterial.setAmbient(0, 0, 0, 0.5);
        this.baseLightMaterial.setDiffuse(0, 0, 0, 1);
        this.baseLightMaterial.setShininess(10.0);

        this.depth = (this.centralWidth + 2.5) * 0.5;

        this.boxLeft = new MyBox(scene, { left: true, right: false, bottom: false });
        this.boxCenter = new MyBox(scene, { left: true, right: true, bottom: false });
        this.boxRight = new MyBox(scene, { left: false, right: true, bottom: false });

        this.heliportQuad = new MyQuad(scene);

        this.heliportTextureH = new CGFappearance(scene);
        this.heliportTextureH.setTexture(heliportTextureH);

        this.heliportTextureUP = new CGFappearance(scene);
        this.heliportTextureUP.setTexture(heliportTextureUP);

        this.heliportTextureDOWN = new CGFappearance(scene);
        this.heliportTextureDOWN.setTexture(heliportTextureDOWN);

        this.heliportTextureBase = heliportTextureH;
        this.heliportTextureUp = heliportTextureUP;
        this.heliportTextureDown = heliportTextureDOWN;
        this.currentHeliportTargetTexture = heliportTextureH;
    }

    setHeliportTexture(mode) {
        if (mode === "UP") this.currentHeliportTargetTexture = this.heliportTextureUp;
        else if (mode === "DOWN") this.currentHeliportTargetTexture = this.heliportTextureDown;
        else this.currentHeliportTargetTexture = this.heliportTextureBase;
    }

    drawHeliportSign(floors) {
        this.scene.pushMatrix();
        this.scene.translate(0, floors + 0.25 + 0.01, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        const heliportSize = Math.min(this.centralWidth, this.depth * 1.25);
        this.scene.scale(heliportSize, heliportSize, 1);

        this.scene.setActiveShader(this.scene.heliportShader);
        this.heliportTextureBase.bind(0);
        this.currentHeliportTargetTexture.bind(1);
        this.heliportQuad.display();
        this.scene.setActiveShader(this.scene.defaultShader);

        this.scene.popMatrix();
        
        const blinking = this.scene.isBlinking ?? false;
        this.drawHeliportLights(heliportSize, floors, blinking);
    }

    drawHeliportLights(heliportSize, floors, isBlinking) {
        const r = heliportSize / 2 * 0.9;
        const y = floors + 0.25 + 0.01;
        const positions = [
            [ r, y,  r],
            [-r, y,  r],
            [ r, y, -r],
            [-r, y, -r]
        ];

        if (isBlinking) {
            this.scene.setActiveShader(this.scene.blinkingLightShader);
            this.scene.blinkingLightShader.setUniformsValues({
                uTime: performance.now() / 1000.0,
            });
        } 

        for (const [x, y, z] of positions) {
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.scene.scale(0.13, 0.13, 0.13);
            this.baseLightMaterial.apply();
            this.sphere.display();
            this.scene.popMatrix();
        }

        if (isBlinking) {
            this.scene.setActiveShader(this.scene.defaultShader);
        }

        for (const [x, y, z] of positions) {
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.scene.scale(0.2, 0.01, 0.2);
            this.baseLightMaterial.apply();
            this.sphere.display();
            this.scene.popMatrix();
        }
    }
    
    display() {
        this.scene.pushMatrix();
        this.scene.translate(-this.centralWidth / 2 - this.sideWidth/2, 0, 0);
        this.drawModule(this.numFloors, false, true, false); // Left
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.depth * 0.25 / 2);
        this.drawModule(this.numFloors + 1, true); // Center
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.centralWidth /2 + this.sideWidth/2, 0, 0);
        this.drawModule(this.numFloors, false, false, true); // Right
        this.scene.popMatrix();
    }

    drawModule(floors, isCentral = false, isLeft = false) {

        const box = isCentral ? this.boxCenter : (isLeft ? this.boxLeft : this.boxRight);

        this.scene.pushMatrix();
        this.scene.scale(isCentral ? this.centralWidth : this.sideWidth, isCentral ? floors + 0.25 : floors , isCentral ? this.depth * 1.25 : this.depth);
        this.scene.translate(0, 0.5, 0);
        this.buildingMaterial.apply();
        box.display(); 
        this.scene.popMatrix();
    
        for (let i = 0; i < floors; i++) {
            if (!(isCentral && i === 0)) {
                this.drawWindows(isCentral ? this.centralWidth : this.sideWidth, i, isCentral);
            }
            if (isCentral && i === 0) this.drawEntrance();
        }
    
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