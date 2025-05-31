#version 300 es
precision highp float;

in vec3 aVertexPosition;
in vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float uTime;
uniform float uRandomness;

out vec2 vTextureCoord;

void main() {
    float waveFactor = aVertexPosition.y > 0.0 ? 1.0 : 0.0;
    float waveX = sin(uTime * 5.0 + aVertexPosition.y * 40.0 + aVertexPosition.x * 15.0 + uRandomness * 10.0) * 0.12;
    float waveZ = cos(uTime * 6.0 + aVertexPosition.y * 30.0 + aVertexPosition.z * 18.0 + uRandomness * 8.0) * 0.1;

    vec3 displaced = aVertexPosition + waveFactor * vec3(waveX, 0.0, waveZ);
    gl_Position = uPMatrix * uMVMatrix * vec4(displaced, 1.0);
    vTextureCoord = aTextureCoord;
}
