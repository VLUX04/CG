import {CGFobject} from '../lib/CGF.js';
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleSmall } from "./MyTriangleSmall.js";
import { MyTriangleBig } from "./MyTriangleBig.js";

/**
 * MyTangram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTangram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.diamond = new MyDiamond(this.scene);
        this.triangle = new MyTriangle(this.scene);
        this.triangleBig = new MyTriangleBig(this.scene);
        this.triangleSmall = new MyTriangleSmall(this.scene);
        this.parallelogram = new MyParallelogram(this.scene);
    }
    

    display (){

        this.scene.pushMatrix();
        this.scene.translate(1, 0, 0)

        
        this.scene.pushMatrix();
        let translationMatrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            -1.5, -2, 0, 1
        ]

        this.scene.multMatrix(translationMatrix)
        this.scene.setDiffuse(0, 255 / 255, 0, 0)
        this.diamond.display()
        this.scene.popMatrix()
        
        
        //Blue triangle
        this.scene.pushMatrix()
        this.scene.translate(-1.5, -1, 0)
        this.scene.rotate(315 * Math.PI / 180, 0, 0, 1)
        this.scene.setDiffuse(0 / 255, 150 / 255, 255 / 255, 0)
        this.triangleBig.display()
        this.scene.popMatrix()
        
        //Pink Triangle
        this.scene.pushMatrix()
        this.scene.translate(-0.5, -3.4, 0)
        this.scene.rotate(225 * Math.PI / 180, 0, 0, 1)
        this.scene.setDiffuse(255 / 200, 153 / 255, 204 / 255, 0)
        this.triangle.display()
        this.scene.popMatrix()
        
        //Orange Triangle
        this.scene.pushMatrix()
        this.scene.translate(-1.5, 1.82, 0)
        this.scene.rotate(135 * Math.PI / 180, 0, 0, 1)
        this.scene.setDiffuse(255 / 255, 150 / 255, 0 / 255, 0)
        this.triangleBig.display()
        this.scene.popMatrix()
        
        //Purple Triangle
        this.scene.pushMatrix()
        this.scene.translate(-3.63, 3.4, 0)
        this.scene.rotate(225 * Math.PI / 180, 0, 0, 1)
        this.scene.setDiffuse(76 / 255, 0 / 255, 153 / 255, 0)
        this.triangleSmall.display()
        this.scene.popMatrix()
        
        //Parallelogram
        this.scene.pushMatrix()
        this.scene.scale(-1, 1, 1)
        this.scene.translate(-2.9, -3.4, 0)
        this.scene.setDiffuse(1, 1, 0, 0)
        this.parallelogram.display()
        this.scene.popMatrix()
        
        //Red Triangle
        this.scene.pushMatrix()
        this.scene.translate(-2.92, 0, 0)
        this.scene.rotate(90 * Math.PI / 180, 0, 0, 1)
        this.scene.setDiffuse(1, 0, 0, 0)
        this.triangleSmall.display()
        this.scene.popMatrix()

        this.scene.popMatrix()

    }
}

