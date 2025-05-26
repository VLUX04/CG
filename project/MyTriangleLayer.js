import { CGFobject } from "../lib/CGF.js";

export class MyTriangleLayer extends CGFobject {
    constructor(scene, vertices, indices, texCoords) {
        super(scene);
        this.vertices = vertices;
        this.indices = indices;
        this.texCoords = texCoords;
        this.normals = [];
        for (let i = 0; i < vertices.length / 3; i++) this.normals.push(0, 1, 0);
        this.primitiveType = scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}