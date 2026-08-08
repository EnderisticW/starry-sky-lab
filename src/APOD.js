/**
 * APOD.js — NASA 每日天文一图的本地缓存读取器
 *
 * 浏览器不直接携带 NASA API Key。线上工作流或本地刷新脚本每天更新
 * public/data/apod.json；请求失败时保留上一次成功内容。
 */

const APOD_CACHE = './data/apod.json';

export async function initAPOD(container) {
  try {
    const response = await fetch(APOD_CACHE, { cache: 'no-store' });
    if (!response.ok) throw new Error(`APOD cache unavailable: ${response.status}`);
    const data = await response.json();
    if (!data?.url && !data?.thumbnail_url) throw new Error('APOD cache is incomplete');
    render(container, data);
  } catch (error) {
    console.warn('APOD unavailable:', error.message);
    renderUnavailable(container);
  }
}

function render(container, data) {
  const imageUrl = data.media_type === 'video' ? data.thumbnail_url : data.url;
  const sourceUrl = data.source_url || data.hdurl || data.url;
  const isFallback = data.cache_status === 'fallback';
  const statusText = isFallback ? '典藏影像 · 等待今日同步' : `同步于 ${formatSyncTime(data.synced_at)}`;
  const mediaAction = data.media_type === 'video'
    ? `<a class="text-link apod-media-link" href="${escapeHTML(sourceUrl)}" target="_blank" rel="noreferrer">观看 NASA 原始视频 ↗</a>`
    : `<a class="text-link apod-media-link" href="${escapeHTML(sourceUrl)}" target="_blank" rel="noreferrer">查看 NASA 原始影像 ↗</a>`;

  container.innerHTML = `
    <div class="apod-heading">
      <p class="section-label">· 今日宇宙观测 · <span class="apod-label-en">Today's Cosmic Observation</span></p>
      <span class="apod-cache-status${isFallback ? ' is-fallback' : ''}">${escapeHTML(statusText)}</span>
    </div>
    <div class="apod-layout">
      <div class="apod-image-wrapper">
        <img class="apod-image" src="${escapeHTML(imageUrl)}" alt="${escapeHTML(data.title)}" loading="lazy" />
        <span class="apod-source">NASA / APOD · ${escapeHTML(data.date || '')}</span>
        ${data.copyright ? `<span class="apod-copyright">© ${escapeHTML(data.copyright)}</span>` : ''}
      </div>
      <div class="apod-content">
        <h3 class="apod-title">${escapeHTML(data.title)}</h3>
        <p class="apod-explanation">${escapeHTML(data.explanation)}</p>
        ${mediaAction}
        <p class="apod-context">影像与说明来自 NASA 每日天文一图计划。若深空数据暂时中断，研究所将继续展示最近一次成功归档。</p>
      </div>
    </div>
  `;

  const image = container.querySelector('.apod-image');
  image?.addEventListener('error', () => {
    const wrapper = image.closest('.apod-image-wrapper');
    wrapper.classList.add('apod-image-wrapper--offline');
    wrapper.innerHTML = '<div class="apod-image-fallback"><span></span><p>影像链路暂时中断</p><small>文字观测记录仍可阅读</small></div>';
  }, { once: true });

  const layout = container.querySelector('.apod-layout');
  if (!layout || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  layout.style.opacity = '0';
  layout.style.transform = 'translateY(30px)';
  layout.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealObserver.observe(layout);
}

function renderUnavailable(container) {
  container.innerHTML = `
    <p class="section-label">· 今日宇宙观测 · <span class="apod-label-en">Today's Cosmic Observation</span></p>
    <div class="apod-unavailable">
      <span aria-hidden="true"></span>
      <div><h3>深空链路正在重新校准</h3><p>NASA 数据暂时没有抵达，但研究所的其他观测档案仍可正常查阅。</p></div>
    </div>
  `;
}

function formatSyncTime(value) {
  if (!value) return '最近一次观测';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '最近一次观测';
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(date);
}

function escapeHTML(value = '') {
  const div = document.createElement('div');
  div.textContent = String(value);
  return div.innerHTML;
}
