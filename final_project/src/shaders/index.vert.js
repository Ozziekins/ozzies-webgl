export default `
varying vec2 vUv;
uniform float uTime;

void main() {
  vUv = uv;
  vec3 pos = position;

  pos.z += sin(pos.x * 3.0 + uTime) * 0.2;
  pos.y += cos(pos.y * 2.0 + uTime * 0.5) * 0.1;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;
