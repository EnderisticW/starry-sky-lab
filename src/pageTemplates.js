const navigationItems = [
  ['home', './index.html', '首页'],
  ['observatory', './observatory.html', '观测台'],
  ['logs', './logs.html', '日志档案'],
  ['institute', './institute.html', '研究所'],
];

function navigation(activePage) {
  const links = navigationItems.map(([key, href, label]) => `
    <li><a href="${href}"${key === activePage ? ' aria-current="page"' : ''}>${label}</a></li>
  `).join('');

  return `
    <nav aria-label="主导航">
      <a class="nav-brand" href="./index.html" aria-label="星空研究所首页">
        <span class="brand-mark" aria-hidden="true"><img src="./assets/brand-mark-nav.png" alt="" /></span>
        <span class="brand-wordmark"><strong>星空研究所</strong><small>ICI</small></span>
      </a>
      <ul class="nav-links">${links}</ul>
    </nav>
  `;
}

function footer() {
  return `
    <footer>
      <div class="footer-brand">星空研究所</div>
      <div class="footer-info">© 2026 Institute for Cosmic Inquiry · 中国 · 智利 · 夏威夷</div>
    </footer>
  `;
}

function quoteSection() {
  return `
    <section class="quote-section">
      <blockquote>
        “宇宙中最令人感动的，<br>不是它的浩瀚与永恒，<br>而是我们这颗微尘上的短暂意识，<br>竟然能够理解它的法则。”
      </blockquote>
      <cite>— 首任所长 · 陈星远</cite>
    </section>
  `;
}

function observationCard(preview = false) {
  return `
    <div class="obs-card${preview ? ' obs-card--preview' : ''}" id="obs-card" aria-live="polite">
      <div class="obs-card-inner">
        <button class="obs-card-close" id="obs-close" aria-label="关闭观测卡片">&times;</button>
        <div class="obs-card-id" id="obs-id"></div>
        <h3 id="obs-name"></h3>
        <dl class="obs-card-specs">
          <dt>光谱类型</dt><dd id="obs-spectral"></dd>
          <dt>距地距离</dt><dd id="obs-distance"></dd>
          <dt>视星等</dt><dd id="obs-magnitude"></dd>
          <dt>表面温度</dt><dd id="obs-temp"></dd>
        </dl>
        <p class="obs-card-note" id="obs-note"></p>
        ${preview ? '<a class="text-link obs-card-entry" href="./observatory.html">进入观测台 · 继续追踪信标</a>' : ''}
      </div>
    </div>
  `;
}

function researchSection() {
  return `
    <section class="research" id="research">
      <div class="section-heading-row">
        <div>
          <p class="section-label">· 研究方向 · Research Programmes</p>
          <h2 class="section-title">三个维度，<br>探索深空。</h2>
        </div>
        <p class="section-intro">从恒星的生灭，到不可见质量的网络，再到遥远行星大气中的生命印记——研究所在不同尺度上追踪同一个问题：宇宙如何成为今天的样子。</p>
      </div>
      <div class="research-grid">
        <article class="research-card">
          <div class="research-card-index">01</div>
          <h3>恒星演化动力学</h3>
          <p>模拟大质量恒星的诞生与消亡，追踪重元素在超新星爆发中的合成路径。我们维护着南半球最大的恒星光谱数据库。</p>
          <div class="card-line"></div>
        </article>
        <article class="research-card">
          <div class="research-card-index">02</div>
          <h3>暗物质拓扑制图</h3>
          <p>利用引力透镜效应绘制暗物质在宇宙尺度上的三维分布，从星系形态的微小扭曲中重建不可见质量的网络。</p>
          <div class="card-line"></div>
        </article>
        <article class="research-card">
          <div class="research-card-index">03</div>
          <h3>系外大气光谱学</h3>
          <p>通过凌星光谱解码遥远行星大气层的化学成分，寻找氧、甲烷与水蒸气留下的气态印记——那些可能暗示另一个生命世界的微弱信号。</p>
          <div class="card-line"></div>
        </article>
      </div>
    </section>
  `;
}

function stationSection() {
  const stations = [
    ['tianshu', '天枢站', '中国 · 贵州', '射电干涉阵列'],
    ['tianquan', '天权站', '中国 · 西藏', '高海拔光学巡天'],
    ['southern-cross', '南十字站', '智利 · 阿塔卡马', '亚毫米波干涉阵'],
    ['andes-eye', '安第斯之眼', '智利 · 帕穹山', '大视场巡天望远镜'],
    ['mauna-kea', '莫纳克亚站', '美国 · 夏威夷', '自适应光学 / 红外'],
  ];

  return `
    <section class="stations" id="stations">
      <div class="section-heading-row">
        <div>
          <p class="section-label">· 观测网络 · Observatory Network</p>
          <h2 class="section-title">三大洲，<br>五座天眼。</h2>
        </div>
        <div class="network-summary" aria-label="观测网络摘要">
          <span><strong>5</strong> Stations</span>
          <span><strong>3</strong> Continents</span>
          <span><strong>24h</strong> Listening</span>
        </div>
      </div>
      <div class="station-list station-list--expanded">
        ${stations.map(([id, name, location, specialty], index) => `
          <button class="station-item" data-station-id="${id}" type="button">
            <span class="station-sequence">0${index + 1}</span>
            <span class="station-dot"></span>
            <span class="station-label">${name}</span>
            <span class="station-loc">${location}</span>
            <span class="station-sub">${specialty}</span>
          </button>
        `).join('')}
      </div>
    </section>
  `;
}

