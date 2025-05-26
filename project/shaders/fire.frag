precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main(void) {
    vec4 texColor = texture2D(uSampler, vTextureCoord);
    gl_FragColor = texColor;
}
