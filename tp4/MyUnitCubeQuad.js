import { CGFobject } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';

/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {
    constructor(scene) {
        super(scene);
        this.quad = new MyQuad(this.scene);
    }


    display() {

        //Top
        this.scene.pushMatrix()
        this.scene.translate(0, 0, 0.5)
        this.scene.rotate(270 * Math.PI / 180, 1, 0, 0)
        this.quad.display()
        this.scene.popMatrix()

        //Back
        this.scene.pushMatrix()
        this.scene.translate(0, 0, -0.5)
        this.scene.rotate(90 * Math.PI / 180, 1, 0, 0)
        this.quad.display()
        this.scene.popMatrix()

        //Left
        this.scene.pushMatrix()
        this.scene.translate(-0.5, 0, 0)
        this.scene.rotate(270 * Math.PI / 180, 0, 0, 1)
        this.quad.display()
        this.scene.popMatrix()

        //Right
        this.scene.pushMatrix()
        this.scene.translate(0.5, 0, 0)
        this.scene.rotate(90 * Math.PI / 180, 0, 0, 1)
        this.quad.display()
        this.scene.popMatrix()

        //Top
        this.scene.pushMatrix()
        this.scene.translate(0,0.5,0)
        this.scene.rotate( Math.PI , 1, 0, 0)
        this.quad.display()
        this.scene.popMatrix()

        //Bottom
        this.scene.pushMatrix()
        this.scene.translate(0,-0.5,0)
        this.quad.display()
        this.scene.popMatrix()

        
    }


}