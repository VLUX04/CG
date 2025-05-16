import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture, CGFshader} from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyBuilding } from "./MyBuilding.js";
import { MyForest } from "./MyForest.js";
import { MyHeli } from "./MyHeli.js";

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

    this.speedFactor = 1;

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
    
    this.lake = new MyPlane(this, 32, 0, 10, 0, 10);

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
    let moved = false;

    if (this.gui.isKeyPressed("KeyW") && !h.isAtRest) {
      h.x += h.speed * this.speedFactor * Math.sin(h.orientation);
      h.z += h.speed * this.speedFactor * Math.cos(h.orientation);
      h.inclination = 0.1;
      moved = true;
    }
    if (this.gui.isKeyPressed("KeyS") && !h.isAtRest) {
        h.x -= h.speed * this.speedFactor * Math.sin(h.orientation);
        h.z -= h.speed * this.speedFactor * Math.cos(h.orientation);
        h.inclination = -0.1;
        moved = true;
    }
    if (this.gui.isKeyPressed("KeyA") && !h.isAtRest) {
        h.orientation += 0.05;
        moved = true;
    }
    if (this.gui.isKeyPressed("KeyD") && !h.isAtRest) {
        h.orientation -= 0.05;
        moved = true;
    }
    if (this.gui.isKeyPressed("KeyP")) {
        this.heliLifting = true;
        moved = true;
    }
    if (this.gui.isKeyPressed("KeyL") && !h.isAtRest) {
        if (this.isHeliAboveLake() && !this.helicopter.hasWater) {
            this.heliGettingWater = true;
        }
        else if (!this.helicopter.hasWater) {
            this.heliGoingHome = true;
        }
    }
    if (this.gui.isKeyPressed("KeyR")) {
        h.y = 0;
        h.x = 0;
        h.z = 0;
        h.orientation = 0;
        h.isAtRest = true;
        this.heliLifting = false;
        h.hasWater = false;
        this.heliGoingHome = false;
        this.heliGettingWater = false;
    }

    if (moved)
        h.isAtRest = false;
    else {
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
            this.helicopter.y += this.helicopter.speed;
        } else {
            this.heliLifting = false;
        }
    }

    this.helicopter.line = !this.helicopter.isAtRest && !this.heliLifting || ( this.helicopter.hasWater && this.heliLifting) ;



    if (this.heliGoingHome) {
      const heli = this.helicopter;
      const tolerance = 0.3;
      const orientationTolerance = 0.05;

      const dx = -heli.x;
      const dz = -heli.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance > tolerance) {
          const targetOrientation = Math.atan2(dx, dz);
          const orientationDiff = this.normalizeAngle(targetOrientation - heli.orientation);

          if (Math.abs(orientationDiff) > orientationTolerance) {
              heli.orientation += orientationDiff > 0 ? 0.05 : -0.05;
          } else {
              heli.x += (dx / distance) * heli.speed;
              heli.z += (dz / distance) * heli.speed;
              heli.inclination = 0.1;
          }
      }
      else {
          const rotationDiff = this.normalizeAngle(0 - heli.orientation);
          if (Math.abs(rotationDiff) > orientationTolerance) {
              heli.orientation += rotationDiff > 0 ? 0.05 : -0.05;
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
          this.helicopter.y -= this.helicopter.speed;
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
    this.camera.position[0] = Math.max(-planeSize, Math.min(planeSize, this.camera.position[0])); // X-axis
    this.camera.position[2] = Math.max(-planeSize, Math.min(planeSize, this.camera.position[2])); // Z-axis
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
        const lake = this.lakePosition;
        const size = this.lakeSize;

        const lakeXMin = lake.x - size.width / 2;
        const lakeXMax = lake.x + size.width / 2;
        const lakeZMin = lake.z - size.depth / 2;
        const lakeZMax = lake.z + size.depth / 2;

        console.log(`Heli Position: (${heli.x}, ${heli.y}, ${heli.z - 39})`);
        console.log(`Lake Position: (${lake.x}, ${lake.z})`);
        console.log(`Lake Bounds: X(${lakeXMin}, ${lakeXMax}), Z(${lakeZMin}, ${lakeZMax})`);

        return (
            heli.x >= lakeXMin &&
            heli.x <= lakeXMax &&
            heli.z - 39 >= lakeZMin &&
            heli.z - 39 <= lakeZMax
        );
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
        uSampler: 0,    // waterTex.jpg (fragment shader)
        uSampler2: 1,   // waterMap.jpg (fragment shader)
        waterMap: 1     // waterMap.jpg (vertex shader)
    });

    this.lakeTexture.bind(0);   
    this.lakeTexture2.bind(1);  

    this.pushMatrix();
    this.translate(25, 0.1, 0);
    this.rotate(-Math.PI / 2, 1, 0, 0); 
    this.scale(30, 30, 0.5);      
    this.lake.display();
    this.popMatrix();

    this.setActiveShader(this.defaultShader); // Reset to default after drawing the lake
  }
}