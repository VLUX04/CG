import {CGFobject} from '../lib/CGF.js';
/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            -0.5, -0.5, -0.5,	
            0.5, -0.5, -0.5,	
            0.5, -0.5, 0.5,	
            -0.5, -0.5, 0.5,	
            -0.5, 0.5, 0.5,	
            -0.5, 0.5, -0.5,	
            0.5, 0.5, -0.5,	
            0.5, 0.5, 0.5,	
        ];

        this.indices = [
            0, 1, 2,
            0, 2 ,3,

            5, 4, 6,
            7, 6, 4,

            4, 3, 2,
            7, 4, 2,
            
            5, 1, 0,
            1, 5, 6,

            6, 7, 1,
            7, 2, 1,

            4, 5, 3,
            5, 0, 3
            
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
    
}

