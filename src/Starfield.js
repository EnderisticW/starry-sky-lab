import * as THREE from 'three';

// ── Shaders ──
const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aTwinkleFreq;
  attribute float aTwinklePhase;
  attribute vec3 aColor;
  attribute float aAlpha;
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uTime;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (280.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 0.3, 6.0);
    gl_Position = projectionMatrix * mvPosition;
    float twinkle = 1.0 + aTwinkleFreq * sin(uTime * aTwinkleFreq * 0.7 + aTwinklePhase);
    vColor = aColor;
    vAlpha = aAlpha * twinkle;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float alpha = 1.0 - smoothstep(0.0, 1.0, d);
    alpha = pow(alpha, 1.8) * vAlpha * 0.9;
    float glow = exp(-d * 3.5) * 0.25 * vAlpha;
    gl_FragColor = vec4(vColor, alpha + glow);
  }
`;

const LAYERS = [
  { n: 150, zMin: -14, zMax: -6, spread: 16, sMin: 0.6, sMax: 1.2, aMin: 0.06, aMax: 0.22, twAmp: 0.04, twPerMin: 9, twPerMax: 17 },
  { n: 100, zMin: -7, zMax: -1, spread: 12, sMin: 0.8, sMax: 1.6, aMin: 0.14, aMax: 0.35, twAmp: 0.07, twPerMin: 7, twPerMax: 13 },
  { n: 80,  zMin: -3, zMax: 2,  spread: 9,  sMin: 1.0, sMax: 2.0, aMin: 0.28, aMax: 0.55, twAmp: 0.10, twPerMin: 5, twPerMax: 10 },
  { n: 60,  zMin: 0,  zMax: 4,  spread: 7,  sMin: 1.3, sMax: 2.4, aMin: 0.42, aMax: 0.68, twAmp: 0.09, twPerMin: 4, twPerMax: 8 },
  { n: 30,  zMin: 2,  zMax: 5.5,spread: 5,  sMin: 1.6, sMax: 3.0, aMin: 0.55, aMax: 0.85, twAmp: 0.07, twPerMin: 3, twPerMax: 7 },
];

const BEACON_COUNT = 10;
const BEACON_MIN_DIST = 1.8; // minimum 3D distance between beacons

// Camera params (must match Telescope.js CAMERA_BASE)
const CAM_Z = 8;
const FOV_HALF = Math.tan((60 * Math.PI) / 180 / 2); // tan(30°)

function frustumHalfW(z) { return FOV_HALF * Math.abs(CAM_Z - z); }

// ── Generate ring texture via canvas ──
function makeRingTexture(colorHex, size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2, cy = size / 2;
  const grad = ctx.createRadialGradient(cx, cy, size * 0.30, cx, cy, size * 0.46);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.35, colorHex);
  grad.addColorStop(0.7, colorHex);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

const TEX_ACTIVE = makeRingTexture('rgba(78,205,196,0.8)');
const TEX_HOVER = makeRingTexture('rgba(126,232,224,1.0)');
const TEX_FOUND = makeRingTexture('rgba(201,169,110,0.55)');

export class Starfield {
  constructor(scene) {
    this.scene = scene;
    this.layers = [];
    this.brightStars = [];
    /** @type {{ position: THREE.Vector3, layerIndex: number, starIndex: number, sprite: THREE.Sprite, discovered: boolean }[]} */
    this.beacons = [];
    this._create();
    this._createBeacons();
  }

  _create() {
    for (let li = 0; li < LAYERS.length; li++) {
      const def = LAYERS[li];
      const count = def.n;
      const positions = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const twFreq = new Float32Array(count);
      const twPhase = new Float32Array(count);
      const colors = new Float32Array(count * 3);
      const alphas = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const z = def.zMin + Math.random() * (def.zMax - def.zMin);
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * def.spread * (1 + Math.abs(z) * 0.3);
        const x = Math.cos(angle) * radius * (0.3 + Math.random() * 0.7);
        const y = Math.sin(angle) * radius * (0.3 + Math.random() * 0.7);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        sizes[i] = def.sMin + Math.random() * (def.sMax - def.sMin);
        const period = def.twPerMin + Math.random() * (def.twPerMax - def.twPerMin);
        twFreq[i] = def.twAmp;
        twPhase[i] = Math.random() * Math.PI * 2;

        const temp = Math.random();
        if (li >= 3 && temp > 0.4) {
          colors[i * 3] = 0.90 + Math.random() * 0.1;
          colors[i * 3 + 1] = 0.78 + Math.random() * 0.15;
          colors[i * 3 + 2] = 0.55 + Math.random() * 0.25;
        } else if (li >= 1 && temp > 0.7) {
          colors[i * 3] = 0.88 + Math.random() * 0.12;
          colors[i * 3 + 1] = 0.80 + Math.random() * 0.15;
          colors[i * 3 + 2] = 0.60 + Math.random() * 0.25;
        } else {
          colors[i * 3] = 0.65 + Math.random() * 0.15;
          colors[i * 3 + 1] = 0.74 + Math.random() * 0.16;
          colors[i * 3 + 2] = 0.82 + Math.random() * 0.18;
        }

        alphas[i] = def.aMin + Math.random() * (def.aMax - def.aMin);

        if (li >= 3 && alphas[i] > 0.45) {
          this.brightStars.push({
            position: new THREE.Vector3(x, y, z),
            layerIndex: li, starIndex: i
          });
        }
      }

      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geom.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
      geom.setAttribute('aTwinkleFreq', new THREE.BufferAttribute(twFreq, 1));
      geom.setAttribute('aTwinklePhase', new THREE.BufferAttribute(twPhase, 1));
      geom.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
      geom.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));

      const mat = new THREE.ShaderMaterial({
        vertexShader, fragmentShader,
        uniforms: { uTime: { value: 0 } },
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geom, mat);
      this.scene.add(points);
      this.layers.push({ points, material: mat });
    }
  }

  _createBeacons() {
    const aspect = 16 / 9;
    const positions_3d = [];

    for (let i = 0; i < BEACON_COUNT; i++) {
      let x, y, z;
      let tries = 0;
      do {
        z = 1.5 + (i / (BEACON_COUNT - 1)) * 4.0;
        const halfW = frustumHalfW(z) * 0.75;
        const halfH = halfW / aspect;
        x = (Math.random() - 0.5) * 2 * halfW;
        y = (Math.random() - 0.5) * 2 * halfH;
        tries++;
      } while (tries < 30 && positions_3d.some(p => {
        const dx = p.x - x, dy = p.y - y, dz = p.z - z;
        return Math.sqrt(dx*dx + dy*dy + dz*dz) < BEACON_MIN_DIST;
      }));

      positions_3d.push({ x, y, z });

      const mat = new THREE.SpriteMaterial({
        map: TEX_ACTIVE,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.7,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(x, y, z);
      sprite.scale.setScalar(0.35);
      this.scene.add(sprite);

      this.beacons.push({
        position: new THREE.Vector3(x, y, z),
        layerIndex: 3,
        starIndex: i,
        sprite,
        discovered: false,
        _hoverTarget: 0,
        _hoverLerp: 0,
      });
    }
  }

  update(elapsed, mouse) {
    for (const layer of this.layers) {
      layer.material.uniforms.uTime.value = elapsed;
    }

    // Update all beacons
    for (let i = 0; i < this.beacons.length; i++) {
      const b = this.beacons[i];

      // Smooth hover lerp (per-beacon)
      b._hoverLerp += (b._hoverTarget - b._hoverLerp) * 0.06;

      if (b.discovered) {
        b.sprite.scale.setScalar(0.2);
        b.sprite.material.opacity = 0.3;
      } else {
        const baseScale = 0.35 * (1 + 0.18 * Math.sin(elapsed * 1.3 + i * 0.7));
        const hoverScale = 0.35 + b._hoverLerp * 0.35;
        const scale = baseScale + (hoverScale - baseScale) * b._hoverLerp;
        b.sprite.scale.setScalar(scale);

        const baseOpacity = 0.5 + 0.2 * Math.sin(elapsed * 1.3 + i * 0.7);
        const hoverOpacity = 0.55 + b._hoverLerp * 0.45;
        b.sprite.material.opacity = baseOpacity + (hoverOpacity - baseOpacity) * b._hoverLerp;
      }
    }
  }
}
