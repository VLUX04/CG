import { CGFappearance } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";

export class MyPanorama {
    constructor(scene, texture) {
        this.scene = scene;
        this.sphere = new MySphere(scene, 32, 16, true);
        this.material = new CGFappearance(scene);
        this.material.setEmission(1.0, 1.0, 1.0, 1.0);
        this.material.setAmbient(0.0, 0.0, 0.0, 1.0);
        this.material.setDiffuse(0.0, 0.0, 0.0, 1.0);
        this.material.setSpecular(0.0, 0.0, 0.0, 1.0);
        this.material.setShininess(10.0);
        this.material.setTexture(texture);
        this.material.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
    }

    display(cameraPosition) {
        this.scene.pushMatrix();
        this.scene.translate(cameraPosition[0], cameraPosition[1], cameraPosition[2]); 
        this.material.apply();
        this.scene.scale(200, 200, 200); 
        this.sphere.display();
        this.scene.popMatrix();
    }
}