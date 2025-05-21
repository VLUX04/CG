import { CGFobject, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";

export class MyFire extends CGFobject {
    constructor(scene, numFlames = 6, flameHeight = 2, flameBase = 0.5) {
        super(scene);
        this.numFlames = numFlames;
        this.flameHeight = flameHeight;
        this.flameBase = flameBase;
        this.initBuffers();

        this.fireAppearance = new CGFappearance(scene);
        this.fireAppearance.setAmbient(1.0, 0.4, 0.0, 1.0);
        this.fireAppearance.setDiffuse(1.0, 0.5, 0.1, 1.0);
        this.fireAppearance.setSpecular(1.0, 0.8, 0.2, 1.0);
        this.fireAppearance.setEmission(1.0, 0.5, 0.0, 1.0);
        this.fireAppearance.setShininess(10.0);

        this.fireTexture = new CGFtexture(scene, "textures/fire.jpg");
        this.fireAppearance.setTexture(this.fireTexture);

        //this.fireShader = new CGFshader(scene.gl, "shaders/fire.vert", "shaders/fire.frag");
    }

    initBuffers() {
        // Each flame is a triangle standing up, arranged in a circle
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        for (let i = 0; i < this.numFlames; i++) {
            let angle = (2 * Math.PI * i) / this.numFlames;
            let nextAngle = (2 * Math.PI * (i + 1)) / this.numFlames;

            // Base points
            let x1 = Math.cos(angle) * this.flameBase;
            let z1 = Math.sin(angle) * this.flameBase;
            let x2 = Math.cos(nextAngle) * this.flameBase;
            let z2 = Math.sin(nextAngle) * this.flameBase;

            // Tip of the flame (center, up)
            let xTip = (x1 + x2) / 2;
            let zTip = (z1 + z2) / 2;
            let yTip = this.flameHeight * (0.8 + 0.4 * Math.random()); // randomize height a bit

            // Triangle vertices: base1, base2, tip
            let baseIndex = this.vertices.length / 3;
            this.vertices.push(x1, 0, z1); // base1
            this.vertices.push(x2, 0, z2); // base2
            this.vertices.push(xTip, yTip, zTip); // tip

            // Normals (approximate)
            for (let j = 0; j < 3; j++) this.normals.push(0, 1, 0); // all normals pointing up

            // Texture coordinates (simple mapping)
            this.texCoords.push(0, 1); // base1
            this.texCoords.push(1, 1); // base2
            this.texCoords.push(0.5, 0); // tip

            // Indices
            this.indices.push(baseIndex, baseIndex + 2, baseIndex + 1);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();

    }

    display() {
        this.fireAppearance.apply();
        super.display();
    }
}