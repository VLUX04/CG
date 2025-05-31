#version 300 es
precision mediump float;

uniform float uTime;
out vec4 fragColor;

void main() {
    float pulse = 0.5 + 0.5 * sin(uTime * 4.0); 
    vec3 color = pulse * vec3(1.0, 1.0, 0.0); 
    fragColor = vec4(color, 1.0);
}
