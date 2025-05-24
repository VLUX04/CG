import { CGFobject } from "../lib/CGF.js";

export class MyBox extends CGFobject {
    constructor(scene, { front = true, back = true, top = true, bottom = true, left = true, right = true } = {}) {
        super(scene);
        this.includeFaces = { front, back, top, bottom, left, right };
        this.initBuffers();
    }

    initBuffers() {
        const v = this.includeFaces;
        const vertices = [], indices = [], normals = [], texCoords = [];
        let index = 0;

        const addFace = (faceVerts, normal) => {
            vertices.push(...faceVerts.flat());
            normals.push(...Array(4).fill(normal).flat());
            texCoords.push(...[
                0, 0, 1, 0, 1, 1, 0, 1
            ]);
            indices.push(index, index + 1, index + 2, index, index + 2, index + 3);
            index += 4;
        };

        if (v.front)
            addFace(
                [[-0.5, -0.5,  0.5], [0.5, -0.5,  0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5]],
                [0, 0, 1]
            );
        if (v.back)
            addFace(
                [[0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5]],
                [0, 0, -1]
            );
        if (v.top)
            addFace(
                [[-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, -0.5]],
                [0, 1, 0]
            );
        if (v.bottom)
            addFace(
                [[-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [-0.5, -0.5, 0.5]],
                [0, -1, 0]
            );
        if (v.right)
            addFace(
                [[0.5, -0.5, 0.5], [0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [0.5, 0.5, 0.5]],
                [1, 0, 0]
            );
        if (v.left)
            addFace(
                [[-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5]],
                [-1, 0, 0]
            );

        this.vertices = vertices;
        this.indices = indices;
        this.normals = normals;
        this.texCoords = texCoords;

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
