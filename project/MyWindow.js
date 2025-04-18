import { CGFappearance } from "../lib/CGF.js";
import { MyQuad } from "./MyQuad.js";

export class MyWindow {
    constructor(scene, texture) {
        this.scene = scene;
        this.quad = new MyQuad(scene); 
        this.texture = new CGFappearance(scene);
        this.texture.setAmbient(0.3, 0.3, 0.3, 1);
        this.texture.setDiffuse(0.7, 0.7, 0.7, 1);
        this.texture.setSpecular(0.0, 0.0, 0.0, 1);
        this.texture.setShininess(10.0);
        this.texture.loadTexture(texture);
    }

    display() {
        this.texture.apply();
        this.quad.display();
    }
}