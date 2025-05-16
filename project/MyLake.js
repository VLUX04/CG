import { CGFobject } from "../lib/CGF.js";

export class MyLake extends CGFobject {
  constructor(scene) {
    super(scene);
    this.initBuffers();
  }

  initBuffers() {
    const segments = 200;
    const baseRadius = 1;

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    function noise(angle) {
      return (
        0.3 *
        (Math.sin(3 * angle) +
         0.5 * Math.sin(5.7 * angle + 1.2) +
         0.3 * Math.cos(2.2 * angle - 0.7))
      );
    }

    this.vertices.push(0, 0, 0);
    this.normals.push(0, 1, 0);
    this.texCoords.push(0.5, 0.5);

    for (let i = 0; i <= segments; i++) {
      const angle = (2 * Math.PI * i) / segments;

      const distortion = noise(angle);
      const radius = baseRadius + distortion;

      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);

      this.vertices.push(x, 0, z);
      this.normals.push(0, 1, 0);
      this.texCoords.push(0.5 + x / 2, 0.5 + z / 2);

      if (i > 0) {
        this.indices.push(0, i, i + 1);
      }
    }

    this.indices.push(0, segments + 1, 1);

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
