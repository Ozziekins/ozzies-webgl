export default `
uniform sampler2D tDiffuse;
uniform vec2 mousePos;
uniform float time;
varying vec2 vUv;

void main() {
  vec4 texel = texture2D(tDiffuse, vUv);
  
  // Create moving gradient based on mouse position
  vec2 uv = vUv;
  float dist = length(uv - mousePos);
  float gradient = sin(dist * 10.0 + time * 2.0) * 0.5 + 0.5;
  
  // Color gradient from light pink to light purple
  vec3 pinkColor = vec3(1.0, 0.8, 0.9); // Light pink
  vec3 purpleColor = vec3(0.8, 0.7, 1.0); // Light purple
  vec3 gradientColor = mix(pinkColor, purpleColor, gradient);
  
  // Blend with original image - subtle effect
  vec3 finalColor = mix(texel.rgb, gradientColor, 0.15);
  
  gl_FragColor = vec4(finalColor, texel.a);
}
`; 