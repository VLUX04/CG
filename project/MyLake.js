import { CGFobject, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";

export class MyLake extends CGFobject {
    constructor(scene) {
        super(scene);

        this.waterTex = new CGFtexture(scene, "textures/waterTex.jpg");
        this.waterMap = new CGFtexture(scene, "textures/waterMap.jpg");

        this.appearance = new CGFappearance(scene);
        this.appearance.setAmbient(0.2, 0.2, 0.5, 1);
        this.appearance.setDiffuse(0.4, 0.4, 0.8, 1);
        this.appearance.setSpecular(0.8, 0.8, 1.0, 1);
        this.appearance.setShininess(50.0);
        this.appearance.setTexture(this.waterTex);
        this.appearance.setTextureWrap("REPEAT", "REPEAT");

        this.shader = new CGFshader(scene.gl, "shaders/water.vert", "shaders/water.frag");
        this.shader.setUniformsValues({ normScale: 1, timeFactor: 0, uSampler2: 1 });

        this.plane = new MyPlane(scene, 32, 0, 10, 0, 10);
    }

    display() {
        // Bind the normal/displacement map to texture unit 1
        this.waterMap.bind(1);

        // Activate the shader
        this.scene.setActiveShader(this.shader);

        // Draw the plane
        this.plane.display();

        // Restore default shader
        this.scene.setActiveShader(this.scene.defaultShader);
    }

    update(t) {
        // Animate the water by updating the timeFactor uniform
        this.shader.setUniformsValues({ timeFactor: (t / 100) % 100 });
    }
}