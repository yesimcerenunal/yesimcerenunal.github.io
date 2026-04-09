import * as THREE from "three";

/**
 * Square plane side length = gallery card width × this — texture uses full square UVs (no disk/ring squeeze).
 * Tweak only world size; the shader does not warp or radially crop the artwork.
 */
export const SUN_RAYS_PLANE_SIDE_MULT = 2.85;

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * White sun-ray PNG on a **square** quad: straight `vUv` sampling — same aspect as your Photoshop file,
 * no polar mapping, no radial zoom, no circular mask in the shader.
 */
const fragmentShader = /* glsl */ `
uniform sampler2D uMap;
uniform float uTime;
uniform float uAlpha;
uniform vec3 uTint;
uniform float uStrength;
varying vec2 vUv;

void main() {
  vec4 tex = texture2D(uMap, vUv);

  float lum = max(tex.r, max(tex.g, tex.b));
  float mask = lum * tex.a;
  if (mask < 0.0005) discard;

  vec2 p = vUv - 0.5;
  float r = length(p) * 2.0;
  float ang = atan(p.y, p.x);
  float tw = 0.94 + 0.06 * sin(ang * 5.0 + uTime * 0.85 + r * 9.0);

  vec3 rgb = tex.rgb * uTint * uStrength * tw;
  float a = mask * uAlpha;

  gl_FragColor = vec4(rgb * a, a);
}
`;

export function createGallerySunburstHaloMaterial(
  map: THREE.Texture,
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uTime: { value: 0 },
      uAlpha: { value: 0 },
      uTint: { value: new THREE.Vector3(1, 1, 1) },
      uStrength: { value: 2.35 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
}
