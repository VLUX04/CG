import { CGFobject } from "../lib/CGF.js";

export class MyTruncatedCone extends CGFobject {
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

        const bottomCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0); 
        this.normals.push(0, -1, 0); 
        this.texCoords.push(0.5, 0.5);

        for (let i = 0; i <= this.slices; i++) {
            const angle = i * alphaAng;
            const x = Math.cos(angle) * this.baseRadius;
            const z = Math.sin(angle) * this.baseRadius;

            this.vertices.push(x, 0, z);
            this.normals.push(0, -1, 0); 
            this.texCoords.push((x / this.baseRadius + 1) / 2, (z / this.baseRadius + 1) / 2);

            if (i < this.slices) {
                const current = bottomCenterIndex + i + 1;
                this.indices.push(bottomCenterIndex, current, current + 1);
            }
        }

        const topCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, this.height, 0); 
        this.normals.push(0, 1, 0); 
        this.texCoords.push(0.5, 0.5);

        for (let i = 0; i <= this.slices; i++) {
            const angle = i * alphaAng;
            const x = Math.cos(angle) * this.topRadius;
            const z = Math.sin(angle) * this.topRadius;

            this.vertices.push(x, this.height, z);
            this.normals.push(0, 1, 0); 
            this.texCoords.push((x / this.topRadius + 1) / 2, (z / this.topRadius + 1) / 2);

            if (i < this.slices) {
                const current = topCenterIndex + i + 1;
                this.indices.push(topCenterIndex, current + 1, current);
            }
        }
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}