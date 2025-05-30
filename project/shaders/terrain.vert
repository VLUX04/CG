attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float timeFactor;

uniform sampler2D uSampler1; // waterMap
uniform sampler2D uSampler2; // terrainMask 

varying vec2 vTextureCoord;

void main() {
    vTextureCoord = aTextureCoord;

    float mask = texture2D(uSampler2, aTextureCoord / 10.0).r;
    vec3 offset = vec3(0.0);

    if (mask == 0.0) { // water area
        float waterHeight = texture2D(uSampler1, aTextureCoord + vec2(0.01 * timeFactor)).b;
        offset = aVertexNormal * 0.1 * waterHeight;
    }

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);
}
