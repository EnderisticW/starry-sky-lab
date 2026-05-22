import * as THREE from 'three';

export class ConstellationLines {
  /**
   * @param {THREE.Scene} scene
   * @param {{position: THREE.Vector3, layerIndex: number, starIndex: number}[]} brightStars
   */
  constructor(scene, brightStars) {
    this.scene = scene;
    this.brightStars = brightStars;
    this.lineGroup = new THREE.Group();
    this.scene.add(this.lineGroup);
    this._create();
  }

  _create() {
    this.lineGroup.clear();
    const pool = this.brightStars;
    const MAX_DIST = 4.5;
    const clusters = [];
    const used = new Set();

    for (let i = 0; i < pool.length; i++) {
      if (used.has(i)) continue;
      const cluster = [i];
      used.add(i);
      for (let j = i + 1; j < pool.length; j++) {
        if (used.has(j)) continue;
        const dx = pool[i].position.x - pool[j].position.x;
        const dy = pool[i].position.y - pool[j].position.y;
        const dz = pool[i].position.z - pool[j].position.z;
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < MAX_DIST) {
          cluster.push(j);
          used.add(j);
        }
      }
      if (cluster.length >= 2) clusters.push(cluster);
    }

    for (const cluster of clusters) {
      const vertices = [];
      const alphas = [];

      for (let i = 0; i < cluster.length; i++) {
        for (let j = i + 1; j < cluster.length; j++) {
          const a = pool[cluster[i]].position;
          const b = pool[cluster[j]].position;
          const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < MAX_DIST) {
            vertices.push(a.x, a.y, a.z, b.x, b.y, b.z);
            alphas.push(1 - dist / MAX_DIST);
          }
        }
      }

      if (vertices.length > 0) {
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const mat = new THREE.LineBasicMaterial({
          color: 0x4ecdc4,
          transparent: true,
          opacity: 0.06,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const lines = new THREE.LineSegments(geom, mat);
        this.lineGroup.add(lines);
      }
    }
  }

  update(_elapsed) {
    // Lines gently pulse based on time
    const t = _elapsed * 0.5;
    const opacity = 0.05 + 0.025 * Math.sin(t * 0.4);
    for (const child of this.lineGroup.children) {
      child.material.opacity = opacity;
    }
  }
}
