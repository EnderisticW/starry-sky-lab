/**
 * APOD.js — NASA 每日天文一图集成
 *
 * 从 NASA 免费 API 获取每日天文图像与解释。
 * DEMO_KEY 无需注册，适合个人项目。
 * 如流量增长可免费注册 API key: https://api.nasa.gov/
 *
 * 数据缓存于 sessionStorage，同日不重复请求。
 * API 失败或为非图像媒体时，板块优雅隐藏。
 */
const APOD_API = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export async function initAPOD(container) {
  try {
    const today = todayISO();

    // 尝试从 sessionStorage 读取缓存
    const cached = sessionStorage.getItem('apod-cache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.date === today) {
          render(container, parsed);
          return;
        }
      } catch (_) { /* 缓存损坏，重新获取 */ }
    }

    const res = await fetch(APOD_API);
    if (!res.ok) throw new Error(`APOD fetch failed: ${res.status}`);
    const data = await res.json();

    // APOD 偶尔是 YouTube 视频，跳过
    if (data.media_type !== 'image') {
      container.style.display = 'none';
      return;
    }

    // 写入缓存
    const toCache = { ...data, date: today };
    try {
      sessionStorage.setItem('apod-cache', JSON.stringify(toCache));
    } catch (_) { /* storage full, skip */ }

    render(container, toCache);
  } catch (e) {
    console.warn('APOD unavailable:', e.message);
    container.style.display = 'none';
  }
}

function render(container, data) {
  // 用中文介绍包装 NASA 的英文解释，融入研究所语境
  container.innerHTML = `
    <p class="section-label">· 今日宇宙观测 · <span class="apod-label-en">Today's Cosmic Observation</span></p>
    <div class="apod-layout">
      <div class="apod-image-wrapper">
        <img
          class="apod-image"
          src="${escapeHTML(data.url)}"
          alt="${escapeHTML(data.title)}"
          loading="lazy"
        />
        <span class="apod-source">NASA / APOD</span>
        ${data.copyright ? `<span class="apod-copyright">© ${escapeHTML(data.copyright)}</span>` : ''}
      </div>
      <div class="apod-content">
        <h3 class="apod-title">${escapeHTML(data.title)}</h3>
        <p class="apod-explanation">${escapeHTML(data.explanation)}</p>
        <p class="apod-context">以上影像与说明来自 NASA 每日天文一图计划。星空研究所将其纳入今日宇宙简报，供所有凝视深空的人参阅。</p>
      </div>
    </div>
  `;

  // 滚动揭示：APOD 内容异步加载，自行设置 observer
  const layout = container.querySelector('.apod-layout');
  if (layout) {
    layout.style.opacity = '0';
    layout.style.transform = 'translateY(30px)';
    layout.style.transition = 'all 0.8s ease';

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealObserver.observe(layout);
  }
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
