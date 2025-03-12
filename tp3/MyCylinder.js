import { CGFobject } from '../lib/CGF.js';
/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 */
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
    
        for (let stack = 0; stack <= this.stacks; stack++) {
            this.vertices.push(1, 0, stack / this.stacks);
            this.normals.push(1, 0, 0);
        }
    
        for (let slice = 1; slice <= this.slices; slice++) {
            let angle = 2 * Math.PI * slice / this.slices;
            let x = Math.cos(angle);
            let y = Math.sin(angle);
            let vectorSize = Math.sqrt(x * x + y * y);
    
            if (slice != this.slices) {
                this.vertices.push(x, y, 0);
                this.normals.push(x / vectorSize, y / vectorSize, 0);
            }
    
            for (let stack = 1; stack <= this.stacks; stack++) {
                let z = stack / this.stacks;
    
                if (slice != this.slices) {
                    
                    this.vertices.push(x, y, z);
                    this.normals.push(x / vectorSize, y / vectorSize, 0);

                    let currentPoint = this.vertices.length / 3;
                    let indexA = currentPoint - 2 - (this.stacks + 1);
                    let indexB = currentPoint - 1 - (this.stacks + 1);
                    let indexC = currentPoint - 2;
                    let indexD = currentPoint - 1;
                
                    this.indices.push(indexA, indexC, indexD);
                    this.indices.push(indexA, indexD, indexB);

                } else {
                    let currentPoint = this.vertices.length / 3;
                    let indexA = currentPoint - this.stacks - 2 + stack;
                    let indexB = currentPoint - this.stacks - 1 + stack;
                    let indexC = stack - 1;
                    let indexD = stack;
                
                    this.indices.push(indexA, indexC, indexD);
                    this.indices.push(indexA, indexD, indexB);
                }
            }
        }
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(complexity) {
    }
}