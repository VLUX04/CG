import { CGFscene, CGFcamera, CGFaxis, CGFtexture, CGFshader} from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyBuilding } from "./MyBuilding.js";
import { MyForest } from "./MyForest.js";
import { MyHeli } from "./MyHeli.js";
import { MyFire } from "./MyFire.js";

/**
 * MyScene
 * @constructor 
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
    this.width = 15;
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

    this.minDistance = 1.5;
  }

  init(application) {
    super.init(application);
    this.initCameras();
    this.initLights();
    this.initGLSettings();
    this.initTextures();
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

    // Terrain and Lake
    this.lakeTexture = new CGFtexture(this, "textures/waterTex.jpg");
    this.lakeMap = new CGFtexture(this, "textures/waterMap.jpg");
    this.terrainMask = new CGFtexture(this, "textures/terrain_lake_mask.png");
    this.grassTexture = new CGFtexture(this, "textures/grass.jpg");

    // Fire
    this.yellowFireTexture = new CGFtexture(this, "textures/yellow_fire.jpg");
    this.orangeFireTexture = new CGFtexture(this, "textures/orange_fire.jpg");

    // Sky
    this.skyTexture = new CGFtexture(this, "textures/sky.jpg");
  }

  initShaders() {
    this.testShaders = [
      new CGFshader(this.gl, "shaders/terrain.vert", "shaders/terrain.frag"),
      new CGFshader(this.gl, "shaders/fire.vert", "shaders/fire.frag"),
    ];
    this.heliportShader = new CGFshader(this.gl, "shaders/heliport.vert", "shaders/heliport.frag");
    this.blinkingLightShader = new CGFshader(this.gl, "shaders/heliportLight.vert", "shaders/heliportLight.frag");
  }

  initObjects() {
    this.axis = new CGFaxis(this, 20, 1);
    this.plane = new MyPlane(this, 64);
    this.helicopter = new MyHeli(this);
    this.building = new MyBuilding(
      this, 
      this.width, 
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
    this.fire = new MyFire(this, 6, 1.5)
    this.firePositions = this.generateFirePositions(this.forest, this.minDistance);
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

  generateFirePositions(forest,  minDistance) {
    const firePositions = new Map();
    const numTrees = Math.floor(forest.trees.length / 10) + 1;
    let fireIndices = [];
    for(let i = 0; i < numTrees; i++) {
      let indice = (Math.floor(Math.random() * (forest.trees.length-1)));
      if (!fireIndices.includes(indice)) {
        fireIndices.push(indice);
      }
    }
    for (let j = 0; j < fireIndices.length; j++) {
      const treeIndex = fireIndices[j];
      const tree = forest.trees[treeIndex];
      const angle = Math.random() * 2 * Math.PI;
      const x = tree.x + Math.cos(angle) * minDistance;
      const z = tree.z + Math.sin(angle) * minDistance;
      firePositions.set([x - 20, 0, z], true);
    }
    return firePositions;
  }

  checkKeys() {
    const h = this.helicopter;
    const pressing = (key) => this.gui.isKeyPressed(key);
    const canMove = !h.isAtRest && !h.heliLifting && !h.heliGettingWater && !h.heliGoingHome && h.y > 24 && !h.isDroppingWater;

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

    if (pressing("KeyP") && !h.heliGettingWater && !h.heliGoingHome && !h.heliLifting && !h.isDroppingWater) {
      h.heliLifting = true;
      h.startingLift = true;
      moved = true;
    }

    if (pressing("KeyL") && !h.heliGettingWater && !h.isAtRest && !h.heliGoingHome && !h.heliLifting && !h.isDroppingWater) {
      if (h.vx < 0.1 && h.vz < 0.1 && h.vx > -0.1 && h.vz > -0.1){
        if (h.isHeliAboveLake() && !h.hasWater) {
          h.heliGettingWater = true;
        } else if (!h.hasWater) {
          h.heliGoingHome = true;
        }
      }
    }

    if (pressing("KeyR")) {
      h.reset();
    }
    if (pressing("KeyO") && h.hasWater && !h.isDroppingWater && !h.heliLifting && h.vx < 0.1 && h.vz < 0.1 && h.vx > -0.1 && h.vz > -0.1) {
      this.firePositions.forEach((flag, pos) => {
        if (this.isInsideCircle(h.x * 0.6, h.z * 0.6 - 39, pos[0], pos[2], 3) && flag) {
          h.hasWater = false;
          h.isDroppingWater = true;
          h.waterDropTime = 0;  

        }
      });
    }

    if (h.isDroppingWater && h.waterDropProgress >= 0.95) {
      let eraseFire = false;
      let positions = [];

      this.firePositions.forEach((flag, pos) => {
        if (this.isInsideCircle(h.x * 0.6, h.z * 0.6 - 39, pos[0], pos[2], 3) && flag) {
          positions.push(pos);
          eraseFire = true;
        }
      });

      if (eraseFire && positions.length > 0) {
        for (let i = 0; i < positions.length; i++) {
          this.firePositions.set(positions[i], false);
        }
        h.isDroppingWater = false; 
        h.waterDropProgress = 0;
        h.waterDropTime = 0;      
      }
    }

    if (moved) {
      h.isAtRest = false;
    } else {
      h.inclination = 0;
    }
  }

  isInsideCircle(x, y, cx, cy, radius) {
      return ((x - cx) * (x - cx) + (y - cy) * (y - cy)) <= radius * radius;
  }

  updateBuilding() {
    this.building = new MyBuilding(
      this,
      this.width,
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
    this.helicopter.update();
    this.helicopter.updateHelice();
    const heli = this.helicopter;
    if (this.heliportBlend === undefined) this.heliportBlend = 0;

    if (heli.heliLifting && heli.x < 0.5 && heli.z < 0.5) {
      this.heliportBlend = (Math.floor(t / 400) % 2 === 0) ? 1.0 : 0.0;
    } else if (heli.heliGoingHome && heli.x < 0.5 && heli.z < 0.5 && heli.orientation < 0.05) {
      this.heliportBlend = (Math.floor(t / 350) % 2 === 0) ? 1.0 : 0.0;
    } 
    else this.heliportBlend = 0.0;

    this.building.setHeliportTexture(
        heli.heliLifting ? "UP" : 
        (heli.heliGoingHome && heli.orientation < 0.05 ? "DOWN" : "H")
    );

    this.isBlinking = (heli.heliLifting || heli.heliGoingHome) && heli.x < 0.5 && heli.z < 0.5;

    this.heliportShader.setUniformsValues({ blendFactor: this.heliportBlend, uTexture1: 0, uTexture2: 1 });
    this.blinkingLightShader.setUniformsValues({ uBlink: this.heliportBlend, uColor: [1.0, 1.0, 0.0] }); 

    const minCameraHeight = 2;
    if (this.camera.position[1] < minCameraHeight) {
      this.camera.position[1] = minCameraHeight;
    }

    const maxDistance = 100;
    const pos = this.camera.position;
    const distance = Math.sqrt(pos[0] ** 2 + pos[1] ** 2 + pos[2] ** 2);

    if (distance > maxDistance) {
      const scale = maxDistance / distance;
      pos[0] *= scale;
      pos[1] *= scale;
      pos[2] *= scale;
    }
  }

  updateForest() {
    this.forest = new MyForest(this, this.forestRows, this.forestCols, this.forestWidth, this.forestHeight, this.trunkTexture, this.canopyTexture);
    this.firePositions = this.generateFirePositions(this.forest, this.minDistance);
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

    // Lake and Terrain using Mask
    this.setActiveShader(this.testShaders[0]);
    this.testShaders[0].setUniformsValues({
      uSampler: 0, // lake texture
      uSampler1: 1, // waterMap 
      uSampler2: 2, // terrainMask
      uSampler3: 3  // grass texture
    });
    this.lakeTexture.bind(0);  
    this.lakeMap.bind(1);       
    this.terrainMask.bind(2);   
    this.grassTexture.bind(3); 
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT); 
    this.pushMatrix();
    this.scale(400, 1, 400);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.plane.display();
    this.popMatrix();
    this.setActiveShader(this.defaultShader);

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
    this.firePositions.forEach((flag, pos) => {
      if(flag){
        this.pushMatrix();
        this.translate(...pos);
        this.setActiveShader(this.testShaders[1]);
        this.testShaders[1].setUniformsValues({
          uTime: performance.now() / 1000.0,
          uRandomness: 35 + 5,
        });
        // Yellow fire
        this.yellowFireTexture.bind(0); 
        this.fire.displayLayer(0);
        // Orange fire
        this.orangeFireTexture.bind(0); 
        this.fire.displayLayer(1);
        this.popMatrix();
      }
    });
    this.setActiveShader(this.defaultShader);

    // Helicopter
    this.pushMatrix();
    this.translate(0, 10, -39);
    this.scale(0.6,0.6,0.6)
    this.helicopter.display();
    this.popMatrix();
  }
}