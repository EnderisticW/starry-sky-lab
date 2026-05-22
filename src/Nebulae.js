import * as THREE from 'three';

const NEBULA_DEFS = [
  { pos: [-6, 2, -8],  scale: 9,  rgb: [0.08, 0.12, 0.24], alpha: 0.06, period: 55 },
  { pos: [5, -1, -10], scale: 10, rgb: [0.05, 0.16, 0.18], alpha: 0.05, period: 48 },
  { pos: [-2, 5, -6],  scale: 7,  rgb: [0.11, 0.07, 0.18], alpha: 0.045, period: 62 },
  { pos: [7, 3, -5],   scale: 6,  rgb: [0.14, 0.11, 0.08], alpha: 0.035, period: 70 },
  { pos: [3, -4, -9],  scale: 8,  rgb: [0.05, 0.09, 0.17], alpha: 0.05, period: 52 },
];

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vUv = uv;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  uniform vec3 uColor;
  uniform float uAlpha;
  uniform float uTime;
  uniform vec3 uWorldCenter;

  // Simple noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  void main() {
    // Distance from center in UV space
    float d = length(vUv - 0.5) * 2.0;
    if (d > 1.0) discard;

    // Layered noise for organic nebula texture
    float n1 = noise(vUv * 6.0 + uTime * 0.008);
    float n2 = noise(vUv * 3.0 - uTime * 0.005 + 0.5);
    float n3 = noise(vUv * 10.0 + uTime * 0.012 + 1.0);
    float n = n1 * 0.5 + n2 * 0.35 + n3 * 0.15;

    // Combine radial falloff with noise
    float falloff = 1.0 - smoothstep(0.0, 1.0, d);
    falloff = pow(falloff, 2.5);
    float detail = falloff * (0.55 + 0.45 * n);

    float alpha = detail * uAlpha;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

export class Nebulae {
  constructor(scene) {
    this.scene = scene;
    this.sprites = [];
    this._create();
  }

  _create() {
    for (const def of NEBULA_DEFS) {
      const geom = new THREE.PlaneGeometry(1, 1, 16, 16);
      const mat = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uColor: { value: new THREE.Vector3(...def.rgb) },
          uAlpha: { value: def.alpha },
          uTime: { value: 0 },
          uWorldCenter: { value: new THREE.Vector3(...def.pos) },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const sprite = new THREE.Mesh(geom, mat);
      sprite.position.set(...def.pos);
      sprite.scale.setScalar(def.scale);
      sprite.lookAt(new THREE.Vector3(0, 0, 8)); // face camera
      this.scene.add(sprite);
      this.sprites.push({ mesh: sprite, material: mat, baseAlpha: def.alpha, period: def.period });
    }
  }

  update(elapsed) {
    for (const sp of this.sprites) {
      sp.material.uniforms.uTime.value = elapsed;
      const breathe = 0.65 + 0.35 * Math.sin(elapsed * (2 * Math.PI) / sp.period);
      sp.material.uniforms.uAlpha.value = sp.baseAlpha * breathe;
      // Keep facing camera (at z=8)
      sp.mesh.lookAt(new THREE.Vector3(0, 0, 8));
    }
  }
}
