import { CGFobject, CGFappearance } from '../lib/CGF.js';
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
        this.initMaterials();
    }

    initMaterials() {

        // Diamond
        this.diamondMaterial = new CGFappearance(this.scene)
        this.diamondMaterial.setAmbient(0, 1, 0, 1.0)
        this.diamondMaterial.setDiffuse(0, 1, 0, 0)
        this.diamondMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.diamondMaterial.setShininess(10.0)

        // Triangle purple
        this.trianglePurpleMaterial = new CGFappearance(this.scene)
        this.trianglePurpleMaterial.setAmbient(1, 0, 0, 1.0)
        this.trianglePurpleMaterial.setDiffuse(76 / 255, 0 / 255, 153 / 255, 0)
        this.trianglePurpleMaterial.setSpecular(0, 0, 0, 1.0)
        this.trianglePurpleMaterial.setShininess(10.0)

        // Triangle pink
        this.trianglePinkMaterial = new CGFappearance(this.scene)
        this.trianglePinkMaterial.setAmbient(0, 1, 1, 1.0)
        this.trianglePinkMaterial.setDiffuse(255 / 200, 153 / 255, 204 / 255, 0)
        this.trianglePinkMaterial.setSpecular(0.1, 0.1, 0.1, 1.0)
        this.trianglePinkMaterial.setShininess(10.0)

        // Triangle orange
        this.triangleOrangeMaterial = new CGFappearance(this.scene)
        this.triangleOrangeMaterial.setAmbient(1, 1, 0, 1.0)
        this.triangleOrangeMaterial.setDiffuse(255 / 255, 140 / 255, 0 / 255, 0)
        this.triangleOrangeMaterial.setSpecular(0.1, 0.1, 0.1, 1.0)
        this.triangleOrangeMaterial.setShininess(10.0)

        // Triangle blue
        this.triangleBlueMaterial = new CGFappearance(this.scene)
        this.triangleBlueMaterial.setAmbient(1, 0, 1, 1.0)
        this.triangleBlueMaterial.setDiffuse(0 / 255, 150 / 255, 255 / 255, 0)
        this.triangleBlueMaterial.setSpecular(0.1, 0.1, 0.1, 1.0)
        this.triangleBlueMaterial.setShininess(10.0);

        // Triangle red
        this.triangleRedMaterial = new CGFappearance(this.scene)
        this.triangleRedMaterial.setAmbient(0, 1, 0, 1.0)
        this.triangleRedMaterial.setDiffuse(1, 0, 0, 0)
        this.triangleRedMaterial.setSpecular(0.1, 0.1, 0.1, 1.0)
        this.triangleRedMaterial.setShininess(10.0)    

        // Paralellogram
        this.paralellogramMaterial = new CGFappearance(this.scene)
        this.paralellogramMaterial.setAmbient(1, 1, 1, 1.0)
        this.paralellogramMaterial.setDiffuse(1, 1, 0, 0)
        this.paralellogramMaterial.setSpecular(0.1, 0.1, 0.1, 1.0)
        this.paralellogramMaterial.setShininess(10.0)
    }
    

    display (){

        this.scene.pushMatrix()
        this.scene.translate(1, 0, 0)

        
        this.scene.pushMatrix()
        let translationMatrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            -1.5, -2, 0, 1
        ]

        this.scene.multMatrix(translationMatrix)
        this.scene.setDiffuse(0, 255 / 255, 0, 0)
        this.scene.customMaterial.apply()
        this.diamond.display()
        this.scene.popMatrix()
        
        
        //Blue triangle
        this.scene.pushMatrix()
        this.scene.translate(-1.5, -1, 0)
        this.scene.rotate(315 * Math.PI / 180, 0, 0, 1)
        this.triangleBlueMaterial.apply()
        this.triangleBig.display()
        this.scene.popMatrix()
        
        //Pink Triangle
        this.scene.pushMatrix()
        this.scene.translate(-0.5, -3.4, 0)
        this.scene.rotate(225 * Math.PI / 180, 0, 0, 1)
        this.trianglePinkMaterial.apply()
        this.triangle.display()
        this.scene.popMatrix()
        
        //Orange Triangle
        this.scene.pushMatrix()
        this.scene.translate(-1.5, 1.825, 0)
        this.scene.rotate(135 * Math.PI / 180, 0, 0, 1)
        this.triangleOrangeMaterial.apply()
        this.triangleBig.display()
        this.scene.popMatrix()
        
        //Purple Triangle
        this.scene.pushMatrix()
        this.scene.translate(-3.62, 3.4, 0)
        this.scene.rotate(225 * Math.PI / 180, 0, 0, 1)
        this.trianglePurpleMaterial.apply()
        this.triangleSmall.display()
        this.scene.popMatrix()
        
        //Parallelogram
        this.scene.pushMatrix()
        this.scene.scale(-1, 1, 1)
        this.scene.translate(-2.9, -3.4, 0)
        this.paralellogramMaterial.apply()
        this.parallelogram.display()
        this.scene.popMatrix()
        
        //Red Triangle
        this.scene.pushMatrix()
        this.scene.translate(-2.91, 0, 0)
        this.scene.rotate(90 * Math.PI / 180, 0, 0, 1)
        this.triangleRedMaterial.apply()
        this.triangleSmall.display()
        this.scene.popMatrix()

        this.scene.popMatrix()

    }

    enableNormalViz(){
        this.diamond.enableNormalViz()
        this.triangle.enableNormalViz()
        this.triangleBig.enableNormalViz()
        this.triangleSmall.enableNormalViz()
        this.parallelogram.enableNormalViz()
    };

    disableNormalViz(){
        this.diamond.disableNormalViz()
        this.triangle.disableNormalViz()
        this.triangleBig.disableNormalViz()
        this.triangleSmall.disableNormalViz()
        this.parallelogram.disableNormalViz()
    };
}

