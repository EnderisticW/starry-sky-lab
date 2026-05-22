import './style.css';
import { Starfield } from './Starfield.js';
import { Nebulae } from './Nebulae.js';
import { ConstellationLines } from './ConstellationLines.js';
import { Telescope } from './Telescope.js';
import { AudioEngine } from './AudioEngine.js';
import * as THREE from 'three';

// ── Build DOM ──
const app = document.getElementById('app');
app.innerHTML = `
  <div class="grain"></div>

  <!-- Scan line -->
  <div class="scan-line"></div>

  <main>
    <nav>
      <div class="nav-brand">星 空</div>
      <ul class="nav-links">
        <li><a href="#about">关于</a></li>
        <li><a href="#research">研究</a></li>
        <li><a href="#connect">联系</a></li>
      </ul>
    </nav>

    <section class="hero" id="home">
      <p class="hero-eyebrow">Institute for Cosmic Inquiry</p>
      <h1>星空<span class="accent">研究所</span></h1>
      <p class="hero-tagline">在无垠的暗夜中寻找光的轨迹，<br>于星辰之间，追问宇宙最初的谜底。</p>
      <div class="hero-scroll">
        <span>探索</span>
        <div class="hero-scroll-line"></div>
      </div>
    </section>

    <section class="about" id="about">
      <div class="about-text">
        <p class="section-label">· 关于我们 ·</p>
        <h2 class="section-title">凝视深渊，<br>亦被深渊凝视。</h2>
        <p>星空研究所成立于人类望向银河的第三个千年。我们致力于天体物理学前沿探索、宇宙微波背景辐射分析，以及系外行星大气层的遥感研究。</p>
        <p>我们的团队分布在三个大洲的五个观测站，在海拔 5000 米的稀薄空气与绝对寂静中，聆听宇宙最古老的回声。</p>
      </div>
      <div class="about-visual">
        <div class="orbit-ring"><div class="orbit-dot"></div></div>
        <div class="orbit-ring"><div class="orbit-dot"></div></div>
        <div class="orbit-ring"><div class="orbit-dot"></div></div>
        <div class="center-star"></div>
      </div>
    </section>

    <section class="research" id="research">
      <p class="section-label">· 研究方向 ·</p>
      <h2 class="section-title">三个维度，<br>探索深空。</h2>
      <div class="research-grid">
        <div class="research-card">
          <div class="research-card-index">01</div>
          <h3>恒星演化动力学</h3>
          <p>模拟大质量恒星的诞生与消亡，追踪重元素在超新星爆发中的合成路径。我们维护着南半球最大的恒星光谱数据库。</p>
          <div class="card-line"></div>
        </div>
        <div class="research-card">
          <div class="research-card-index">02</div>
          <h3>暗物质拓扑制图</h3>
          <p>利用引力透镜效应绘制暗物质在宇宙尺度上的三维分布图。我们的算法可以从星系形态的微小扭曲中重建不可见质量的网络。</p>
          <div class="card-line"></div>
        </div>
        <div class="research-card">
          <div class="research-card-index">03</div>
          <h3>系外大气光谱学</h3>
          <p>通过凌星光谱分析，解码遥远行星大气层的化学成分。寻找那些可能暗示生命存在的气态印记 —— 氧、甲烷、水蒸气。</p>
          <div class="card-line"></div>
        </div>
      </div>
    </section>

    <section class="quote-section">
      <blockquote>
        "宇宙中最令人感动的，<br>不是它的浩瀚与永恒，<br>而是我们这颗微尘上的短暂意识，<br>竟然能够理解它的法则。"
      </blockquote>
      <cite>— 首任所长 · 陈星远</cite>
    </section>

    <footer id="connect">
      <div class="footer-brand">星空研究所</div>
      <div class="footer-info">© 2026 Institute for Cosmic Inquiry · 中国 · 智利 · 夏威夷</div>
    </footer>
  </main>

  <!-- Discovery counter -->
  <div class="discovery-counter" id="discovery-counter">已发现 0 / 20</div>

  <!-- Observation card -->
  <div class="obs-card" id="obs-card">
    <div class="obs-card-inner">
      <button class="obs-card-close" id="obs-close">&times;</button>
      <div class="obs-card-id" id="obs-id"></div>
      <h3 id="obs-name"></h3>
      <dl class="obs-card-specs">
        <dt>光谱类型</dt><dd id="obs-spectral"></dd>
        <dt>距地距离</dt><dd id="obs-distance"></dd>
        <dt>视星等</dt><dd id="obs-magnitude"></dd>
        <dt>表面温度</dt><dd id="obs-temp"></dd>
      </dl>
      <p class="obs-card-note" id="obs-note"></p>
    </div>
  </div>

  <!-- Audio toggle -->
  <button class="audio-toggle muted" id="audio-btn" title="开启声音">&#9835;</button>

  <!-- Click hint -->
  <div class="click-hint" id="click-hint">发现信标 · 点击观测</div>
`;

