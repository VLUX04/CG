import { CGFobject } from '../lib/CGF.js';

export class MyCylinder extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const angleIncrement = (2 * Math.PI) / this.slices;

        for (let stack = 0; stack <= this.stacks; stack++) {
            const z = stack / this.stacks;

            for (let slice = 0; slice <= this.slices; slice++) {
                const angle = slice * angleIncrement;
                const x = Math.cos(angle);
                const y = Math.sin(angle);

                this.vertices.push(x, y, z);
                this.normals.push(x, y, 0); 
                this.texCoords.push(slice / this.slices, stack / this.stacks);
            }
        }

        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                const current = stack * (this.slices + 1) + slice;
                const next = current + this.slices + 1;

                this.indices.push(current, current + 1, next);
                this.indices.push(next, current + 1, next + 1);
            }
        }

        const bottomCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0); 
        this.normals.push(0, 0, -1); 
        this.texCoords.push(0.5, 0.5);

        for (let slice = 0; slice <= this.slices; slice++) {
            const angle = slice * angleIncrement;
            const x = Math.cos(angle);
            const y = Math.sin(angle);

            this.vertices.push(x, y, 0);
            this.normals.push(0, 0, -1); 
            this.texCoords.push((x + 1) / 2, (y + 1) / 2);

            if (slice < this.slices) {
                const current = bottomCenterIndex + slice + 1;
                this.indices.push(bottomCenterIndex, current + 1, current);
            }
        }

        const topCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 1); 
        this.normals.push(0, 0, 1); 
        this.texCoords.push(0.5, 0.5);

        for (let slice = 0; slice <= this.slices; slice++) {
            const angle = slice * angleIncrement;
            const x = Math.cos(angle);
            const y = Math.sin(angle);

            this.vertices.push(x, y, 1);
            this.normals.push(0, 0, 1); 
            this.texCoords.push((x + 1) / 2, (y + 1) / 2);

            if (slice < this.slices) {
                const current = topCenterIndex + slice + 1;
                this.indices.push(topCenterIndex, current, current + 1);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(complexity) {
        this.slices = Math.max(3, Math.round(complexity * 20));
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}