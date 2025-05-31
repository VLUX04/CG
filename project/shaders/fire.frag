#version 300 es
precision highp float;

in vec2 vTextureCoord;
uniform sampler2D uSampler;

out vec4 fragColor;

void main() {
    vec4 texColor = texture(uSampler, vTextureCoord);
    fragColor = texColor;
}
