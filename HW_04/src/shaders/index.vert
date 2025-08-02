varying vec2 vUv;

varying float vWave;

attribute float aRandom;

// UNIFORMS
uniform float uTime;
uniform float uFreq;
uniform float uAmp;
uniform float uSpeed;

uniform vec2  uMouse;
uniform float uTwist;

void main() {
  // WAVE DISPLACEMENT
  float wave = sin(position.x * uFreq + uTime * uSpeed) * uAmp;
  vWave = wave;

  vec3 pos = position;
  pos.z += wave;

  // TRYING TO ADD SOME SORT OF VORTEX
  vec2 offset = pos.xy - uMouse;
  float r     = length(offset);
  float ang   = uTwist * r;
  float s     = sin(ang);
  float c     = cos(ang);
  pos.x = uMouse.x + c * offset.x - s * offset.y;
  pos.y = uMouse.y + s * offset.x + c * offset.y;

  vUv = uv;

  // TYPICAL MPV
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
