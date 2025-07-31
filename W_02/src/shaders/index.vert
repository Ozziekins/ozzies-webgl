// src/shaders/index.vert

// PASS THROUGH UVS (Three.js provides `uv`)
varying vec2 vUv;

// YOUR CUSTOM ATTRIBUTE
attribute float aRandom;

// YOUR UNIFORMS
uniform vec3  uMouse;
uniform float uTime;

// VARYING FOR FRAGMENT
varying float vDist;

void main() {
  // 1) PASS UV
  vUv = uv;

  // 2) COMPUTE WORLD POSITION FOR NOISE DISPLACEMENT
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);

  // 3) DISTANCE TO MOUSE
  float d = distance(uMouse, worldPosition.xyz);

  // 4) RIPPLE
  float ripple = 0.5 + 0.5 * sin(d * 15.0 - uTime * 4.0);

  // 5) DISPLACE Z
  worldPosition.z += aRandom * 0.3 * ripple;

  // 6) PASS TO FRAG
  vDist = ripple;

  // 7) FINAL POSITION (use modelViewMatrix + projectionMatrix)
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
