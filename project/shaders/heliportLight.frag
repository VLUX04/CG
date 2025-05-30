precision mediump float;

uniform float uTime;

void main() {
    float pulse = 0.5 + 0.5 * sin(uTime * 4.0); 
    vec3 color = pulse * vec3(1.0, 1.0, 0.0); 
    gl_FragColor = vec4(color, 1.0);
}
