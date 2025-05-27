attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float uTime;
uniform float uRandomness;

varying vec2 vTextureCoord;

void main(void) {
    float verticalWave = sin(uTime * 3.0 + aVertexPosition.x * 5.0 + uRandomness * 10.0) * 0.1;

    float horizontalWaveX = sin(uTime * 2.0 + aVertexPosition.z * 4.0 + uRandomness * 5.0) * 0.1;
    float horizontalWaveZ = cos(uTime * 2.5 + aVertexPosition.x * 3.0 + uRandomness * 7.0) * 0.1;

    vec3 displacedPosition = aVertexPosition + vec3(horizontalWaveX, verticalWave, horizontalWaveZ);

    gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);

    vTextureCoord = aTextureCoord;
}