function stationOverlay() {
  return `
    <div class="station-card-overlay" id="station-card" role="dialog" aria-modal="true" aria-labelledby="st-name">
      <div class="station-card-inner">
        <button class="station-card-close" id="station-card-close" aria-label="关闭观测站资料">&times;</button>
        <p class="station-card-eyebrow" id="st-name-en"></p>
        <h3 id="st-name"></h3>
        <div class="station-card-meta">
          <span id="st-location"></span> · <span id="st-coords"></span> · <span id="st-altitude"></span> · 建于 <span id="st-established"></span>
        </div>
        <div class="station-card-section"><h4>核心设备</h4><p id="st-instruments"></p></div>
        <div class="station-card-section"><h4>研究焦点</h4><p id="st-focus"></p></div>
        <div class="station-card-note" id="st-note"></div>
      </div>
    </div>
  `;
}

function teamSection() {
  const team = [
    ['陈', '陈星远', '首任所长 · 理论宇宙学家', '前普林斯顿高等研究院成员，在宇宙微波背景的非高斯性研究中提出“三场关联”模型。2003 年回国创立星空研究所。', '“我们不是在研究星星，我们是在研究自己从哪里来。”'],
    ['林', '林暮云', '首席科学家 · 射电天文学家', '天枢站的主要设计者之一，从 FAST 数据中识别出 47 颗新的毫秒脉冲星。她坚持每天凌晨四点开始数据分析。', '“脉冲星的滴答声比任何时钟都精确。它们在教我们如何测量宇宙。”'],
    ['V', 'Elena Vasquez', '南半球观测站站长 · 行星科学家', '在阿塔卡马工作超过十五年，长期研究原行星盘中的分子空间分布与行星形成化学。', '“安第斯山脉的夜空教会我：寂静本身就是一种数据。”'],
    ['苏', '苏见微', '数据科学主任 · 计算天体物理学家', '主导开发暗物质拓扑重建算法，将引力透镜图像转化为三维质量分布。', '“宇宙是一台图灵机，物理定律是它的指令集。”'],
    ['中', '中村海斗', '仪器工程总监 · 自适应光学专家', '设计五光束激光导星系统，使莫纳克亚站的红外成像突破传统大气视宁度极限。', '“我们打磨镜片，本质上是在磨去人类与宇宙之间的那层雾。”'],
  ];

  return `
    <section class="team" id="team">
      <p class="section-label">· 核心团队 · Research Fellows</p>
      <h2 class="section-title">那些凝视星空的人。</h2>
      <div class="team-grid">
        ${team.map(([avatar, name, title, bio, quote]) => `
          <article class="team-card">
            <div class="team-avatar">${avatar}</div>
            <h3>${name}</h3>
            <p class="team-title">${title}</p>
            <p class="team-bio">${bio}</p>
            <p class="team-quote">${quote}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

export function renderHome() {
  return `
    <div class="grain"></div><div class="scan-line"></div>
    <main>
      ${navigation('home')}
      <section class="hero home-hero" id="home">
        <div class="hero-copy">
          <p class="hero-eyebrow">Institute for Cosmic Inquiry</p>
          <h1>星空<span class="accent">研究所</span></h1>
          <p class="hero-tagline">在无垠的暗夜中寻找光的轨迹，<br>于星辰之间，追问宇宙最初的谜底。</p>
        </div>
        <a class="hero-scroll-cue" href="#daily"><span></span>进入今日观测数据</a>
      </section>
      <section class="cosmic-today home-daily" id="daily">
        <p class="section-label">· 今日宇宙观测 · <span class="apod-label-en">Today's Cosmic Observation</span></p>
        <div class="apod-loading">正在链接深空观测网络…</div>
      </section>
      <section class="home-mission">
        <div>
          <p class="section-label">· 研究所使命 · Our Inquiry</p>
          <h2 class="section-title">把不可见之物，<br>带入人类的视野。</h2>
        </div>
        <div class="mission-copy">
          <p>从五座观测站传回的光谱、射电与时域数据，在这里汇聚成一幅不断生长的宇宙图景。</p>
          <a class="text-link" href="./institute.html">阅读研究所档案</a>
        </div>
        <div class="mission-process" aria-label="研究所的研究方法">
          <article>
            <span>01 / Receive</span>
            <h3>接收微光</h3>
            <p>让分布在三大洲的观测站，把光谱、射电与时域信号带回同一条数据链。</p>
          </article>
          <article>
            <span>02 / Reconstruct</span>
            <h3>重建不可见</h3>
            <p>从噪声、引力透镜与光变曲线中，复原肉眼无法直接抵达的宇宙结构。</p>
          </article>
          <article>
            <span>03 / Question</span>
            <h3>继续追问</h3>
            <p>让观测与模型彼此校验，把每一次答案转化为下一次更精确的凝视。</p>
          </article>
        </div>
      </section>
      <section class="portal-section" aria-labelledby="portal-title">
        <p class="section-label">· 深空通道 · Three Ways In</p>
        <h2 class="section-title" id="portal-title">选择一次凝视。</h2>
        <div class="portal-list">
          <a href="./observatory.html"><span>01 / Observe</span><strong>锁定信标，操作望远镜</strong><i>进入观测台 →</i></a>
          <a href="./logs.html"><span>02 / Archive</span><strong>阅读今日与往日观测记录</strong><i>打开日志档案 →</i></a>
          <a href="./institute.html"><span>03 / Institute</span><strong>认识五座天眼与凝视者</strong><i>查阅研究所 →</i></a>
        </div>
      </section>
      <section class="latest-signal" id="latest-signal">
        <div class="latest-signal-heading">
          <p class="section-label">· 最新观测记录 · Latest Field Note</p>
          <time id="latest-log-date"></time>
        </div>
        <article class="latest-log-card">
          <div class="latest-log-meta"><span id="latest-log-character">正在接收</span><span id="latest-log-object">深空信号</span></div>
          <p id="latest-log-entry">日志数据正在穿过观测网络抵达本部……</p>
          <a class="text-link" href="./logs.html">阅读完整日志档案</a>
        </article>
      </section>
      ${quoteSection()}
      ${footer()}
    </main>
    <button class="audio-toggle muted" id="audio-btn" title="开启声音" aria-label="开启声音">&#9835;</button>
  `;
}

export function renderObservatory() {
  return `
    <div class="grain"></div><div class="scan-line"></div>
    <main class="observatory-main">
      ${navigation('observatory')}
      <section class="hero observatory-stage" id="observatory-stage">
        <div class="observatory-copy">
          <p class="hero-eyebrow">Deep-Sky Observation Console</p>
          <h1>深空<br><span class="accent">观测台</span></h1>
          <p class="hero-tagline">扫描天区寻找脉动信标，点击目标，等待望远镜完成重新对焦。</p>
        </div>
        <div class="observatory-readout"><span>ICI / LIVE ARRAY</span><span>RA 17h 45m · DEC −29°</span></div>
      </section>
    </main>
    <div class="discovery-counter" id="discovery-counter">已发现 0 / 10</div>
    ${observationCard(false)}
    <button class="audio-toggle muted" id="audio-btn" title="开启声音" aria-label="开启声音">&#9835;</button>
    <div class="click-hint" id="click-hint">发现信标 · 点击观测</div>
  `;
}

export function renderLogs() {
  return `
    <div class="grain"></div><div class="scan-line"></div>
    <main>
      ${navigation('logs')}
      <header class="page-masthead logs-masthead">
        <p class="hero-eyebrow">Observation Archive</p>
        <h1>观测日志</h1>
        <p>五双眼睛，在不同经纬度与波段中，凝望同一片深空。</p>
      </header>
      <section class="diaries archive-diaries" id="diaries"></section>
      ${footer()}
    </main>
    <button class="audio-toggle muted" id="audio-btn" title="开启声音" aria-label="开启声音">&#9835;</button>
  `;
}

export function renderInstitute() {
  return `
    <div class="grain"></div><div class="scan-line"></div>
    <main>
      ${navigation('institute')}
      <header class="page-masthead institute-masthead">
        <p class="hero-eyebrow">Institute for Cosmic Inquiry</p>
        <h1>关于研究所</h1>
        <p>一座跨越三大洲的观测网络，一群以数据丈量宇宙的人。</p>
      </header>
      <section class="about institute-about" id="about">
        <div class="about-text">
          <p class="section-label">· 关于我们 ·</p>
          <h2 class="section-title">凝视深渊，<br>亦被深渊凝视。</h2>
          <p>星空研究所成立于人类望向银河的第三个千年。我们致力于天体物理学前沿探索、宇宙微波背景辐射分析，以及系外行星大气层的遥感研究。</p>
          <p>团队分布在三个大洲的五个观测站，在海拔五千米的稀薄空气与绝对寂静中，聆听宇宙最古老的回声。</p>
        </div>
        <div class="about-visual" aria-hidden="true">
          <div class="orbit-ring"><div class="orbit-dot"></div></div>
          <div class="orbit-ring"><div class="orbit-dot"></div></div>
          <div class="orbit-ring"><div class="orbit-dot"></div></div>
          <div class="center-star"></div>
        </div>
      </section>
      ${researchSection()}
      ${stationSection()}
      ${teamSection()}
      ${quoteSection()}
      ${footer()}
    </main>
    ${stationOverlay()}
    <button class="audio-toggle muted" id="audio-btn" title="开启声音" aria-label="开启声音">&#9835;</button>
  `;
}
