precision mediump float;

uniform float uBlink;
uniform vec3 uColor;

void main() {
    vec3 color = uBlink * uColor;
    gl_FragColor = vec4(color, 1.0);
}
