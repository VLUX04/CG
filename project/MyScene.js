import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture} from "../lib/CGF.js";
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
      this.centralWidth,
      this.sideWidthPerc,
      this.numFloors,
      this.numWindows,
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

    this.lakeTexture = new CGFappearance(this);
    this.lakeTexture.setAmbient(0.2, 0.2, 0.5, 1);
    this.lakeTexture.setDiffuse(0.4, 0.4, 0.8, 1);
    this.lakeTexture.setSpecular(0.8, 0.8, 1.0, 1);
    this.lakeTexture.setShininess(50.0);
    this.lakeTexture.loadTexture("textures/waterTex.jpg");
    this.lakeTexture.setTextureWrap("REPEAT", "REPEAT");

    this.trunkTexture = new CGFtexture(this, "textures/trunk.jpg");
    this.canopyTexture = new CGFtexture(this, "textures/tree_crown.jpg");

    this.forest = new MyForest(this, this.forestRows, this.forestCols, this.forestWidth, this.forestHeight, this.trunkTexture, this.canopyTexture);
    
    this.lake = new MyPlane(this, 32, 0, 10, 0, 10);
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
      vec3.fromValues(15, 3, 0),
      vec3.fromValues(0, 0, 0)
    );
  }
  checkKeys() {
    const h = this.helicopter;
    let moved = false;

    if (this.gui.isKeyPressed("KeyW")) {
        h.x += h.speed * Math.sin(h.orientation);
        h.z += h.speed * Math.cos(h.orientation);
        moved = true;
    }
    if (this.gui.isKeyPressed("KeyS")) {
        h.x -= h.speed * Math.sin(h.orientation);
        h.z -= h.speed * Math.cos(h.orientation);
        moved = true;
    }
    if (this.gui.isKeyPressed("KeyA")) {
        h.orientation += 0.05;
        moved = true;
    }
    if (this.gui.isKeyPressed("KeyD")) {
        h.orientation -= 0.05;
        moved = true;
    }
    if (this.gui.isKeyPressed("KeyQ")) {
        h.y += h.speed;
        moved = true;
    }
    if (this.gui.isKeyPressed("KeyE")) {
        h.y -= h.speed;
        moved = true;
    }

    if (moved)
        console.log(`Heli: (${h.x.toFixed(2)}, ${h.y.toFixed(2)}, ${h.z.toFixed(2)}) angle: ${h.orientation.toFixed(2)}`);
  }


  update(t) {
    this.checkKeys();
    this.helicopter.update(t);
  }
  
  updateBuilding() {
    this.building = new MyBuilding(
        this,
        this.centralWidth,
        this.sideWidthPerc,
        this.numFloors,
        this.numWindows,
        "textures/window.jpg",
        [1, 1, 1]
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
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Draw axis

    this.setDefaultAppearance();

    this.pushMatrix();
    this.grassTexture.apply();
    this.scale(400, 1, 400);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.plane.display();
    this.popMatrix();

    this.panorama.display(this.camera.position);

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
    this.scale(0.6,0.6,0.6)
    this.translate(0, 5, 0);
    this.helicopter.display();
    this.popMatrix();

    this.pushMatrix();
    this.lakeTexture.apply();
    this.translate(15, 0.01, -10);
    this.scale(10, 1, 10);      
    this.rotate(-Math.PI / 2, 1, 0, 0); 
    this.lake.display();
    this.popMatrix();
    
  }
}
