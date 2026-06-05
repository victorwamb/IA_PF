// Particle fragment shader — subtle gradient coloring

uniform float uProgress;
uniform float uTime;

varying vec3 vPosition;
varying float vAlpha;

void main() {
  // Create circular point (discard outside circle)
  float distToCenter = length(gl_PointCoord - vec2(0.5));
  if (distToCenter > 0.5) discard;
  
  // Soft edge
  float strength = 1.0 - smoothstep(0.3, 0.5, distToCenter);
  
  // Color based on position and progress
  // Hero (sphere): pure white
  // Helix: slight blue/purple tint
  // Wave: warm white
  vec3 colorA = vec3(1.0, 1.0, 1.0);              // white
  vec3 colorB = vec3(0.7, 0.72, 1.0);              // soft blue/purple
  vec3 colorC = vec3(1.0, 0.95, 0.9);              // warm white
  
  vec3 color;
  if (uProgress < 0.5) {
    float t = smoothstep(0.0, 0.5, uProgress);
    color = mix(colorA, colorB, t);
  } else {
    float t = smoothstep(0.5, 1.0, uProgress);
    color = mix(colorB, colorC, t);
  }
  
  // Add subtle shimmer
  float shimmer = sin(vPosition.x * 10.0 + uTime) * 0.05 + 0.95;
  
  gl_FragColor = vec4(color * shimmer, strength * vAlpha);
}
