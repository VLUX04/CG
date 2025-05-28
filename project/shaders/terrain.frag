#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform float timeFactor;

uniform sampler2D uSampler; // lake texture
uniform sampler2D uSampler1; // water map
uniform sampler2D uSampler2; // terrain mask
uniform sampler2D uSampler3; // grass texture

void main() {
    float mask = texture2D(uSampler2, vTextureCoord / 10.0).r;
    
    vec4 lake = texture2D(uSampler, vTextureCoord + vec2(timeFactor * 0.005));
    vec4 distortion = texture2D(uSampler1, vTextureCoord + vec2(0.01 * timeFactor));
    lake.rgb += distortion.b * 0.1;

    vec4 grass = texture2D(uSampler3, vTextureCoord);

    if (mask < 0.5) {
        gl_FragColor = lake;
    } else {
        gl_FragColor = grass;
    }
}
