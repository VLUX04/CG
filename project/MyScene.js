import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture, CGFshader} from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyBuilding } from "./MyBuilding.js";
import { MyForest } from "./MyForest.js";
import { MyHeli } from "./MyHeli.js";
import { MyLake } from "./MyLake.js";

/**
 * MyScene
 * @constructor 
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
    this.centralWidth = 5;
    this.sideWidthPerc = 0.75; 
    this.numFloors = 3;
    this.numWindows = 2;

    this.forestRows = 5; 
    this.forestCols = 4;
    this.forestWidth = 20; 
    this.forestHeight = 20;

    this.heliLifting = false;
    this.heliGoingHome = false;
    this.heliGettingWater = false;

    this.speedFactor = 3;

    this.lakePosition = { x: 25, z: 0 };
    this.lakeSize = { width: 30, depth: 30 }; 
  }
  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();

    this.gl.clearColor(0, 0, 0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);

    this.setUpdatePeriod(50);

    this.axis = new CGFaxis(this, 20, 1);
    this.plane = new MyPlane(this, 64);
    this.helicopter = new MyHeli(this);

    this.building = new MyBuilding(
      this,
      5,
      0.75, 
      3,
      2,
      "textures/window.jpg",
      [1, 1, 1]
    );

    this.panorama = new MyPanorama(this, "textures/sky.jpg");

    this.grassTexture = new CGFappearance(this);
    this.grassTexture.setAmbient(0.3, 0.3, 0.3, 1);
    this.grassTexture.setDiffuse(0.7, 0.7, 0.7, 1);
    this.grassTexture.setSpecular(0.0, 0.0, 0.0, 1);
    this.grassTexture.setShininess(10.0);
    this.grassTexture.loadTexture("textures/grass.jpg");
    this.grassTexture.setTextureWrap("REPEAT", "REPEAT");

    this.trunkTexture = new CGFtexture(this, "textures/trunk.jpg");
    this.canopyTexture = new CGFtexture(this, "textures/tree_crown.jpg");

    this.forest = new MyForest(this, this.forestRows, this.forestCols, this.forestWidth, this.forestHeight, this.trunkTexture, this.canopyTexture);
    
    this.lake = new MyLake(this);

    this.lakeAppearance = new CGFappearance(this);
    this.lakeAppearance.setAmbient(0.3, 0.3, 0.3, 1);
    this.lakeAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
    this.lakeAppearance.setSpecular(0.0, 0.0, 0.0, 1);
    this.lakeAppearance.setShininess(120);
    this.lakeTexture = new CGFtexture(this, "textures/waterTex.jpg");
    this.lakeAppearance.setTexture(this.texture);
    this.lakeAppearance.setTextureWrap("REPEAT", "REPEAT");
    this.lakeTexture2 = new CGFtexture(this, "textures/waterMap.jpg");

    this.testShaders = [
        new CGFshader(this.gl, "shaders/water.vert", "shaders/water.frag"),
    ];

    this.setUpdatePeriod(50);
  }

  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      1,
      0.1,
      1000,
      vec3.fromValues(15, 15, 15),
      vec3.fromValues(0, 0, -10)
    );
  }
  checkKeys() {
    const h = this.helicopter;
    const pressing = (key) => this.gui.isKeyPressed(key);
    const canMove = !h.isAtRest && !this.heliLifting && !this.heliGettingWater;

    let moved = false;

    if (canMove) {
      if (pressing("KeyW")) {
        h.x += h.speed * this.speedFactor * Math.sin(h.orientation);
        h.z += h.speed * this.speedFactor * Math.cos(h.orientation);
        h.inclination = 0.1;
        moved = true;
      } else if (pressing("KeyS")) {
        h.x -= h.speed * this.speedFactor * Math.sin(h.orientation);
        h.z -= h.speed * this.speedFactor * Math.cos(h.orientation);
        h.inclination = -0.1;
        moved = true;
      }

      if (pressing("KeyA")) {
        h.orientation += 0.05 * this.speedFactor;
        moved = true;
      } else if (pressing("KeyD")) {
        h.orientation -= 0.05 * this.speedFactor;
        moved = true;
      }
    }

    if (pressing("KeyP") && !this.heliGettingWater) {
      this.heliLifting = true;
      moved = true;
    }

    if (pressing("KeyL") && !this.heliGettingWater) {
      if (this.isHeliAboveLake() && !h.hasWater) {
        this.heliGettingWater = true;
      } else if (!h.hasWater) {
        this.heliGoingHome = true;
      }
    }

    if (pressing("KeyR")) {
      Object.assign(h, {
        x: 0,
        y: 0,
        z: 0,
        orientation: 0,
        isAtRest: true,
        hasWater: false
      });
      this.heliLifting = false;
      this.heliGoingHome = false;
      this.heliGettingWater = false;
    }

    if (moved) {
      h.isAtRest = false;
    } else {
      h.inclination = 0;
      console.log(`Heli: (${h.x.toFixed(2)}, ${h.y.toFixed(2)}, ${h.z.toFixed(2)}) angle: ${h.orientation.toFixed(2)}`);
    }
  }

  normalizeAngle(angle) {
    return ((angle + Math.PI) % (2 * Math.PI)) - Math.PI;
  }

  update(t) {
    this.testShaders[0].setUniformsValues({ timeFactor: t / 100 % 100 });
    this.checkKeys();
    if (!this.helicopter.isAtRest) {
        this.helicopter.update(t);
    }

    if (this.heliLifting) {
        if (this.helicopter.y < 25) {
            this.helicopter.y += this.helicopter.speed * this.speedFactor;
        } else {
            this.heliLifting = false;
        }
    }

    this.helicopter.line = !this.helicopter.isAtRest && !this.heliLifting || ( this.helicopter.hasWater && this.heliLifting) ;



    if (this.heliGoingHome && !this.heliLifting) {
      const heli = this.helicopter;
      const tolerance = 0.3 * this.speedFactor;
      const orientationTolerance = 0.05 * this.speedFactor;

      const dx = -heli.x;
      const dz = -heli.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance > tolerance) {
          const targetOrientation = Math.atan2(dx, dz);
          const orientationDiff = this.normalizeAngle(targetOrientation - heli.orientation);

          if (Math.abs(orientationDiff) > orientationTolerance) {
              heli.orientation += orientationDiff > 0 ? 0.05 * this.speedFactor : -0.05 * this.speedFactor;
          } else {
              heli.x += (dx / distance) * heli.speed * this.speedFactor;
              heli.z += (dz / distance) * heli.speed * this.speedFactor;
              heli.inclination = 0.1;
          }
      }
      else {
          const rotationDiff = this.normalizeAngle(0 - heli.orientation);
          if (Math.abs(rotationDiff) > orientationTolerance) {
              heli.orientation += rotationDiff > 0 ? 0.05 * this.speedFactor : -0.05 * this.speedFactor;
          } else if (heli.y > 0) {
              heli.y -= heli.speed;
              heli.line = false;
          } else {
              heli.isAtRest = true;
              this.heliGoingHome = false;
          }
      }
    }
    if (this.heliGettingWater) {
        if (this.helicopter.y > - 13) {
          this.helicopter.y -= this.helicopter.speed * this.speedFactor;
        }
        else {
          this.helicopter.hasWater = true;
          this.heliGettingWater = false;
        }
    }


    const minCameraHeight = 2;
    if (this.camera.position[1] < minCameraHeight) {
        this.camera.position[1] = minCameraHeight;
    }
    const planeSize = 200; 
    this.camera.position[0] = Math.max(-planeSize, Math.min(planeSize, this.camera.position[0])); 
    this.camera.position[2] = Math.max(-planeSize, Math.min(planeSize, this.camera.position[2]));
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

  isHeliAboveLake() {
    const heli = this.helicopter;


    const renderOffsetX = 0;
    const renderOffsetZ = -39;
    const renderScale = 0.6;

    const heliX = heli.x * renderScale + renderOffsetX;
    const heliZ = heli.z * renderScale + renderOffsetZ;

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
    console.log(`Heli at (${heliX.toFixed(2)}, ${heliZ.toFixed(2)}), inside lake: ${isInside}`);
    return isInside;
  }




  
  updateForest() {
    this.forest = new MyForest(this, this.forestRows, this.forestCols, this.forestWidth, this.forestHeight, this.trunkTexture, this.canopyTexture);
  }

  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }
  display() {
    // ---- BEGIN Background, camera and axis setup
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.updateProjectionMatrix();
    this.loadIdentity();
    this.applyViewMatrix();

    this.setDefaultAppearance();

    this.pushMatrix();
    this.grassTexture.apply();
    this.scale(400, 1, 400);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.plane.display();
    this.popMatrix();

    this.pushMatrix();
    this.panorama.display(this.camera.position);
    this.popMatrix();

    this.pushMatrix();
    this.scale(2, 2, 2); 
    this.translate(0, 0, -20);
    this.building.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(-20, 0, 0);
    this.forest.display(); 
    this.popMatrix();

    this.pushMatrix();
    this.translate(0, 10, -39);
    this.scale(0.6,0.6,0.6)
    this.helicopter.display();
    this.popMatrix();

    this.lakeAppearance.apply();
    this.setActiveShader(this.testShaders[0]);

    this.testShaders[0].setUniformsValues({
        uSampler: 0,    
        uSampler2: 1,   
        waterMap: 1    
    });

    this.lakeTexture.bind(0);   
    this.lakeTexture2.bind(1);  

    this.pushMatrix();
    this.translate(25, 0.1, 0);
    this.scale(20, 1, 20);      
    this.lake.display();
    this.popMatrix();

    this.setActiveShader(this.defaultShader); 
  }
}