import { CGFinterface, dat } from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        // call CGFinterface init
        super.init(application);

        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();

        this.initKeys();

        const buildingFolder = this.gui.addFolder("Building Controls");
        buildingFolder.add(this.scene, "centralWidth", 5, 20).name("Central Width").onChange(() => this.scene.updateBuilding());
        buildingFolder.add(this.scene, "sideWidthPerc", 0.5, 3).name("Side Width Percentage").onChange(() => this.scene.updateBuilding());
        buildingFolder.add(this.scene, "numFloors", 1, 10, 1).name("Floors").onChange(() => this.scene.updateBuilding());
        buildingFolder.add(this.scene, "numWindows", 1, 5, 1).name("Windows").onChange(() => this.scene.updateBuilding());
        
        const forestFolder = this.gui.addFolder("Forest Controls");
        forestFolder.add(this.scene, "forestRows", 1, 10, 1).name("Rows").onChange(() => this.scene.updateForest());
        forestFolder.add(this.scene, "forestCols", 1, 10, 1).name("Columns").onChange(() => this.scene.updateForest());
        forestFolder.add(this.scene, "forestWidth", 20, 50, 1).name("Width").onChange(() => this.scene.updateForest());
        forestFolder.add(this.scene, "forestHeight", 20, 50, 1).name("Height").onChange(() => this.scene.updateForest());


        return true;
    }

    initKeys() {
        // create reference from the scene to the GUI
        this.scene.gui = this;

        // disable the processKeyboard function
        this.processKeyboard = function () { };

        // create a named array to store which keys are being pressed
        this.activeKeys = {};
    }
    processKeyDown(event) {
        // called when a key is pressed down
        // mark it as active in the array
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        // called when a key is released, mark it as inactive in the array
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        // returns true if a key is marked as pressed, false otherwise
        return this.activeKeys[keyCode] || false;
    }

}