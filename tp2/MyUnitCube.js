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
            1, 0, 2,
            0, 2 ,3,
            3, 2, 0,

            4, 5, 6,
            5, 4, 6,
            4, 6 ,7,
            7, 6, 4,

            2, 3, 4,
            4, 3, 2,
            2, 4, 7,
            7, 4, 2,
            
            0, 1, 5,
            5, 1, 0,
            1, 5, 6,
            6, 5, 1,

            6, 7, 1,
            1, 7, 6,
            7, 2, 1,
            1, 2, 7,

            4, 5, 3,
            3, 5, 4,
            5, 0, 3,
            3, 0, 5
            

        ];

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
    
}

