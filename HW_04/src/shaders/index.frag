precision highp float;

varying float vWave;
uniform vec3  uColor1;
uniform vec3  uColor2;

void main() {
  float t = (vWave + 1.0) * 0.5;
  vec3 col = mix(uColor1, uColor2, t);
  gl_FragColor = vec4(col, 1.0);
}
