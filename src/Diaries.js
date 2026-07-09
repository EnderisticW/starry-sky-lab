/**
 * Diaries.js — 角色每日观测日记（支持历史浏览）
 *
 * 加载 /data/diaries.json（今日首页用）以及 /data/diaries/index.json（全部日期）。
 * 用户可通过 ← → 按钮切换日期，浏览历史观测日志。
 */

const MOOD_MAP = {
  contemplative: '沉思', focused: '专注', awe: '敬畏',
  analytical: '推演', fulfilled: '完满', melancholy: '感怀',
  wonder: '惊奇', calm: '沉静',
};

const AVATARS = {
  '陈星远': '陈', '林暮云': '林', 'Elena Vasquez': 'V', '苏见微': '苏', '中村海斗': '中',
};

let _index = null;       // 日期索引缓存
let _cache = {};         // 已加载的日记内容缓存 { "2026-06-05": {...} }
let _currentDate = null; // 当前显示的日期

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── 加载日期索引 ──
async function loadIndex() {
  if (_index) return _index;
  try {
    const res = await fetch('./data/diaries/index.json');
    if (!res.ok) throw new Error('No index');
    _index = await res.json();
    return _index;
  } catch (_) {
    _index = { dates: [] };
    return _index;
  }
}

// ── 加载指定日期的日记 ──
async function loadDiary(dateStr) {
  if (_cache[dateStr]) return _cache[dateStr];
  try {
    const url = dateStr === 'latest'
      ? './data/diaries.json'
      : `./data/diaries/${dateStr}.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Not found: ${dateStr}`);
    const data = await res.json();
    _cache[dateStr] = data;
    // 同时以实际日期缓存
    if (data.date) _cache[data.date] = data;
    return data;
  } catch (e) {
    console.warn(`Diary ${dateStr} unavailable:`, e.message);
    return null;
  }
}

// ── 渲染单张卡片 ──
function renderCard(entry) {
  const avatar = AVATARS[entry.character] || entry.character[0];
  const moodLabel = MOOD_MAP[entry.mood] || entry.mood;
  const stationLine = entry.station
    ? `<span class="diary-station">📍 ${escapeHTML(entry.station)}</span>`
    : '';

  return `
    <div class="diary-card">
      <div class="diary-card-header">
        <div class="diary-avatar">${avatar}</div>
        <div class="diary-card-meta">
          <h3 class="diary-character">${escapeHTML(entry.character)}</h3>
          <span class="diary-object">${escapeHTML(entry.astronomical_object)}</span>
          ${stationLine}
        </div>
        <span class="diary-mood" title="${moodLabel}">${moodLabel}</span>
      </div>
      <p class="diary-entry">${escapeHTML(entry.entry)}</p>
    </div>
  `;
}

// ── 渲染导航栏 ──
function renderNav(currentDate, index) {
  const dates = index.dates.map(d => d.date).sort();
  if (dates.length === 0) return '';

  const idx = dates.indexOf(currentDate);
  const prevDate = idx > 0 ? dates[idx - 1] : null;
  const nextDate = idx < dates.length - 1 ? dates[idx + 1] : null;
  const isLatest = idx === dates.length - 1;

  const prevBtn = prevDate
    ? `<button class="diary-nav-btn" data-date="${prevDate}" title="${prevDate}">← ${prevDate}</button>`
    : `<span class="diary-nav-btn diary-nav-btn--disabled">←</span>`;

  const nextBtn = nextDate
    ? `<button class="diary-nav-btn" data-date="${nextDate}" title="${nextDate}">${nextDate} →</button>`
    : `<span class="diary-nav-btn diary-nav-btn--disabled">→</span>`;

  const latestBadge = isLatest ? '<span class="diary-latest-badge">最新</span>' : '';

  return `
    <div class="diary-nav">
      ${prevBtn}
      <span class="diary-nav-date">${currentDate} ${latestBadge}</span>
      ${nextBtn}
    </div>
  `;
}

// ── 渲染整个板块 ──
function renderSection(container, data, index) {
  const dateStr = data.date;

  container.innerHTML = `
    <p class="section-label">· 观测日志 · <span class="diary-label-en">Observation Logs</span></p>
    <h2 class="section-title">五双眼睛，<br>凝望同一片深空。</h2>
    ${renderNav(dateStr, index)}
    <div class="diaries-grid" id="diaries-grid">
      ${data.entries.map(entry => renderCard(entry)).join('')}
    </div>
    <p class="diary-disclaimer">观测日志由星空研究所各站点实时记录。文本由 AI 基于角色人设生成，每日更新。共 ${index.dates.length} 天存档。</p>
  `;

  // 绑定导航按钮事件
  container.querySelectorAll('.diary-nav-btn[data-date]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const targetDate = btn.dataset.date;
      await navigateTo(container, targetDate);
    });
  });

  // 滚动揭示
  const cards = container.querySelectorAll('.diary-card');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = `all 0.8s ${i * 0.12}s ease`;
    revealObserver.observe(card);
  });
}

// ── 导航到指定日期 ──
async function navigateTo(container, targetDate) {
  // 显示加载状态
  const grid = container.querySelector('#diaries-grid');
  if (grid) {
    grid.style.opacity = '0.3';
    grid.style.transition = 'opacity 0.3s ease';
  }

  const data = await loadDiary(targetDate);
  if (!data) {
    if (grid) grid.style.opacity = '1';
    return;
  }

  _currentDate = targetDate;
  const index = _index || await loadIndex();
  // 重新渲染（保留导航事件和滚动揭示由 renderSection 内部处理）
  // 为避免重复的 IntersectionObserver，直接重建
  renderSection(container, data, index);

  // 滚动到日记网格位置
  const newGrid = container.querySelector('#diaries-grid');
  if (newGrid) {
    newGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ── 入口：初始化 ──
export async function initDiaries(container) {
  try {
    // 并行加载索引和今日日记
    const [index, todayData] = await Promise.all([
      loadIndex(),
      loadDiary('latest'),
    ]);

    if (!todayData || !todayData.entries?.length) {
      throw new Error('No diary data');
    }

    _currentDate = todayData.date;
    _index = index;
    _cache[todayData.date] = todayData;

    renderSection(container, todayData, index);
  } catch (e) {
    console.warn('Diaries unavailable:', e.message);
    container.style.display = 'none';
  }
}
