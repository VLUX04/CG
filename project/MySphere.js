import { CGFobject } from "../lib/CGF.js";

export class MySphere extends CGFobject {
    constructor(scene, slices, stacks, inverted = false) {
        super(scene);
        this.slices = slices; 
        this.stacks = stacks; 
        this.inverted = inverted; 
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const slicesIncrement = (2 * Math.PI) / this.slices; 
        const stacksIncrement = Math.PI / (2 * this.stacks); 

        for (let stack = 0; stack <= 2 * this.stacks; stack++) {
            const angle1 = -Math.PI / 2 + stack * stacksIncrement; 
            const cosAngle1 = Math.cos(angle1);
            const sinAngle1 = Math.sin(angle1);

            for (let slice = 0; slice <= this.slices; slice++) {
                const angle2 = slice * slicesIncrement; 
                const cosAngle2 = Math.cos(angle2);
                const sinAngle2 = Math.sin(angle2);

                const x = cosAngle1 * cosAngle2;
                const y = sinAngle1;
                const z = cosAngle1 * sinAngle2;
                this.vertices.push(x, y, z);


                if (this.inverted) {
                    this.normals.push(-x, -y, -z); 
                } else {
                    this.normals.push(x, y, z); 
                }

                const u = slice / this.slices;
                const v = 1 - stack / (2 * this.stacks);
                this.texCoords.push(u, v);
            }
        }

        for (let stack = 0; stack < 2 * this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                const first = stack * (this.slices + 1) + slice;
                const second = first + this.slices + 1;

                if (this.inverted) {
                    this.indices.push(first, first + 1, second);
                    this.indices.push(second, first + 1, second + 1);
                } else {
                    this.indices.push(first, second, first + 1);
                    this.indices.push(second + 1, first + 1, second);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}