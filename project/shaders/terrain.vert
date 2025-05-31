#version 300 es
precision highp float;

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float timeFactor;

uniform sampler2D uSampler1;
uniform sampler2D uSampler2; 

out vec2 vTextureCoord;

void main() {
    vTextureCoord = aTextureCoord;

    float mask = texture(uSampler2, aTextureCoord / 10.0).r;
    vec3 offset = vec3(0.0);

    if (mask == 0.0) {
        float waterHeight = texture(uSampler1, aTextureCoord + vec2(0.01 * timeFactor)).b;
        offset = aVertexNormal * 0.1 * waterHeight;
    }

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);
}
