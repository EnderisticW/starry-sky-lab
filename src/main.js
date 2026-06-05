import './style.css';
import { Starfield } from './Starfield.js';
import { Nebulae } from './Nebulae.js';
import { ConstellationLines } from './ConstellationLines.js';
import { Telescope } from './Telescope.js';
import { AudioEngine } from './AudioEngine.js';
import { initStations } from './Stations.js';
import { initAPOD } from './APOD.js';
import { initDiaries } from './Diaries.js';
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
        <li><a href="#daily">今日</a></li>
        <li><a href="#diaries">日志</a></li>
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

    <section class="cosmic-today" id="daily">
      <p class="section-label">· 今日宇宙观测 · <span class="apod-label-en">Today's Cosmic Observation</span></p>
      <div class="apod-loading">正在链接深空观测网络…</div>
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

    <section class="stations" id="stations">
      <p class="section-label">· 观测网络 ·</p>
      <h2 class="section-title">三大洲，<br>五座天眼。</h2>
      <div class="stations-globe">
        <!-- World map outline -->
        <svg class="world-map" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
          <!-- Background grid: latitude lines -->
          <g class="map-grid">
            <line x1="0" y1="80" x2="800" y2="80" stroke="rgba(78,205,196,0.10)" stroke-width="0.5"/>
            <line x1="0" y1="160" x2="800" y2="160" stroke="rgba(78,205,196,0.10)" stroke-width="0.5"/>
            <line x1="0" y1="240" x2="800" y2="240" stroke="rgba(78,205,196,0.10)" stroke-width="0.5"/>
            <line x1="0" y1="320" x2="800" y2="320" stroke="rgba(78,205,196,0.10)" stroke-width="0.5"/>
            <line x1="200" y1="0" x2="200" y2="400" stroke="rgba(78,205,196,0.07)" stroke-width="0.5"/>
            <line x1="400" y1="0" x2="400" y2="400" stroke="rgba(78,205,196,0.07)" stroke-width="0.5"/>
            <line x1="600" y1="0" x2="600" y2="400" stroke="rgba(78,205,196,0.07)" stroke-width="0.5"/>
          </g>
          <!-- Simplified continents -->
          <g class="map-land" fill="rgba(78,205,196,0.12)" stroke="rgba(78,205,196,0.22)" stroke-width="0.6">
            <!-- North America -->
            <path d="M120,60 Q200,40 280,50 Q350,45 380,70 Q370,120 340,150 Q300,170 280,190 Q260,210 230,230 Q200,240 180,220 Q140,190 100,150 Q80,120 120,60Z"/>
            <!-- South America -->
            <path d="M220,260 Q250,250 270,270 Q290,300 280,340 Q260,370 240,380 Q230,360 220,340 Q210,300 220,260Z"/>
            <!-- Europe -->
            <path d="M380,70 Q420,55 460,60 Q490,65 500,80 Q490,100 470,110 Q440,115 420,105 Q390,95 380,70Z"/>
            <!-- Africa -->
            <path d="M400,120 Q440,110 470,120 Q490,140 500,180 Q510,240 490,300 Q470,340 450,350 Q440,320 430,280 Q420,240 410,200 Q400,160 400,120Z"/>
            <!-- Asia -->
            <path d="M500,50 Q560,35 620,40 Q680,45 740,55 Q760,90 740,140 Q720,180 680,200 Q640,210 600,200 Q560,190 520,160 Q490,130 480,100 Q470,70 500,50Z"/>
            <!-- Australia -->
            <path d="M660,280 Q690,270 710,280 Q730,300 720,330 Q700,350 680,345 Q660,330 660,280Z"/>
            <!-- Antarctica hint -->
            <path d="M100,370 Q250,360 400,365 Q550,360 700,370 Q650,390 400,395 Q150,390 100,370Z" fill="rgba(78,205,196,0.03)"/>
          </g>
          <!-- Station markers -->
          <g class="map-markers">
            <circle cx="564" cy="156" r="5" class="station-marker" data-station-id="tianshu">
              <animate attributeName="r" values="3;6;3" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="235" cy="152" r="5" class="station-marker" data-station-id="tianquan">
              <animate attributeName="r" values="3;6;3" dur="3.7s" repeatCount="indefinite"/>
            </circle>
            <circle cx="268" cy="295" r="5" class="station-marker" data-station-id="southern-cross">
              <animate attributeName="r" values="3;6;3" dur="3.3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="254" cy="307" r="5" class="station-marker" data-station-id="andes-eye">
              <animate attributeName="r" values="3;6;3" dur="4.1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="96" cy="204" r="5" class="station-marker" data-station-id="mauna-kea">
              <animate attributeName="r" values="3;6;3" dur="3.5s" repeatCount="indefinite"/>
            </circle>
            <!-- Connection lines between stations -->
            <polyline points="564,156 235,152 96,204 268,295 254,307" stroke="rgba(78,205,196,0.06)" stroke-width="0.5" fill="none" stroke-dasharray="4,6"/>
          </g>
        </svg>
      </div>
      <div class="station-list">
        <div class="station-item" data-station-id="tianshu">
          <span class="station-dot"></span>
          <span class="station-label">天枢站</span>
          <span class="station-loc">中国 · 贵州</span>
          <span class="station-sub">射电干涉阵列</span>
        </div>
        <div class="station-item" data-station-id="tianquan">
          <span class="station-dot"></span>
          <span class="station-label">天权站</span>
          <span class="station-loc">中国 · 西藏</span>
          <span class="station-sub">高海拔光学巡天</span>
        </div>
        <div class="station-item" data-station-id="southern-cross">
          <span class="station-dot"></span>
          <span class="station-label">南十字站</span>
          <span class="station-loc">智利 · 阿塔卡马</span>
          <span class="station-sub">亚毫米波干涉阵</span>
        </div>
        <div class="station-item" data-station-id="andes-eye">
          <span class="station-dot"></span>
          <span class="station-label">安第斯之眼</span>
          <span class="station-loc">智利 · 帕穹山</span>
          <span class="station-sub">大视场巡天望远镜</span>
        </div>
        <div class="station-item" data-station-id="mauna-kea">
          <span class="station-dot"></span>
          <span class="station-label">莫纳克亚站</span>
          <span class="station-loc">美国 · 夏威夷</span>
          <span class="station-sub">自适应光学 / 红外</span>
        </div>
      </div>
    </section>

    <!-- Station detail card -->
    <div class="station-card-overlay" id="station-card">
      <div class="station-card-inner">
        <button class="station-card-close" id="station-card-close">&times;</button>
        <p class="station-card-eyebrow" id="st-name-en"></p>
        <h3 id="st-name"></h3>
        <div class="station-card-meta">
          <span id="st-location"></span> · <span id="st-coords"></span> · <span id="st-altitude"></span> · 建于 <span id="st-established"></span>
        </div>
        <div class="station-card-section">
          <h4>核心设备</h4>
          <p id="st-instruments"></p>
        </div>
        <div class="station-card-section">
          <h4>研究焦点</h4>
          <p id="st-focus"></p>
        </div>
        <div class="station-card-note" id="st-note"></div>
      </div>
    </div>

    <section class="team" id="team">
      <p class="section-label">· 核心团队 ·</p>
      <h2 class="section-title">那些凝视星空的人。</h2>
      <div class="team-grid">
        <div class="team-card">
          <div class="team-avatar">陈</div>
          <h3>陈星远</h3>
          <p class="team-title">首任所长 · 理论宇宙学家</p>
          <p class="team-bio">前普林斯顿高等研究院成员。在宇宙微波背景的非高斯性研究中提出了被广泛引用的"三场关联"模型。2003 年放弃 IAS 终身职位回国创立星空研究所。他将研究所形容为"人类好奇心在物理世界中的前哨站"。</p>
          <p class="team-quote">"我们不是在研究星星，我们是在研究自己从哪里来。"</p>
        </div>
        <div class="team-card">
          <div class="team-avatar">林</div>
          <h3>林暮云</h3>
          <p class="team-title">首席科学家 · 射电天文学家</p>
          <p class="team-bio">天枢站的主要设计者之一。她的博士论文首次从 FAST 数据中识别出 47 颗新的毫秒脉冲星，其中两颗处于罕见的"黑寡妇"双星系统。她坚持每天凌晨四点开始数据分析——"那时候银河系正好在我们头顶"。</p>
          <p class="team-quote">"脉冲星的滴答声比任何时钟都精确。它们在教我们如何测量宇宙。"</p>
        </div>
        <div class="team-card">
          <div class="team-avatar">V</div>
          <h3>Elena Vasquez</h3>
          <p class="team-title">南半球观测站站长 · 行星科学家</p>
          <p class="team-bio">智利天主教大学天体物理学博士，在阿塔卡马工作已超过十五年。她的团队利用南十字站的亚毫米波干涉阵，首次在 TW Hydrae 原行星盘中探测到甲醇分子的空间分布——这是理解行星形成化学的关键一步。</p>
          <p class="team-quote">"安第斯山脉的夜空教会我：寂静本身就是一种数据。"</p>
        </div>
        <div class="team-card">
          <div class="team-avatar">苏</div>
          <h3>苏见微</h3>
          <p class="team-title">数据科学主任 · 计算天体物理学家</p>
          <p class="team-bio">麻省理工学院计算机科学博士，研究方向是神经网络在天体物理逆问题中的应用。他主导开发了研究所的暗物质拓扑重建算法——一种将引力透镜图像转化为三维质量分布图的深度学习方法。</p>
          <p class="team-quote">"宇宙是一台图灵机，物理定律是它的指令集。"</p>
        </div>
        <div class="team-card">
          <div class="team-avatar">中</div>
          <h3>中村海斗</h3>
          <p class="team-title">仪器工程总监 · 自适应光学专家</p>
          <p class="team-bio">东京大学精密工学出身，曾在昴星团望远镜从事自适应光学系统研发。他设计的五光束激光导星系统使莫纳克亚站的红外成像分辨率突破了传统大气视宁度极限。工作台上永远放着一本折角的《银河铁道之夜》。</p>
          <p class="team-quote">"我们打磨镜片，本质上是在磨去人类与宇宙之间的那层雾。"</p>
        </div>
      </div>
    </section>

    <section class="diaries" id="diaries">
      <!-- 由 Diaries.js 异步填充 -->
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

// Stations
initStations();

// Audio button
const audioBtn = document.getElementById('audio-btn');
audioBtn.addEventListener('click', () => {
  const on = audioEngine.toggle();
  audioBtn.classList.toggle('muted', !on);
  audioBtn.textContent = on ? '♫' : '♪';
});

// APOD — 每日天文一图
const apodSection = document.getElementById('daily');
initAPOD(apodSection);

// Diaries — 角色观测日志
const diariesSection = document.getElementById('diaries');
initDiaries(diariesSection);

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
