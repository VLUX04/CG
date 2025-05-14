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
        this.line = false;

        this.mainRotorAngle = 0;
        this.tailRotorAngle = 0;

        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.orientation = 0;
        this.speed = 0.5;
        this.inclination = 0;

        this.isAtRest = true;
        this.hasWater = false;

        this.bodyMaterial = new CGFappearance(scene);
        this.bodyMaterial.setAmbient(0.5, 0.1, 0.1, 1);  
        this.bodyMaterial.setDiffuse(0.9, 0.1, 0.1, 1);   
        this.bodyMaterial.setSpecular(0.3, 0.1, 0.1, 1); 
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
        this.bucketMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.bucketMaterial.setDiffuse(0.4, 0.4, 0.4, 1);
        this.bucketMaterial.setSpecular(0.4, 0.4, 0.4, 1);
        this.bucketMaterial.setShininess(50.0);

        this.body = new MySphere(scene, 16, 16);
        this.rotorCenter = new MyCylinder(scene, 16, 16);
        this.tail = new MyTruncatedCone(scene, this.tailLength, this.tailRadius, false);
        this.box = new MyBox(scene);
        this.bucket = new MyTruncatedCone(scene, this.bucketHeight, this.bucketRadius, false);

        this.initBuffers();
    }

    update(t) {
        
        if (this.hasWater) {
            this.bucketMaterial.setAmbient(0.1, 0.1, 0.5, 1);
            this.bucketMaterial.setDiffuse(0.3, 0.3, 0.9, 1);
            this.bucketMaterial.setSpecular(0.5, 0.5, 1.0, 1);
        }
        else{
            this.bucketMaterial.setAmbient(0.1, 0.1, 0.1, 1);
            this.bucketMaterial.setDiffuse(0.4, 0.4, 0.4, 1);
            this.bucketMaterial.setSpecular(0.4, 0.4, 0.4, 1);
        }

        this.mainRotorAngle += 0.3 * this.scene.speedFactor; 
        this.tailRotorAngle += 0.4 * this.scene.speedFactor;

        this.mainRotorAngle %= 2 * Math.PI;
        this.tailRotorAngle %= 2 * Math.PI;
    }

    display() {
        this.scene.pushMatrix();

        this.scene.translate(this.x, this.y, this.z);
        this.scene.rotate(this.orientation, 0, 1, 0);
        this.scene.rotate(this.inclination, 1, 0, 0);

        // Main body
        this.scene.pushMatrix();
        this.bodyMaterial.apply();
        this.scene.scale(this.bodyRadius, this.bodyRadius, this.length / 2);
        this.body.display();
        this.scene.popMatrix();

        // Cockpit glass
        this.scene.pushMatrix();
        this.glass.apply();
        this.scene.scale(1, 1, 2);
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

        // Tail support box
        this.scene.pushMatrix();
        this.bodyMaterial.apply();
        this.scene.scale(0.25, 1.75, 1);
        this.scene.translate(0, 0.75, -10.7);
        this.scene.rotate(Math.PI / 3, 1, 0, 0);
        this.box.display();
        this.scene.popMatrix();

        // Main rotor
        this.scene.pushMatrix();
        this.scene.rotate(this.mainRotorAngle, 0, 1, 0);
        this.makeRotor();
        this.scene.popMatrix();

        // Tail rotor
        this.scene.pushMatrix();
        this.scene.translate(-1, 0.66, -this.length - 0.5);
        this.scene.rotate(this.tailRotorAngle, 1, 0, 0);
        this.scene.scale(1, 0.25, 0.25);
        this.scene.rotate(-Math.PI / 2, 0, 0, 1);
        this.makeRotor();
        this.scene.popMatrix();

        // Bucket
        this.scene.pushMatrix();
        this.bucketMaterial.apply();
        this.scene.translate(0, this.line ? -5 : -0.5 , 0);
        this.scene.rotate(Math.PI , 1, 0, 0);
        this.scene.scale(2, 1.5, 2);
        this.bucket.display();
        this.scene.popMatrix();

        if (this.line) {
            this.scene.pushMatrix();
            this.rotorMaterial.apply();
            this.scene.translate(0, -2.5, 0);
            this.scene.rotate(Math.PI / 2, 1, 0, 0);
            this.scene.scale(0.1, 0.1, 5);
            this.box.display();
            this.scene.popMatrix();
        }


        this.makeLandingGear();

        this.scene.popMatrix();
    }

    makeRotor() {
        // Blades
        for (let i = 0; i < 3; i++) {
            this.scene.pushMatrix();
            this.rotorMaterial.apply();
            this.scene.rotate(i * (2 * Math.PI / 3), 0, 1, 0);
            this.scene.translate(0, this.bodyRadius + 0.2, 0);
            this.scene.scale(this.rotorRadius * 3, 0.1, 0.5);
            this.box.display();
            this.scene.popMatrix();
        }

        // Center hub
        this.scene.pushMatrix();
        this.rotorMaterial.apply();
        this.scene.translate(0, 2, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.5, 0.5, 1);
        this.rotorCenter.display();
        this.scene.popMatrix();
    }

    makeLandingGear() {
        const gearTransforms = [
            [1, -0.5, 2, Math.PI / 4],
            [-1, -0.5, 2, Math.PI / 4],
            [-1, -0.5, -2, -Math.PI / 4],
            [1, -0.5, -2, -Math.PI / 4]
        ];

        gearTransforms.forEach(([x, y, z, angle]) => {
            this.scene.pushMatrix();
            this.rotorMaterial.apply();
            this.scene.rotate(Math.PI / 2, 0, 1, 0);
            this.scene.rotate(angle, 1, 0, 0);
            this.scene.translate(x, y, z);
            this.scene.scale(0.25, 0.25, 1.5);
            this.box.display();
            this.scene.popMatrix();
        });

        [[1.6, -2.3, 0], [-1.6, -2.3, 0]].forEach(([x, y, z]) => {
            this.scene.pushMatrix();
            this.rotorMaterial.apply();
            this.scene.translate(x, y, z);
            this.scene.scale(0.25, 0.25, 4.5);
            this.box.display();
            this.scene.popMatrix();
        });
    }
}
