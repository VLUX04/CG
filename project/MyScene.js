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

    this.minDistance = 2;
    this.numFires = 4;
    this.fires = [];
  }

  init(application) {
    super.init(application);
    this.initCameras();
    this.initLights();
    this.initGLSettings();
    this.initTextures();
    this.initAppearances();
    this.initShaders();
    this.initObjects();
    this.setUpdatePeriod(50);
  }

  initGLSettings() {
    this.gl.clearColor(0, 0, 0, 1.0);
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.enableTextures(true);
  }

  initTextures() {
    // Building
    this.heliportTextureH = new CGFtexture(this, "textures/heliport.png");
    this.heliportTextureUP = new CGFtexture(this, "textures/UP_image.png");
    this.heliportTextureDOWN = new CGFtexture(this, "textures/DOWN_image.png");
    this.windowTexture = new CGFtexture(this, "textures/window.jpg");
    this.letreiroTexture = new CGFtexture(this, "textures/letreiro.png");
    this.doorTexture = new CGFtexture(this, "textures/door.png");
    
    // Forest
    this.trunkTexture = new CGFtexture(this, "textures/trunk.jpg");
    this.canopyTexture = new CGFtexture(this, "textures/tree_crown.jpg");

    // Lake
    this.lakeTexture = new CGFtexture(this, "textures/waterTex.jpg");
    this.lakeTexture2 = new CGFtexture(this, "textures/waterMap.jpg");

    // Fire
    this.yellowFireTexture = new CGFtexture(this, "textures/yellow_fire.jpg");
    this.orangeFireTexture = new CGFtexture(this, "textures/orange_fire.jpg");

    // Grass
    this.grassTexture = new CGFtexture(this, "textures/grass.jpg");

    // Sky
    this.skyTexture = new CGFtexture(this, "textures/sky.jpg");
  }

  initAppearances() {
    // Grass
    this.grassAppearance = new CGFappearance(this);
    this.grassAppearance.setAmbient(0.3, 0.3, 0.3, 1);
    this.grassAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
    this.grassAppearance.setSpecular(0.0, 0.0, 0.0, 1);
    this.grassAppearance.setShininess(10.0);
    this.grassAppearance.setTexture(this.grassTexture);
    this.grassAppearance.setTextureWrap("REPEAT", "REPEAT");

    // Lake
    this.lakeAppearance = new CGFappearance(this);
    this.lakeAppearance.setAmbient(0.3, 0.3, 0.3, 1);
    this.lakeAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
    this.lakeAppearance.setSpecular(0.0, 0.0, 0.0, 1);
    this.lakeAppearance.setShininess(120);

    // Fire
    this.fireAppearances = [
      new CGFappearance(this),
      new CGFappearance(this),
    ];
    this.fireAppearances[0].setAmbient(1.0, 1.0, 0.2, 1.0);
    this.fireAppearances[0].setDiffuse(1.0, 1.0, 0.2, 1.0);
    this.fireAppearances[0].setEmission(1.0, 1.0, 0.2, 1.0);
    this.fireAppearances[1].setAmbient(1.0, 0.5, 0.1, 1.0);
    this.fireAppearances[1].setDiffuse(1.0, 0.5, 0.1, 1.0);
    this.fireAppearances[1].setEmission(1.0, 0.5, 0.1, 1.0);
  }

  initShaders() {
    this.testShaders = [
      new CGFshader(this.gl, "shaders/water.vert", "shaders/water.frag"),
      new CGFshader(this.gl, "shaders/fire.vert", "shaders/fire.frag"),
    ];
  }

  initObjects() {
    this.axis = new CGFaxis(this, 20, 1);
    this.plane = new MyPlane(this, 64);
    this.helicopter = new MyHeli(this);
    this.building = new MyBuilding(
      this, 
      this.centralWidth, 
      this.sideWidthPerc, 
      this.numFloors, 
      this.numWindows,
      [1, 1, 1], 
      this.windowTexture, 
      this.letreiroTexture, 
      this.doorTexture,
      this.heliportTextureH, 
      this.heliportTextureUP, 
      this.heliportTextureDOWN
    );
    this.panorama = new MyPanorama(this, this.skyTexture);
    this.forest = new MyForest(this, this.forestRows, this.forestCols, this.forestWidth, this.forestHeight, this.trunkTexture, this.canopyTexture);
    this.lake = new MyLake(this);

    // Fire positions and objects
    this.firePositions = this.generateFirePositions(this.forest, this.numFires, this.minDistance);
    for (let i = 0; i < this.firePositions.length; i++) {
      this.fires.push(new MyFire(this, 8, 2.5, 0.7));
    }
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
      vec3.fromValues(-15, 15, 45),
      vec3.fromValues(0, 0, -15)
    );
  }

  generateFirePositions(forest, numFires, minDistance) {
    const firePositions = [];
    const selectedTree = forest.trees[0];
    for (let i = 0; i < numFires; i++) {
      const angle = (2 * Math.PI * i) / numFires;
      const x = selectedTree.x + Math.cos(angle) * minDistance;
      const z = selectedTree.z + Math.sin(angle) * minDistance;

      firePositions.push([x - 20, 0, z]);
    }
    return firePositions;
  }

  checkKeys() {
    const h = this.helicopter;
    const pressing = (key) => this.gui.isKeyPressed(key);
    const canMove = !h.isAtRest && !h.heliLifting && !h.heliGettingWater && !h.heliGoingHome && h.y > 24;

    let moved = false;

    if (canMove && h.bucketLiftProgress == 1) {
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
        [1, 1, 1],
        this.windowTexture,
        this.letreiroTexture,
        this.doorTexture,
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
    if (heli.heliLifting && heli.x < 0.5 && heli.z < 0.5) {
        this.building.setHeliportTexture(blink ? "H" : "UP");
    } else if (heli.heliGoingHome && heli.x < 0.5 && heli.z < 0.5 && heli.orientation < 0.05) {
        this.building.setHeliportTexture(blink ? "H" : "DOWN");
    } else {
        this.building.setHeliportTexture("H");
    }

    const isBlinking = (heli.heliLifting || heli.heliGoingHome) && heli.x < 0.5 && heli.z < 0.5 ;
    if (isBlinking) {
        const pulse = 0.5 + 0.5 * Math.sin(t / 200);
        this.heliportLightEmission = [pulse, pulse, 0, 1];
    } else {
        this.heliportLightEmission = [1, 1, 0, 1]; 
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
    this.firePositions = this.generateFirePositions(this.forest, this.numFires, this.minDistance);
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

    // Grass terrain
    this.pushMatrix();
    this.grassAppearance.apply();
    this.scale(400, 1, 400);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.plane.display();
    this.popMatrix();

    // Panorama sky
    this.pushMatrix();
    this.panorama.display(this.camera.position);
    this.popMatrix();

    // Building
    this.pushMatrix();
    this.scale(2, 2, 2); 
    this.translate(0, 0, -20);
    this.building.display();
    this.popMatrix();

    // Forest
    this.pushMatrix();
    this.translate(-20, 0, 0);
    this.forest.display(); 
    this.popMatrix();

    // Fires
    for (let i = 0; i < this.fires.length; i++) {
      this.pushMatrix();
      this.translate(...this.firePositions[i]);
      this.setActiveShader(this.testShaders[1]);
      this.testShaders[1].setUniformsValues({
          uTime: performance.now() / 1000.0,
          uRandomness: 35 + i * 5,
      });
      // Yellow fire
      this.fireAppearances[0].apply(); 
      this.yellowFireTexture.bind(0); 
      this.fires[i].displayLayer(0);
      // Orange fire
      this.fireAppearances[1].apply(); 
      this.orangeFireTexture.bind(0); 
      this.fires[i].displayLayer(1);
      this.popMatrix();
    }
    this.setActiveShader(this.defaultShader);

    // Helicopter
    this.pushMatrix();
    this.translate(0, 10, -39);
    this.scale(0.6,0.6,0.6)
    this.helicopter.display();
    this.popMatrix();

    // Lake
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