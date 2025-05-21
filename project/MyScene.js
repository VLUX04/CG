import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture, CGFshader} from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyBuilding } from "./MyBuilding.js";
import { MyForest } from "./MyForest.js";
import { MyHeli } from "./MyHeli.js";
import { MyLake } from "./MyLake.js";
import { MyFire } from "./MyFire.js";

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
    this.forestWidth = 30; 
    this.forestHeight = 30;

    this.speedFactor = 3;

    this.heliportHeight = 3.33 * (this.numFloors - 3);

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

    this.trunkTexture = new CGFtexture(this, "textures/trunk.jpg");
    this.canopyTexture = new CGFtexture(this, "textures/tree_crown.jpg");
    this.forest = new MyForest(this, this.forestRows, this.forestCols, this.forestWidth, this.forestHeight, this.trunkTexture, this.canopyTexture);
    
    this.lake = new MyLake(this);

    this.grassTexture = new CGFappearance(this);
    this.grassTexture.setAmbient(0.3, 0.3, 0.3, 1);
    this.grassTexture.setDiffuse(0.7, 0.7, 0.7, 1);
    this.grassTexture.setSpecular(0.0, 0.0, 0.0, 1);
    this.grassTexture.setShininess(10.0);
    this.grassTexture.loadTexture("textures/grass.jpg");
    this.grassTexture.setTextureWrap("REPEAT", "REPEAT");

    this.lakeAppearance = new CGFappearance(this);
    this.lakeAppearance.setAmbient(0.3, 0.3, 0.3, 1);
    this.lakeAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
    this.lakeAppearance.setSpecular(0.0, 0.0, 0.0, 1);
    this.lakeAppearance.setShininess(120);
    this.lakeTexture = new CGFtexture(this, "textures/waterTex.jpg");
    this.lakeTexture2 = new CGFtexture(this, "textures/waterMap.jpg");

    this.heliportTextureH = new CGFtexture("textures/heliport.png");
    this.heliportTextureUP = new CGFtexture("textures/UP_image.png");
    this.heliportTextureDOWN = new CGFtexture("textures/DOWN_image.png");

    this.testShaders = [
        new CGFshader(this.gl, "shaders/water.vert", "shaders/water.frag"),
    ];

    this.fires = [
        new MyFire(this, 8, 2.5, 0.7),
        new MyFire(this, 10, 2.2, 0.6),
        new MyFire(this, 7, 2.8, 0.8)
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
    const canMove = !h.isAtRest && !h.heliLifting && !h.heliGettingWater && !h.heliGoingHome && h.y > 24;

    let moved = false;

    if (canMove) {
      if (pressing("KeyW")) {
        h.acelerate(1, false);
        moved = true;
      } else if (pressing("KeyS")) {
        h.acelerate(-1, false)
        moved = true;
      }

      if (pressing("KeyA")) {
        h.rotate(1, false);
        moved = true;
      } else if (pressing("KeyD")) {
        h.rotate(-1, false);
        moved = true;
      }
    }

    if (pressing("KeyP") && !h.heliGettingWater) {
      h.heliLifting = true;
      moved = true;
    }

    if (pressing("KeyL") && !h.heliGettingWater) {
      if (h.isHeliAboveLake() && !h.hasWater) {
        h.heliGettingWater = true;
      } else if (!h.hasWater) {
        h.heliGoingHome = true;
      }
    }

    if (pressing("KeyR")) {
      h.reset();
    }
    if (pressing("KeyO") && h.hasWater && !h.isDroppingWater) {
        h.hasWater = false;
        h.isDroppingWater = true;
        h.waterDropTime = 0;
    }

    if (moved) {
      h.isAtRest = false;
    } else {
      h.inclination = 0;
    }
  }

  updateBuilding() {
      this.building = new MyBuilding(
          this,
          this.centralWidth,
          this.sideWidthPerc,
          this.numFloors,
          this.numWindows,
          "textures/window.jpg",
          [1, 1, 1],
          this.heliportTextureH,
          this.heliportTextureUP,
          this.heliportTextureDOWN
      );
      this.helicopter.heliportHeight = 3.33 * (this.numFloors - 3);
      this.helicopter.update()
  }

  update(t) {
    this.testShaders[0].setUniformsValues({ timeFactor: t / 100 % 100 });
    this.checkKeys();
    if (!this.helicopter.isAtRest) {
        this.helicopter.update();
        this.helicopter.updateHelice();
    }

    let blink = Math.floor((t / 250) % 2) === 0;
    const heli = this.helicopter;
    if (heli.heliLifting) {
        this.building.setHeliportTexture(blink ? "H" : "UP");
    } else if (heli.heliGoingHome && heli.x < 1 && heli.z < 1) {
        this.building.setHeliportTexture(blink ? "H" : "DOWN");
    } else {
        this.building.setHeliportTexture("H");
    }

    let isManeuvering = (heli.heliLifting || heli.heliGoingHome) && heli.x < 1 && heli.z < 1;
    if (isManeuvering) {
        const pulse = 0.5 + 0.5 * Math.sin(t / 200);
        this.heliportLightEmission = [pulse, pulse, 0, 1];
    } else {
        this.heliportLightEmission = [0, 0, 0, 1];
    }


    const minCameraHeight = 2;
    if (this.camera.position[1] < minCameraHeight) {
        this.camera.position[1] = minCameraHeight;
    }
    const planeSize = 200; 
    this.camera.position[0] = Math.max(-planeSize, Math.min(planeSize, this.camera.position[0])); 
    this.camera.position[2] = Math.max(-planeSize, Math.min(planeSize, this.camera.position[2]));
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

    const firePositions = [
        [-24, 0, 0],
        [-22, 0, -2],
        [-20, 0, 0]
    ];

    for (let i = 0; i < this.fires.length; i++) {
        this.pushMatrix();
        this.translate(...firePositions[i]);
        this.fires[i].display();
        this.popMatrix();
    }
  }
}