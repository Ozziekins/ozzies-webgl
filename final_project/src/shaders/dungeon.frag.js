export default `
uniform float time;
uniform float mouseHover;
varying vec2 vUv;

void main() {
  vec2 uv = vUv - 0.5;
  
  // Create rectangular portal effect instead of circular
  float rectX = abs(uv.x) * 2.0; // Stretch horizontally
  float rectY = abs(uv.y) * 1.5; // Stretch vertically
  float rectDist = max(rectX, rectY); // Use rectangular distance
  
  float angle = atan(uv.y, uv.x);
  
  // Create inward spinning portal effect with rectangular shape
  float spiral = sin(rectDist * 30.0 - angle * 12.0 - time * 4.0) * 0.5 + 0.5;
  float spiral2 = sin(rectDist * 25.0 + angle * 10.0 - time * 3.0) * 0.5 + 0.5;
  float spiral3 = sin(rectDist * 20.0 - angle * 8.0 - time * 5.0) * 0.5 + 0.5;
  
  // Portal colors - deep purples and dark blues for dungeon theme
  vec3 deepPurple = vec3(0.3, 0.1, 0.6);
  vec3 darkBlue = vec3(0.1, 0.2, 0.5);
  vec3 midnightBlue = vec3(0.05, 0.1, 0.3);
  
  // Mix colors based on spiral layers
  vec3 color = mix(deepPurple, darkBlue, spiral);
  color = mix(color, midnightBlue, spiral2 * 0.4);
  color = mix(color, vec3(0.4, 0.2, 0.8), spiral3 * 0.3);
  
  // Add pulsing portal effect
  float pulse = sin(time * 3.0) * 0.3 + 0.7;
  color *= pulse;
  
  // Add chromatic aberration on hover
  float aberration = mouseHover * 0.02;
  vec3 aberrationColor = vec3(
    sin(vUv.x * 10.0 + aberration + time) * 0.5 + 0.5,
    sin(vUv.y * 10.0 + time) * 0.5 + 0.5,
    sin(vUv.x * 10.0 - aberration + time) * 0.5 + 0.5
  );
  
  // Blend aberration with portal color
  color = mix(color, aberrationColor, mouseHover * 0.3);
  
  // Create rectangular portal edge fade
  float edgeFade = 1.0 - smoothstep(0.35, 0.45, rectDist);
  
  // Add portal glow with rectangular shape
  float glow = exp(-rectDist * 3.0) * 0.5;
  color += glow * vec3(0.4, 0.2, 0.8);
  
  gl_FragColor = vec4(color, edgeFade);
}
`; 