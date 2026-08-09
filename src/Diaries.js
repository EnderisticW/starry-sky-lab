/**
 * Diaries.js — 角色每日观测日记与星历导航
 *
 * 支持相邻日期翻阅、月份星历选择、URL 日期状态与浏览器前进后退。
 */

const MOOD_MAP = {
  contemplative: '沉思', focused: '专注', awe: '敬畏',
  analytical: '推演', fulfilled: '完满', melancholy: '感怀',
  wonder: '惊奇', calm: '沉静',
};

const AVATARS = {
  '陈星远': '陈', '林暮云': '林', 'Elena Vasquez': 'V', '苏见微': '苏', '中村海斗': '中',
};

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];

let _index = null;
let _cache = {};
let _currentDate = null;
let _visibleMonth = null;
let _popstateBound = false;

function escapeHTML(str = '') {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

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
    if (data.date) _cache[data.date] = data;
    return data;
  } catch (error) {
    console.warn(`Diary ${dateStr} unavailable:`, error.message);
    return null;
  }
}

function renderCard(entry) {
  const avatar = AVATARS[entry.character] || entry.character[0];
  const moodLabel = MOOD_MAP[entry.mood] || entry.mood;
  const stationLine = entry.station
    ? `<span class="diary-station">OBS / ${escapeHTML(entry.station)}</span>`
    : '';

  return `
    <article class="diary-card">
      <div class="diary-card-header">
        <div class="diary-avatar">${avatar}</div>
        <div class="diary-card-meta">
          <h3 class="diary-character">${escapeHTML(entry.character)}</h3>
          <span class="diary-object">${escapeHTML(entry.astronomical_object)}</span>
          ${stationLine}
        </div>
        <span class="diary-mood" title="${escapeHTML(moodLabel)}">${escapeHTML(moodLabel)}</span>
      </div>
      <p class="diary-entry">${escapeHTML(entry.entry)}</p>
    </article>
  `;
}

function monthLabel(month) {
  const [year, value] = month.split('-');
  return `${year} 年 ${Number(value)} 月`;
}

function availableDates(index) {
  return index.dates.map(item => item.date).sort();
}

function availableMonths(index) {
  return [...new Set(availableDates(index).map(date => date.slice(0, 7)))];
}

