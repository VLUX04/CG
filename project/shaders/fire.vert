attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float uTime;
uniform float uRandomness;

varying vec2 vTextureCoord;

void main(void) {
    float wave1 = sin(uTime * 2.0 + aVertexPosition.x * 5.0 + uRandomness * 15.0);
    float wave2 = sin(uTime * 3.5 + aVertexPosition.z * 7.0 + uRandomness * 10.0);
    float displacement = (wave1 + wave2) * 0.05; // Reduced vertical movement

    vec3 displacedPosition = aVertexPosition + vec3(displacement, displacement, displacement);
    gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);
    vTextureCoord = aTextureCoord;
}