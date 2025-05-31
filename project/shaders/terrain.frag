#version 300 es
precision highp float;

in vec2 vTextureCoord;
uniform float timeFactor;

uniform sampler2D uSampler;  // lake texture
uniform sampler2D uSampler1; // water map
uniform sampler2D uSampler2; // terrain mask
uniform sampler2D uSampler3; // grass texture

out vec4 fragColor;

void main() {
    float mask = texture(uSampler2, vTextureCoord / 10.0).r;

    vec4 lake = texture(uSampler, vTextureCoord + vec2(timeFactor * 0.005));
    vec4 distortion = texture(uSampler1, vTextureCoord + vec2(0.01 * timeFactor));
    lake.rgb += distortion.b * 0.1;

    vec4 grass = texture(uSampler3, vTextureCoord);

    fragColor = mask < 0.5 ? lake : grass;
}
