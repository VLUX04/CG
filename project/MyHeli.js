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
        this.mainRotorAngle = 0;
        this.tailRotorAngle = 0;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.orientation = 0;
        this.speed = 1;
        this.inclination = 0;
        this.waterDropTime = 0;
        this.waterDropDuration = 60; 
        this.waterDropProgress = 0;
        this.heliportHeight = 0;

        this.bucketLiftProgress = 0; 
        this.bucketLiftSpeed = 0.04;

        this.vx = 0;
        this.vz = 0;
        this.acceleration = 0.1;
        this.friction = 0.9;
        this.maxSpeed = 10;

        this.line = false;
        this.isAtRest = true;
        this.hasWater = false;
        this.heliLifting = false;
        this.heliGoingHome = false;
        this.heliGettingWater = false;
        this.isDroppingWater = false;

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

        this.waterMaterial = new CGFappearance(scene);
        this.waterMaterial.setAmbient(0.2, 0.2, 0.5, 1);
        this.waterMaterial.setDiffuse(0.4, 0.4, 0.9, 1);
        this.waterMaterial.setSpecular(0.5, 0.5, 1.0, 1);
        this.waterMaterial.setShininess(120.0);

        this.body = new MySphere(scene, 16, 16);
        this.rotorCenter = new MyCylinder(scene, 16, 16);
        this.tail = new MyTruncatedCone(scene, this.tailLength, this.tailRadius, false);
        this.box = new MyBox(scene, true, true, true, true, true, true);
        this.bucket = new MyTruncatedCone(scene, this.bucketHeight, this.bucketRadius, false);

        this.initBuffers();
    }

    update() {

        if (this.y != this.heliportHeight && this.isAtRest) {
            this.y = this.heliportHeight;
        }
        
        if (this.isDroppingWater) {
            this.waterDropTime++;
            this.waterDropProgress = this.waterDropTime / this.waterDropDuration;
            if (this.waterDropTime >= this.waterDropDuration) {
                this.isDroppingWater = false;
                this.waterDropTime = 0;
                this.waterDropProgress = 0;
            }
        }
        if (this.heliLifting) {
            if (this.y < 25) {
                this.y += this.speed / 2;
            } else {
                this.heliLifting = false;
            }
        }

        this.line = !this.isAtRest && (!this.heliLifting || this.hasWater) && !(this.heliGoingHome && this.x < 0.5 && this.z < 0.5 && this.x > -0.5 && this.z > -0.5 && this.orientation < 0.1 && this.orientation > -0.1);

        if (this.line) {
            this.bucketLiftProgress = Math.min(1, this.bucketLiftProgress + this.bucketLiftSpeed);
        } else {
            this.bucketLiftProgress = Math.max(0, this.bucketLiftProgress - this.bucketLiftSpeed);
        }


        if (this.heliGoingHome && !this.heliLifting) {
            const tolerance = 0.5;
            const orientationTolerance = 0.05;

            const dx = -this.x;
            const dz = -this.z;
            const distance = Math.sqrt(dx * dx + dz * dz);

            if (distance > tolerance) {
                const targetOrientation = Math.atan2(dx, dz);
                const orientationDiff = this.normalizeAngle(targetOrientation - this.orientation);

                if (Math.abs(orientationDiff) > orientationTolerance) {
                    orientationDiff > 0 ? this.rotate(1,true) : this.rotate(-1,true);
                } else {
                    this.acelerate(1, true);
                }
            }
            else {
                const rotationDiff = this.normalizeAngle(0 - this.orientation);
                if (Math.abs(rotationDiff) > orientationTolerance) {
                    rotationDiff > 0 ? this.rotate(1,true) : this.rotate(-1,true);
                } else if (this.y > this.heliportHeight && this.bucketLiftProgress < 0.01) {
                    this.y -= this.speed / 2;
                } else if (this.bucketLiftProgress < 0.01) {
                    this.isAtRest = true;
                    this.heliGoingHome = false;
                }
            }
        }
        if (this.heliGettingWater) {
            if (this.y > - 13) {
                this.y -= this.speed / 2;
            }
            else {
                this.hasWater = true;
                this.heliGettingWater = false;
            }
        }

        const currentSpeed = Math.sqrt(this.vx * this.vx + this.vz * this.vz);
        if (currentSpeed > this.maxSpeed) {
            const scale = this.maxSpeed / currentSpeed;
            this.vx *= scale;
            this.vz *= scale;
        }

        this.x += this.vx;
        this.z += this.vz;

        this.vx *= this.friction;
        this.vz *= this.friction;
    }

    updateHelice() {
        this.mainRotorAngle += 6 ; 
        this.tailRotorAngle += 8 ;

        this.mainRotorAngle %= 2 * Math.PI;
        this.tailRotorAngle %= 2 * Math.PI;
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.orientation = 0;
        this.inclination = 0;
        this.line = false;
        this.isAtRest = true;
        this.hasWater = false;
        this.heliLifting = false;
        this.heliGoingHome = false;
        this.heliGettingWater = false;
        this.isDroppingWater = false;
        this.waterDropTime = 0;
        this.waterDropProgress = 0;
        this.bucketLiftProgress = 0;
    }

    acelerate(flag, auto) {
        if (auto) {
            this.x += (this.speed * Math.sin(this.orientation)) * flag;
            this.z += (this.speed * Math.cos(this.orientation)) * flag;
            this.inclination = 0.1 * flag;
        } else {
            this.vx += this.acceleration * Math.sin(this.orientation) * flag * this.scene.speedFactor;
            this.vz += this.acceleration * Math.cos(this.orientation) * flag * this.scene.speedFactor;
            this.inclination = 0.1 * flag;
        }
    }

    rotate(flag, auto) {
        this.orientation += (0.05 * (auto ? 1 : this.scene.speedFactor)) * flag;
    }

    display() {
        this.scene.pushMatrix();

        this.scene.translate(this.x, this.y, this.z);

        this.scene.pushMatrix();

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

        // Tail rotor
        this.scene.pushMatrix();
        this.scene.translate(-1, 0.66, -this.length - 0.5);
        this.scene.rotate(this.tailRotorAngle, 1, 0, 0);
        this.scene.scale(1, 0.25, 0.25);
        this.scene.rotate(-Math.PI / 2, 0, 0, 1);
        this.makeRotor();
        this.scene.popMatrix();

        const bucketY = -0.5 - 4.5 * this.bucketLiftProgress;

        // Bucket
        this.scene.pushMatrix();
        this.bucketMaterial.apply();
        this.scene.translate(0, bucketY, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.scale(2, 1.5, 2);
        this.bucket.display();
        this.scene.popMatrix();

        if (this.bucketLiftProgress > 0.01) {
            this.scene.pushMatrix();
            this.rotorMaterial.apply();
            this.scene.translate(0, -2.5, 0);
            this.scene.rotate(Math.PI / 2, 1, 0, 0);
            this.scene.scale(0.1, 0.1, 5 * this.bucketLiftProgress);
            this.box.display();
            this.scene.popMatrix();
        }

        if (this.hasWater) {
            this.scene.pushMatrix();
            this.waterMaterial.apply();
            this.scene.translate(0, -5, 0);
            this.scene.rotate(Math.PI , 1, 0, 0);
            this.scene.scale(0.9, 0.1, 0.9);
            this.body.display();
            this.scene.popMatrix();
        }

        if (this.isDroppingWater) {
            const numParticles = 50;
            const emissionDuration = 0.4;

            this.scene.pushMatrix();
            this.scene.translate(0, -6, 0);

            for (let i = 0; i < numParticles; i++) {
                const particleStart = (i / numParticles) * emissionDuration;
                const dropProgress = (this.waterDropProgress - particleStart) / (1 - particleStart);
                if (dropProgress < 0 || dropProgress > 1) continue;

                function pseudoRandom(seed) {
                    return Math.abs(Math.sin(seed) * 43758.5453) % 1;
                }

                const angle = pseudoRandom(i * 43.23) * 2 * Math.PI;
                const lateralSpread = pseudoRandom(i * 92.3) * 3;

                const xOffset = Math.cos(angle) * lateralSpread * dropProgress;
                const zOffset = Math.sin(angle) * lateralSpread * dropProgress;
                const yOffset = -40 * dropProgress + 7 * Math.sin(dropProgress * Math.PI);

                this.scene.pushMatrix();
                this.scene.translate(xOffset, yOffset, zOffset);
                this.scene.scale(0.2 * (1 + dropProgress), 0.08 * (1 + dropProgress), 0.2 * (1 + dropProgress));

                this.waterMaterial.apply();
                this.body.display();
                this.scene.popMatrix();
            }

            this.scene.popMatrix();
        }


        this.makeLandingGear();

        this.scene.popMatrix();
        
        // Main rotor
        this.scene.pushMatrix();
        this.scene.rotate(this.mainRotorAngle, 0, 1, 0);
        this.makeRotor();
        this.scene.popMatrix();

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

    isHeliAboveLake() {

        const renderOffsetX = 0;
        const renderOffsetZ = -39;
        const renderScale = 0.6;

        const heliX = this.x * renderScale + renderOffsetX;
        const heliZ = this.z * renderScale + renderOffsetZ;

        const lakeCenter = { x: 25, z: 0 };
        const lakeScaleX = 20;
        const lakeScaleZ = 20;
        const baseRadius = 1;
        const segments = 100;

        function noise(angle) {
        return (
            0.3 *
            (Math.sin(3 * angle) +
            0.5 * Math.sin(5.7 * angle + 1.2) +
            0.3 * Math.cos(2.2 * angle - 0.7))
        );
        }

        const polygon = [];

        for (let i = 0; i <= segments; i++) {
        const angle = (2 * Math.PI * i) / segments;

        const distortion = noise(angle);
        const radius = baseRadius + distortion;

        const x = lakeCenter.x + lakeScaleX * radius * Math.cos(angle);
        const z = lakeCenter.z + lakeScaleZ *  radius * Math.sin(angle);
        polygon.push([x, z]);
        }

        function pointInPolygon(x, z, polygon) {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i][0], zi = polygon[i][1];
            const xj = polygon[j][0], zj = polygon[j][1];

            const intersect =
            zi > z !== zj > z &&
            x < ((xj - xi) * (z - zi)) / (zj - zi + 0.000001) + xi;
            if (intersect) inside = !inside;
        }
        return inside;
        }

        const isInside = pointInPolygon(heliX, heliZ, polygon);
        return isInside;
    }

    getClosestOrientation(currentOrientation, validOrientation) {
        let closest = validOrientation;
        const normalizeAngle = (angle) => {
            return ((angle + Math.PI) % (2 * Math.PI)) - Math.PI;
        };

        const normalizedCurrent = normalizeAngle(currentOrientation);
        let minDifference = Math.abs(normalizeAngle(normalizedCurrent - validOrientation));

        const normalizedOrientation = normalizeAngle(validOrientation);
        const difference = Math.abs(normalizeAngle(normalizedCurrent - normalizedOrientation));
        if (difference < minDifference) {
            closest = validOrientation;
            minDifference = difference;
        }

        return closest;
    }

    normalizeAngle(angle) {
        return ((angle + Math.PI) % (2 * Math.PI)) - Math.PI;
    }
}
