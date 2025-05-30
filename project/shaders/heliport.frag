#version 300 es
precision mediump float;

in vec2 vTextureCoord;
out vec4 fragColor;

uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float blendFactor;

void main() {
    vec4 color1 = texture(uTexture1, vTextureCoord);
    vec4 color2 = texture(uTexture2, vTextureCoord);
    fragColor = mix(color1, color2, blendFactor);
}
