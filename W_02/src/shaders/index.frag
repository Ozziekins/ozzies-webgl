precision highp float;

varying float vWave;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uHoverColor;
uniform float uHoverState;

void main() {
  float t = (vWave + 1.0) * 0.5;
  vec3 baseCol = mix(uColor1, uColor2, t);
  vec3 finalCol = mix(baseCol, uHoverColor, uHoverState);
  gl_FragColor = vec4(finalCol, 1.0);
}