// ── Three.js setup ──
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.5, 1000);
camera.position.set(0, 0, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.domElement.id = 'three-canvas';
document.body.prepend(renderer.domElement);

// ── Mouse tracking ──
const mouse = new THREE.Vector2();
const mouseTarget = new THREE.Vector2();
window.addEventListener('mousemove', (e) => {
  mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// ── Initialize modules ──
const starfield = new Starfield(scene);
const nebulae = new Nebulae(scene);
const constellations = new ConstellationLines(scene, starfield.brightStars);
const telescope = new Telescope(scene, camera, starfield.beacons, {
  cardIds: ['obs-card', 'obs-id', 'obs-name', 'obs-spectral', 'obs-distance', 'obs-magnitude', 'obs-temp', 'obs-note'],
  closeBtn: 'obs-close',
  hint: 'click-hint',
  counter: 'discovery-counter',
}, (count) => {
  // Discovery callback
  const counter = document.getElementById('discovery-counter');
  if (counter) {
    counter.classList.add('pulse');
    setTimeout(() => counter.classList.remove('pulse'), 600);
  }
  if (count === starfield.beacons.length) {
    setTimeout(() => {
      const hint = document.getElementById('click-hint');
      if (hint) {
        hint.textContent = '所有信标已发现 · 星空图鉴完整';
        hint.classList.add('visible');
        setTimeout(() => hint.classList.remove('visible'), 4000);
      }
    }, 800);
  }
});
const audioEngine = new AudioEngine();

// Audio button
const audioBtn = document.getElementById('audio-btn');
audioBtn.addEventListener('click', () => {
  const on = audioEngine.toggle();
  audioBtn.classList.toggle('muted', !on);
  audioBtn.textContent = on ? '♫' : '♪';
});

// ── Scroll reveal observer ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.research-card').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(40px)';
  card.style.transition = `all 0.8s ${i * 0.15}s ease`;
  observer.observe(card);
});
document.querySelectorAll('.about-visual, .section-title, .about-text p').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 0.8s ease';
  observer.observe(el);
});
const quoteEl = document.querySelector('.quote-section');
if (quoteEl) observer.observe(quoteEl);

// ── Render loop ──
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const elapsed = performance.now() * 0.001;
  mouse.lerp(mouseTarget, 0.02);

  starfield.update(elapsed, mouse);
  nebulae.update(elapsed);
  constellations.update(elapsed);
  telescope.update(elapsed, mouse);

  // Scan line animation
  const scanLine = document.querySelector('.scan-line');
  if (scanLine) {
    const scanT = (elapsed * 0.15) % 6; // 0 to 6 cycle
    if (scanT < 1) {
      scanLine.style.opacity = scanT; // fade in
      scanLine.style.top = (scanT * 100) + '%';
    } else if (scanT < 4) {
      scanLine.style.opacity = '1';
      scanLine.style.top = ((scanT - 1) / 3 * 100) + '%';
    } else if (scanT < 5) {
      scanLine.style.opacity = (5 - scanT); // fade out
    } else {
      scanLine.style.opacity = '0';
    }
  }

  renderer.render(scene, camera);
}
animate();

// ── Resize handler ──
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
