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
  
  // Color gradient from deep purple to dark blue for evening/night
  vec3 deepPurple = vec3(0.4, 0.2, 0.6); // Deep purple
  vec3 darkBlue = vec3(0.2, 0.3, 0.8); // Dark blue
  vec3 gradientColor = mix(deepPurple, darkBlue, gradient);
  
  // Blend with original image - subtle effect
  vec3 finalColor = mix(texel.rgb, gradientColor, 0.15);
  
  gl_FragColor = vec4(finalColor, texel.a);
}
`; 