function renderCalendar(currentDate, index, month) {
  const dates = availableDates(index);
  const dateSet = new Set(dates);
  const months = availableMonths(index);
  const monthIndex = months.indexOf(month);
  const previousMonth = monthIndex > 0 ? months[monthIndex - 1] : null;
  const nextMonth = monthIndex >= 0 && monthIndex < months.length - 1 ? months[monthIndex + 1] : null;
  const latestDate = dates.at(-1);

  const [year, monthNumber] = month.split('-').map(Number);
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  const firstWeekday = (new Date(year, monthNumber - 1, 1).getDay() + 6) % 7;
  const cells = [];

  for (let blank = 0; blank < firstWeekday; blank++) {
    cells.push('<span class="calendar-day calendar-day--empty" aria-hidden="true"></span>');
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${month}-${String(day).padStart(2, '0')}`;
    const hasLog = dateSet.has(date);
    if (!hasLog) {
      cells.push(`<span class="calendar-day calendar-day--unavailable">${day}</span>`);
      continue;
    }

    const classes = [
      'calendar-day',
      'calendar-day--available',
      date === currentDate ? 'is-selected' : '',
      date === latestDate ? 'is-latest' : '',
    ].filter(Boolean).join(' ');
    cells.push(`<button class="${classes}" type="button" data-date="${date}" aria-label="查看 ${date} 的观测日志"${date === currentDate ? ' aria-current="date"' : ''}>${day}<i></i></button>`);
  }

  return `
    <div class="diary-calendar" aria-hidden="true">
      <div class="calendar-heading">
        <button class="calendar-month-step${previousMonth ? '' : ' is-disabled'}" type="button" ${previousMonth ? `data-month="${previousMonth}"` : 'disabled'} aria-label="上一个有日志的月份">←</button>
        <strong>${monthLabel(month)}</strong>
        <button class="calendar-month-step${nextMonth ? '' : ' is-disabled'}" type="button" ${nextMonth ? `data-month="${nextMonth}"` : 'disabled'} aria-label="下一个有日志的月份">→</button>
      </div>
      <div class="calendar-weekdays" aria-hidden="true">${WEEKDAYS.map(day => `<span>${day}</span>`).join('')}</div>
      <div class="calendar-grid">${cells.join('')}</div>
      <div class="calendar-footer">
        <span><i></i> 有观测记录</span>
        ${currentDate !== latestDate ? `<button type="button" data-date="${latestDate}">回到最新记录</button>` : '<span class="calendar-current-note">当前为最新记录</span>'}
      </div>
    </div>
  `;
}

function renderNavigator(currentDate, index) {
  const dates = availableDates(index);
  if (!dates.length) return '';

  const position = dates.indexOf(currentDate);
  const previousDate = position > 0 ? dates[position - 1] : null;
  const nextDate = position < dates.length - 1 ? dates[position + 1] : null;
  const isLatest = currentDate === dates.at(-1);
  _visibleMonth = _visibleMonth || currentDate.slice(0, 7);

  return `
    <div class="diary-navigator">
      <div class="diary-nav">
        <button class="diary-step${previousDate ? '' : ' is-disabled'}" type="button" ${previousDate ? `data-date="${previousDate}"` : 'disabled'} aria-label="上一份观测日志"><span>←</span><small>${previousDate || '最早记录'}</small></button>
        <button class="diary-date-trigger" type="button" aria-expanded="false">
          <small>Observation Date</small>
          <strong>${currentDate.replaceAll('-', ' · ')}</strong>
          ${isLatest ? '<span>最新</span>' : ''}
        </button>
        <button class="diary-step diary-step--next${nextDate ? '' : ' is-disabled'}" type="button" ${nextDate ? `data-date="${nextDate}"` : 'disabled'} aria-label="下一份观测日志"><small>${nextDate || '最新记录'}</small><span>→</span></button>
      </div>
      ${renderCalendar(currentDate, index, _visibleMonth)}
    </div>
  `;
}

function bindCalendar(container, data, index, trigger) {
  const calendar = container.querySelector('.diary-calendar');
  calendar?.querySelectorAll('[data-date]').forEach(button => {
    button.addEventListener('click', () => navigateTo(container, button.dataset.date));
  });

  calendar?.querySelectorAll('[data-month]').forEach(button => {
    button.addEventListener('click', () => {
      _visibleMonth = button.dataset.month;
      calendar.outerHTML = renderCalendar(data.date, index, _visibleMonth);
      const newCalendar = container.querySelector('.diary-calendar');
      newCalendar.classList.add('is-open');
      newCalendar.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
      bindCalendar(container, data, index, trigger);
    });
  });
}

function bindNavigator(container, data, index) {
  const trigger = container.querySelector('.diary-date-trigger');

  trigger?.addEventListener('click', () => {
    const calendar = container.querySelector('.diary-calendar');
    const open = calendar.classList.toggle('is-open');
    calendar.setAttribute('aria-hidden', String(!open));
    trigger.setAttribute('aria-expanded', String(open));
  });

  container.querySelectorAll('.diary-nav [data-date]').forEach(button => {
    button.addEventListener('click', () => navigateTo(container, button.dataset.date));
  });

  bindCalendar(container, data, index, trigger);
}

function revealCards(container) {
  const cards = container.querySelectorAll('.diary-card');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(32px)';
    card.style.transition = `opacity 0.7s ${index * 0.08}s ease, transform 0.7s ${index * 0.08}s ease, border-color 0.5s ease`;
    revealObserver.observe(card);
  });
}

function renderSection(container, data, index) {
  container.innerHTML = `
    <div class="archive-heading">
      <p class="section-label">· 星历索引 · <span class="diary-label-en">Observation Almanac</span></p>
      <p>选择一个发光日期，读取五座观测站在同一天留下的记录。</p>
    </div>
    ${renderNavigator(data.date, index)}
    <div class="diaries-grid" id="diaries-grid">
      ${data.entries.map(entry => renderCard(entry)).join('')}
    </div>
    <p class="diary-disclaimer">观测日志由星空研究所各站点记录并归档。档案库现存 ${index.dates.length} 天记录。</p>
  `;

  bindNavigator(container, data, index);
  revealCards(container);
}

async function navigateTo(container, targetDate, options = {}) {
  if (!targetDate || targetDate === _currentDate) return;
  const grid = container.querySelector('#diaries-grid');
  if (grid) grid.classList.add('is-loading');

  const data = await loadDiary(targetDate);
  if (!data) {
    grid?.classList.remove('is-loading');
    return;
  }

  _currentDate = targetDate;
  _visibleMonth = targetDate.slice(0, 7);
  renderSection(container, data, _index);

  if (options.updateHistory !== false) {
    const url = new URL(window.location.href);
    url.searchParams.set('date', targetDate);
    window.history.pushState({ date: targetDate }, '', url);
  }

  requestAnimationFrame(() => {
    container.querySelector('.diary-navigator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

export async function initDiaries(container) {
  try {
    const index = await loadIndex();
    const dates = availableDates(index);
    const requestedDate = new URLSearchParams(window.location.search).get('date');
    const targetDate = requestedDate && dates.includes(requestedDate) ? requestedDate : 'latest';
    const data = await loadDiary(targetDate);

    if (!data?.entries?.length) throw new Error('No diary data');

    _currentDate = data.date;
    _visibleMonth = data.date.slice(0, 7);
    _cache[data.date] = data;
    renderSection(container, data, index);

    if (!_popstateBound) {
      window.addEventListener('popstate', () => {
        const date = new URLSearchParams(window.location.search).get('date');
        const target = date && dates.includes(date) ? date : dates.at(-1);
        if (target && target !== _currentDate) navigateTo(container, target, { updateHistory: false });
      });
      _popstateBound = true;
    }
  } catch (error) {
    console.warn('Diaries unavailable:', error.message);
    container.innerHTML = '<p class="archive-error">星历暂时无法展开，请稍后再试。</p>';
  }
}
