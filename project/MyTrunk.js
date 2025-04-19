import { CGFobject } from "../lib/CGF.js";

export class MyTrunk extends CGFobject {
    constructor(scene, height, baseRadius) {
        super(scene);
        this.height = height;
        this.baseRadius = baseRadius;
        this.topRadius = baseRadius * 0.75; 
        this.slices = 20; 
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
    
        const alphaAng = (2 * Math.PI) / this.slices;
    
        for (let i = 0; i <= this.slices; i++) {
            const angle = i * alphaAng;
            const cosAngle = Math.cos(angle);
            const sinAngle = Math.sin(angle);
    
            this.vertices.push(this.baseRadius * cosAngle, 0, this.baseRadius * sinAngle);
            this.normals.push(cosAngle, 0, sinAngle); 
            this.texCoords.push(i / this.slices, 1);
    
            this.vertices.push(this.topRadius * cosAngle, this.height, this.topRadius * sinAngle);
            this.normals.push(cosAngle, 0, sinAngle);
            this.texCoords.push(i / this.slices, 0);
        }
    
        for (let i = 0; i < this.slices; i++) {
            const bottomLeft = 2 * i;
            const bottomRight = 2 * i + 2;
            const topLeft = 2 * i + 1;
            const topRight = 2 * i + 3;
    
            this.indices.push(bottomLeft, topRight, bottomRight);
            this.indices.push(bottomLeft, topLeft, topRight);
        }
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}