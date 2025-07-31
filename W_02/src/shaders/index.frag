// src/shaders/index.frag

precision highp float;

varying float vDist;
uniform vec3 uColorA;
uniform vec3 uColorB;

void main() {
  gl_FragColor = vec4(mix(uColorA, uColorB, vDist), 1.0);
}
