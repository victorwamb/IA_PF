// Particle vertex shader — morphs between 3 shapes based on scroll progress
// positionA = sphere, positionB = helix, positionC = wave

uniform float uProgress;   // 0.0 to 1.0 — scroll progress
uniform float uTime;       // elapsed time for subtle animation
uniform float uPixelRatio;
uniform float uSize;

attribute vec3 positionA;  // sphere shape
attribute vec3 positionB;  // helix shape
attribute vec3 positionC;  // wave / grid shape

varying vec3 vPosition;
varying float vAlpha;

void main() {
  // Determine which two shapes to blend
  vec3 pos;
  
  if (uProgress < 0.5) {
    // Blend sphere → helix (0.0 to 0.5)
    float t = smoothstep(0.0, 0.5, uProgress);
    pos = mix(positionA, positionB, t);
  } else {
    // Blend helix → wave (0.5 to 1.0)
    float t = smoothstep(0.5, 1.0, uProgress);
    pos = mix(positionB, positionC, t);
  }
  
  // Add subtle floating motion
  float displacement = sin(pos.x * 2.0 + uTime * 0.5) * 0.05
                     + cos(pos.y * 3.0 + uTime * 0.3) * 0.05
                     + sin(pos.z * 1.5 + uTime * 0.7) * 0.03;
  pos += normalize(pos) * displacement;
  
  vPosition = pos;
  
  // Distance-based alpha (particles further from center are dimmer)
  float dist = length(pos);
  vAlpha = smoothstep(8.0, 0.0, dist) * 0.9 + 0.1;
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = uSize * uPixelRatio * (1.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
