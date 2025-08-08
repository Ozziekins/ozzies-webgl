export default `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;

void main() {
  float wave = sin(vUv.y * 10.0 + uTime) * 0.5 + 0.5;
  vec3 color = mix(uColor1, uColor2, wave);
  gl_FragColor = vec4(color, 1.0);
}
`;
