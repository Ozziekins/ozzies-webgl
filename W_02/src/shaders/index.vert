varying float vWave;

uniform float uTime;
uniform float uFreq;
uniform float uAmp;
uniform float uSpeed;

void main() {
  vec3 pos = position;
  vWave = sin(pos.x * uFreq + uTime * uSpeed) * uAmp;
  pos.z += vWave;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
