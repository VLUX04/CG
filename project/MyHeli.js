import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";
import { MyCylinder } from "./MyCylinder.js";
import { MyBox } from "./MyBox.js";
import { MyTruncatedCone } from "./MyTruncatedCone.js";


export class MyHeli extends CGFobject {
    constructor(scene) {
        super(scene);

        this.length = 10; 
        this.bodyRadius = 1.5; 
        this.tailLength = 7;
        this.tailRadius = 0.66; 
        this.rotorRadius = 4;
        this.bucketRadius = 0.5; 
        this.bucketHeight = 1; 

        this.bodyMaterial = new CGFappearance(scene);
        this.bodyMaterial.setAmbient(0.3, 0.3, 0.3, 1);
        this.bodyMaterial.setDiffuse(0.7, 0.7, 0.7, 1);
        this.bodyMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.bodyMaterial.setShininess(10.0);

        this.glass = new CGFappearance(scene);
        this.glass.setAmbient(0.1, 0.2, 0.3, 0.3);    
        this.glass.setDiffuse(0.1, 0.2, 0.3, 0.3);     
        this.glass.setSpecular(0.9, 0.9, 1.0, 0.3);    
        this.glass.setShininess(120.0);               

        this.rotorMaterial = new CGFappearance(scene);
        this.rotorMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.rotorMaterial.setDiffuse(0.3, 0.3, 0.3, 1);
        this.rotorMaterial.setSpecular(0.5, 0.5, 0.5, 1);
        this.rotorMaterial.setShininess(50.0);

        this.bucketMaterial = new CGFappearance(scene);
        this.bucketMaterial.setAmbient(0.1, 0.1, 0.8, 1);
        this.bucketMaterial.setDiffuse(0.3, 0.3, 1, 1);
        this.bucketMaterial.setSpecular(0.5, 0.5, 1, 1);
        this.bucketMaterial.setShininess(50.0);

        this.body = new MySphere(scene, 16, 16); 
        this.rotorCenter = new MyCylinder(scene, 16, 16); 
        this.tail = new MyTruncatedCone(scene, this.tailLength, this.tailRadius); 
        this.box = new MyBox(scene); 
        this.bucket = new MyCylinder(scene, 16, 16); 

        this.initBuffers();
    }

    display() {
        // Main body
        this.scene.pushMatrix();
        this.bodyMaterial.apply();
        this.scene.scale(this.bodyRadius, this.bodyRadius, this.length / 2);
        this.body.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.glass.apply();
        this.scene.scale(1,1,2);
        this.scene.translate(0, 0.3, 1.35);
        this.body.display();
        this.scene.popMatrix();

        // Tail
        this.scene.pushMatrix();
        this.bodyMaterial.apply();
        this.scene.translate(0, 0, -this.length / 2 + 1);
        this.scene.rotate(-Math.PI / 2 + Math.PI / 32, 1, 0, 0);        
        this.tail.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.bodyMaterial.apply();
        this.scene.scale(0.25,1.75,1);
        this.scene.translate(0, 0.75, -10.7); 
        this.scene.rotate(Math.PI / 3, 1, 0, 0);       
        this.box.display();
        this.scene.popMatrix();
    

        // Main rotor
        this.makeRotor();
        
        // Tail rotor
        this.scene.pushMatrix();
        this.scene.translate(-1, 0.66, -this.length - 0.5);
        this.scene.scale(1, 0.25, 0.25)
        this.scene.rotate(-Math.PI / 2, 0, 0, 1);
        this.makeRotor();
        this.scene.popMatrix();

        this.makeLandingGear()


        /*// Water bucket
        this.scene.pushMatrix();
        this.bucketMaterial.apply();
        this.scene.translate(0, -this.bodyRadius - this.bucketHeight / 2, 0);
        this.scene.scale(this.bucketRadius, this.bucketHeight, this.bucketRadius);
        this.bucket.display();
        this.scene.popMatrix();*/
    }

    makeRotor() {
        this.scene.pushMatrix();
        this.rotorMaterial.apply();
        this.scene.translate(0, this.bodyRadius + 0.2, 0);
        this.scene.scale(this.rotorRadius * 3, 0.1, 0.5);
        this.box.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.rotorMaterial.apply();
        this.scene.rotate(Math.PI / 3, 0, 1, 0);
        this.scene.translate(0, this.bodyRadius + 0.2, 0);
        this.scene.scale(this.rotorRadius * 3, 0.1, 0.5);
        this.box.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.rotorMaterial.apply();
        this.scene.rotate(2* Math.PI / 3, 0, 1, 0);
        this.scene.translate(0, this.bodyRadius + 0.2, 0);
        this.scene.scale(this.rotorRadius * 3, 0.1, 0.5);
        this.box.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.rotorMaterial.apply();
        this.scene.translate(0, 2, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.5, 0.5, 1);
        this.rotorCenter.display();
        this.scene.popMatrix();
    }

    makeLandingGear() {
        this.scene.pushMatrix();
        this.rotorMaterial.apply();
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.rotate(Math.PI / 4, 1, 0, 0);
        this.scene.translate(1, -0.5, 2);
        this.scene.scale(0.25, 0.25, 1.5);
        this.box.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.rotorMaterial.apply();
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.rotate(Math.PI / 4, 1, 0, 0);
        this.scene.translate(-1, -0.5, 2);
        this.scene.scale(0.25, 0.25, 1.5);
        this.box.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.rotorMaterial.apply();
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.rotate(-Math.PI / 4, 1, 0, 0);
        this.scene.translate(-1, -0.5, -2);
        this.scene.scale(0.25, 0.25, 1.5);
        this.box.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.rotorMaterial.apply();
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.rotate(-Math.PI / 4, 1, 0, 0);
        this.scene.translate(1, -0.5, -2);
        this.scene.scale(0.25, 0.25, 1.5);
        this.box.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.rotorMaterial.apply();
        this.scene.translate(1.6, -2.3, 0);
        this.scene.scale(0.25, 0.25, 4.5);
        this.box.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.rotorMaterial.apply();
        this.scene.translate(-1.6, -2.3, 0);
        this.scene.scale(0.25, 0.25, 4.5);
        this.box.display();
        this.scene.popMatrix();
    }


}