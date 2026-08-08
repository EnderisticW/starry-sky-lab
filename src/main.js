import './style.css';
import * as THREE from 'three';
import { Starfield } from './Starfield.js';
import { Nebulae } from './Nebulae.js';
import { ConstellationLines } from './ConstellationLines.js';
import { Telescope } from './Telescope.js';
import { AudioEngine } from './AudioEngine.js';
import { initStations } from './Stations.js';
import { initAPOD } from './APOD.js';
import { initDiaries } from './Diaries.js';
import { renderHome, renderInstitute, renderLogs, renderObservatory } from './pageTemplates.js';

const page = document.body.dataset.page || 'home';
const app = document.getElementById('app');
const renderers = {
  home: renderHome,
  observatory: renderObservatory,
  logs: renderLogs,
  institute: renderInstitute,
};

document.body.classList.add(`page-${page}`);
app.innerHTML = (renderers[page] || renderHome)();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.5, 1000);
camera.position.set(0, 0, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.domElement.id = 'three-canvas';
document.body.prepend(renderer.domElement);

const mouse = new THREE.Vector2();
const mouseTarget = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
  mouseTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseTarget.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

const starfield = new Starfield(scene);
const nebulae = new Nebulae(scene);
const constellations = new ConstellationLines(scene, starfield.brightStars);
let telescope = null;

if (page === 'observatory') {
  telescope = new Telescope(scene, camera, starfield.beacons, {
    cardIds: ['obs-card', 'obs-id', 'obs-name', 'obs-spectral', 'obs-distance', 'obs-magnitude', 'obs-temp', 'obs-note'],
    closeBtn: 'obs-close',
    hint: 'click-hint',
    counter: 'discovery-counter',
    preview: false,
    activeSelector: '.observatory-stage',
  }, handleDiscovery);
} else {
  // 普通页面只保留氛围星空，信标收集专属于观测台。
  starfield.beacons.forEach(({ sprite }) => { sprite.visible = false; });
}

function handleDiscovery(count) {
  const counter = document.getElementById('discovery-counter');
  if (counter) {
    counter.classList.add('pulse');
    setTimeout(() => counter.classList.remove('pulse'), 600);
  }

  if (count === starfield.beacons.length) {
    setTimeout(() => {
      const hint = document.getElementById('click-hint');
      if (!hint) return;
      hint.textContent = '所有信标已发现 · 星空图鉴完整';
      hint.classList.add('visible');
      setTimeout(() => hint.classList.remove('visible'), 4000);
    }, 800);
  }
}

function initAudio() {
  const audioBtn = document.getElementById('audio-btn');
  if (!audioBtn) return;
  const audioEngine = new AudioEngine();
  audioBtn.addEventListener('click', () => {
    const on = audioEngine.toggle();
    audioBtn.classList.toggle('muted', !on);
    audioBtn.textContent = on ? '♫' : '♪';
    audioBtn.setAttribute('aria-label', on ? '关闭声音' : '开启声音');
    audioBtn.title = on ? '关闭声音' : '开启声音';
  });
}

async function initLatestLogPreview() {
  const container = document.getElementById('latest-signal');
  if (!container) return;

  try {
    const response = await fetch('./data/diaries.json');
    if (!response.ok) throw new Error(`日志请求失败：${response.status}`);
    const data = await response.json();
    const entry = data.entries?.[0];
    if (!entry) throw new Error('没有可展示的日志');

    document.getElementById('latest-log-date').textContent = data.date;
    document.getElementById('latest-log-character').textContent = entry.character;
    document.getElementById('latest-log-object').textContent = entry.astronomical_object;
    const excerpt = entry.entry.length > 220 ? `${entry.entry.slice(0, 220)}……` : entry.entry;
    document.getElementById('latest-log-entry').textContent = excerpt;
  } catch (error) {
    console.warn('Latest log unavailable:', error.message);
    container.style.display = 'none';
  }
}

function initReveals() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.research-card, .portal-list a, .latest-log-card, .team-card, .station-item, .section-heading-row, .home-mission > *').forEach((element, index) => {
    element.classList.add('reveal-item');
    element.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 0.1}s`);
    observer.observe(element);
  });
}

function initPagePresence() {
  const favicon = document.querySelector('link[rel~="icon"]');
  if (!favicon) return;

  const activeState = {
    title: '此刻，我们凝望深空',
    icon: './assets/favicon-active.png',
  };
  const inactiveState = {
    title: '宇宙未眠 · 等你归来',
    icon: './assets/favicon-inactive.png',
  };

  const updatePresence = () => {
    const state = document.hidden || !document.hasFocus() ? inactiveState : activeState;
    document.title = state.title;
    favicon.href = state.icon;
  };

  document.addEventListener('visibilitychange', updatePresence);
  window.addEventListener('focus', updatePresence);
  window.addEventListener('blur', updatePresence);
  window.addEventListener('pageshow', updatePresence);
  updatePresence();
}

function initSectionPaging() {
  if (page !== 'home') return;

  const pagingQuery = window.matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)');
  const selector = '.home-hero, .home-daily, .home-mission, .portal-section, .latest-signal, .quote-section';
  let animationFrame = null;
  let animationToken = 0;
  let isAnimating = false;
  let blockedUntil = 0;
  let wheelAmount = 0;
  let wheelResetTimer = null;

  const cancelAnimation = () => {
    animationToken += 1;
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = null;
    isAnimating = false;
    blockedUntil = 0;
    wheelAmount = 0;
    clearTimeout(wheelResetTimer);
  };

  const animateTo = (targetY) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    if (Math.abs(distance) < 2) return;

    const duration = Math.min(1550, Math.max(1200, Math.abs(distance) * 1.25));
    const startedAt = performance.now();
    const token = ++animationToken;
    isAnimating = true;
    blockedUntil = startedAt + duration + 320;

    const step = (now) => {
      if (token !== animationToken) return;
      const progress = Math.min(1, (now - startedAt) / duration);
      // smootherstep：翻页起步与收尾都保持柔和。
      const eased = progress ** 3 * (progress * (progress * 6 - 15) + 10);
      window.scrollTo({ top: startY + distance * eased, behavior: 'instant' });

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        window.scrollTo({ top: targetY, behavior: 'instant' });
        animationFrame = null;
        isAnimating = false;
      }
    };

    animationFrame = requestAnimationFrame(step);
  };

  const targetForDirection = (direction) => {
    const sections = [...document.querySelectorAll(selector)];
    if (!sections.length) return null;

    const currentY = window.scrollY;
    const positions = sections.map(section => section.offsetTop);
    const lastIndex = positions.length - 1;
    const pageBottom = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    if (currentY > positions[lastIndex] + 24) {
      return direction < 0 ? positions[lastIndex] : null;
    }

    let nearestIndex = 0;
    positions.forEach((position, index) => {
      if (Math.abs(position - currentY) < Math.abs(positions[nearestIndex] - currentY)) nearestIndex = index;
    });

    if (direction > 0) {
      if (nearestIndex < lastIndex) return positions[nearestIndex + 1];
      return pageBottom > positions[lastIndex] + 24 ? pageBottom : null;
    }
    return nearestIndex > 0 ? positions[nearestIndex - 1] : null;
  };

  window.addEventListener('wheel', (event) => {
    if (!pagingQuery.matches || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    event.preventDefault();

    const now = performance.now();
    if (isAnimating || now < blockedUntil) return;

    wheelAmount += event.deltaY;
    clearTimeout(wheelResetTimer);
    wheelResetTimer = setTimeout(() => { wheelAmount = 0; }, 140);
    if (Math.abs(wheelAmount) < 42) return;

    const direction = wheelAmount > 0 ? 1 : -1;
    wheelAmount = 0;
    const targetY = targetForDirection(direction);
    if (targetY !== null) animateTo(targetY);
  }, { passive: false });

  window.addEventListener('pointerdown', cancelAnimation, { passive: true });
  window.addEventListener('resize', cancelAnimation, { passive: true });
  pagingQuery.addEventListener('change', cancelAnimation);
}

if (page === 'home') {
  initAPOD(document.getElementById('daily'));
  initLatestLogPreview();
}

if (page === 'logs') {
  initDiaries(document.getElementById('diaries'));
}

if (page === 'institute') {
  initStations();
}

initAudio();
initReveals();
initPagePresence();
initSectionPaging();

function animate() {
  requestAnimationFrame(animate);
  const elapsed = performance.now() * 0.001;
  mouse.lerp(mouseTarget, 0.02);

  starfield.update(elapsed, mouse);
  nebulae.update(elapsed);
  constellations.update(elapsed);
  telescope?.update(elapsed, mouse);

  // 非观测台页面使用更克制的全局视差，让四个页面共享同一片星空。
  if (!telescope) {
    camera.position.x += (mouse.x * 0.32 - camera.position.x) * 0.025;
    camera.position.y += (mouse.y * 0.2 - camera.position.y) * 0.025;
    camera.lookAt(0, 0, 0);
  }

  const scanLine = document.querySelector('.scan-line');
  if (scanLine) {
    const scanT = (elapsed * 0.15) % 6;
    if (scanT < 1) {
      scanLine.style.opacity = scanT;
      scanLine.style.top = `${scanT * 100}%`;
    } else if (scanT < 4) {
      scanLine.style.opacity = '1';
      scanLine.style.top = `${((scanT - 1) / 3) * 100}%`;
    } else if (scanT < 5) {
      scanLine.style.opacity = 5 - scanT;
    } else {
      scanLine.style.opacity = '0';
    }
  }

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
