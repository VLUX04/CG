import { CGFobject } from "../lib/CGF.js";

export class MyBox extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            // Front face
            -0.5, -0.5,  0.5,
             0.5, -0.5,  0.5,
             0.5,  0.5,  0.5,
            -0.5,  0.5,  0.5,

            // Back face
            0.5, -0.5, -0.5,
            -0.5, -0.5, -0.5,
            -0.5,  0.5, -0.5,
            0.5,  0.5, -0.5,

            // Top face
            -0.5,  0.5,  0.5,
             0.5,  0.5,  0.5,
             0.5,  0.5, -0.5,
            -0.5,  0.5, -0.5,

            // Bottom face
            -0.5, -0.5, -0.5,
             0.5, -0.5, -0.5,
             0.5, -0.5,  0.5,
            -0.5, -0.5,  0.5,

            // Right face
            0.5, -0.5,  0.5,
            0.5, -0.5, -0.5,
            0.5,  0.5, -0.5,
            0.5,  0.5,  0.5,

            // Left face
            -0.5, -0.5, -0.5,
            -0.5, -0.5,  0.5,
            -0.5,  0.5,  0.5,
            -0.5,  0.5, -0.5,
        ];

        this.indices = [
            // Front face
            0, 1, 2,
            0, 2, 3,

            // Back face
            4, 5, 6,
            4, 6, 7,

            // Top face
            8, 9,10,
            8,10,11,

            // Bottom face
           12,13,14,
           12,14,15,

            // Right face
           16,17,18,
           16,18,19,

            // Left face
           20,21,22,
           20,22,23,
        ];

        this.normals = [
            // Front face 
             0,  0,  1,
             0,  0,  1,
             0,  0,  1,
             0,  0,  1,

            // Back face
             0,  0, -1,
             0,  0, -1,
             0,  0, -1,
             0,  0, -1,

            // Top face
             0,  1,  0,
             0,  1,  0,
             0,  1,  0,
             0,  1,  0,

            // Bottom face
             0, -1,  0,
             0, -1,  0,
             0, -1,  0,
             0, -1,  0,

            // Right face
             1,  0,  0,
             1,  0,  0,
             1,  0,  0,
             1,  0,  0,

            // Left face
            -1,  0,  0,
            -1,  0,  0,
            -1,  0,  0,
            -1,  0,  0,
        ];

        this.texCoords = [
            0, 0,
            1, 0,
            1, 1,
            0, 1,

            0, 0,
            1, 0,
            1, 1,
            0, 1,

            0, 0,
            1, 0,
            1, 1,
            0, 1,

            0, 0,
            1, 0,
            1, 1,
            0, 1,

            0, 0,
            1, 0,
            1, 1,
            0, 1,

            0, 0,
            1, 0,
            1, 1,
            0, 1,
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
