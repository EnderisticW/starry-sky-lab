import * as THREE from 'three';
import { StarCatalog } from './StarCatalog.js';

const CAMERA_BASE = new THREE.Vector3(0, 0, 8);
const CAMERA_LOOK = new THREE.Vector3(0, 0, 0);

export class Telescope {
  constructor(scene, camera, beacons, domIds, onDiscover) {
    this.scene = scene;
    this.camera = camera;
    this.beacons = beacons;
    this.dom = domIds;
    this.onDiscover = onDiscover;
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points.threshold = 0.6;

    this.hovered = null;
    this.zoomed = null;
    this.zoomTarget = new THREE.Vector3();
    this.zoomProgress = 0;
    this.isZooming = false;
    this.discoveredCount = 0;

    this._setupDOM();
    this._setupEvents();
  }

  _setupDOM() {
    this.cardEl = document.getElementById(this.dom.cardIds[0]);
    this.closeBtn = document.getElementById(this.dom.closeBtn);
    this.hint = document.getElementById(this.dom.hint);
    this.counterEl = document.getElementById(this.dom.counter);

    this.closeBtn.addEventListener('click', () => this._closeCard());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this._closeCard();
    });
    this._updateCounter();
  }

  _setupEvents() {
    window.addEventListener('click', (e) => {
      if (this.isZooming) return;
      if (e.target.closest('nav') || e.target.closest('button') ||
          e.target.closest('.obs-card') || e.target.closest('.research-card')) return;
      const beacon = this._raycast(e.clientX, e.clientY);
      if (beacon) this._zoomToStar(beacon);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isZooming) return;
      const beacon = this._raycast(e.clientX, e.clientY);
      if (beacon !== this.hovered) {
        if (this.hovered) this.hovered._hoverTarget = 0;
        this.hovered = beacon;
        if (beacon) {
          beacon._hoverTarget = 1;
          this.hint.classList.add('visible');
        } else {
          this.hint.classList.remove('visible');
        }
        document.body.style.cursor = beacon ? 'pointer' : 'default';
      }
    });
  }

  _raycast(clientX, clientY) {
    const px = (clientX / window.innerWidth) * 2 - 1;
    const py = -(clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(new THREE.Vector2(px, py), this.camera);

    // Raycast against beacon sprites directly
    const sprites = this.beacons.map(b => b.sprite);
    const hits = this.raycaster.intersectObjects(sprites);
    if (hits.length > 0) {
      // Find the beacon that owns this sprite
      const hitSprite = hits[0].object;
      return this.beacons.find(b => b.sprite === hitSprite) || null;
    }
    return null;
  }

  _zoomToStar(beacon) {
    this.zoomed = beacon;
    this.isZooming = true;
    this.zoomProgress = 0;

    const pos = beacon.position.clone();
    const dir = pos.clone().sub(CAMERA_BASE).normalize();
    this.zoomTarget.copy(pos).add(dir.multiplyScalar(-2.5));
    this.zoomTarget.x += (Math.random() - 0.5) * 0.5;
    this.zoomTarget.y += (Math.random() - 0.5) * 0.3;

    // Clear hover state during zoom
    if (this.hovered) {
      this.hovered._hoverTarget = 0;
      this.hovered = null;
    }
    this.hint.classList.remove('visible');

    this._showCard(beacon);

    // Mark discovered
    if (!beacon.discovered) {
      beacon.discovered = true;
      this.discoveredCount++;
      beacon.sprite.material.map = null; // will be set on close
      this._updateCounter();
      if (this.onDiscover) this.onDiscover(this.discoveredCount);
    }
  }

  _closeCard() {
    if (!this.zoomed) return;
    // Update beacon ring to "found" state
    const b = this.zoomed;
    b.sprite.material.map = null; // trigger refresh
    // Use a simple approach: change opacity and scale for discovered state
    b.sprite.material.opacity = 0.3;
    b.sprite.scale.setScalar(0.2);

    this.zoomed = null;
    this.isZooming = true;
    this.zoomProgress = 0;
    this.zoomTarget.copy(CAMERA_BASE);
    this.cardEl.classList.remove('active');
  }

  _showCard(beacon) {
    const data = StarCatalog.getStarData(beacon);
    document.getElementById(this.dom.cardIds[1]).textContent = data.id;
    document.getElementById(this.dom.cardIds[2]).textContent = data.name;
    document.getElementById(this.dom.cardIds[3]).textContent = data.spectralType;
    document.getElementById(this.dom.cardIds[4]).textContent = data.distance;
    document.getElementById(this.dom.cardIds[5]).textContent = data.magnitude;
    document.getElementById(this.dom.cardIds[6]).textContent = data.temperature;
    document.getElementById(this.dom.cardIds[7]).textContent = data.note;
    setTimeout(() => this.cardEl.classList.add('active'), 500);
  }

  _updateCounter() {
    if (this.counterEl) {
      this.counterEl.textContent = `已发现 ${this.discoveredCount} / ${this.beacons.length}`;
    }
  }

  update(elapsed, mouse) {
    const px = mouse.x * 0.4;
    const py = mouse.y * 0.25;

    // ── Camera ──
    if (this.isZooming) {
      this.zoomProgress = Math.min(1, this.zoomProgress + 0.012);
      const from = this.zoomed ? CAMERA_BASE.clone() : this.zoomTarget.clone();
      const to = this.zoomed ? this.zoomTarget.clone() : CAMERA_BASE.clone();
      const t = this._ease(this.zoomProgress);
      this.camera.position.lerpVectors(from, to, t);
      this.camera.position.x += px * (1 - this.zoomProgress);
      this.camera.position.y += py * (1 - this.zoomProgress);
      if (this.zoomProgress >= 1) this.isZooming = false;
    } else if (!this.zoomed) {
      this.camera.position.x += (CAMERA_BASE.x + px - this.camera.position.x) * 0.03;
      this.camera.position.y += (CAMERA_BASE.y + py - this.camera.position.y) * 0.03;
    }
    this.camera.lookAt(CAMERA_LOOK);
  }

  _ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
}
