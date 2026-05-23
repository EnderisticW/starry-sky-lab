export const STATIONS = [
  {
    id: 'tianshu',
    name: '天枢站',
    nameEn: 'Tianshu Array',
    location: '中国 · 贵州',
    coords: '25°39\'N, 106°51\'E',
    altitude: '海拔 1,120 米',
    established: '2007',
    instruments: '500 米口径射电干涉阵列 · 超宽带接收系统 · 脉冲星计时终端',
    focus: '脉冲星巡天 · 快速射电暴定位 · 中性氢 21cm 宇宙学',
    note: '天枢站的干涉阵列由 24 面可动抛物面天线组成，等效分辨率相当于一面直径 6.2 公里的单镜。它每年捕获约 47TB 的原始时域数据——其中大部分是银河系核球方向的恒星形成区谱线。',
    lat: 25.65, lng: 106.85,
  },
  {
    id: 'tianquan',
    name: '天权站',
    nameEn: 'Tianquan Highland Observatory',
    location: '中国 · 西藏阿里',
    coords: '32°19\'N, 80°01\'E',
    altitude: '海拔 5,100 米',
    established: '2013',
    instruments: '2.4 米光学/红外望远镜 · 广域测光巡天相机 · 高色散摄谱仪',
    focus: '银晕结构考古 · 暗物质子结构透镜 · 高红移伽马暴余晖',
    note: '天权站位于青藏高原西端，年均晴夜数超过 280 天，大气水汽含量仅为海平面的 3%。它的广域巡天相机每晚扫描约 200 平方度的天区，深度可达 26 等，是北半球最深的高分辨率时域巡天。',
    lat: 32.32, lng: 80.02,
  },
  {
    id: 'southern-cross',
    name: '南十字站',
    nameEn: 'Southern Cross Submillimeter Array',
    location: '智利 · 阿塔卡马',
    coords: '23°01\'S, 67°45\'W',
    altitude: '海拔 5,050 米',
    established: '2011',
    instruments: '亚毫米波干涉阵 · 超导隧道结混频器 · 宽场连续谱相机',
    focus: '原行星盘化学 · 星系际介质 · 宇宙红外背景',
    note: '南十字站坐落在阿塔卡马高原的 Chajnantor 台地，是研究所唯一位于南半球的亚毫米波设施。此处大气在 0.3-3mm 波段的透过率全年超过 85%，使得追踪冷分子气体的能力达到了北半球同等设备的三倍。',
    lat: -23.02, lng: -67.75,
  },
  {
    id: 'andes-eye',
    name: '安第斯之眼',
    nameEn: 'Andes Eye Wide-Field Survey',
    location: '智利 · 帕穹山',
    coords: '30°14\'S, 70°44\'W',
    altitude: '海拔 2,720 米',
    established: '2016',
    instruments: '8.4 米大视场巡天望远镜 · 十亿像素 CCD 阵列 · 多目标光纤光谱仪',
    focus: '暗能量状态方程 · 太阳系外天体普查 · 时域天文',
    note: '安第斯之眼每三晚完成一次全天南半球巡天。其十亿像素焦面由 189 片 CCD 拼接而成，单次曝光覆盖 3.5 平方度——相当于 17 个满月。自运行以来，已登记超过 4,800 颗新的柯伊伯带天体。',
    lat: -30.24, lng: -70.73,
  },
  {
    id: 'mauna-kea',
    name: '莫纳克亚站',
    nameEn: 'Mauna Kea Adaptive Optics Station',
    location: '美国 · 夏威夷',
    coords: '19°49\'N, 155°28\'W',
    altitude: '海拔 4,145 米',
    established: '2003',
    instruments: '10 米自适应光学望远镜 · 激光导星系统 · 近红外积分场摄谱仪',
    focus: '系外行星直接成像 · 黑洞视界尺度观测 · 恒星形成区动力学',
    note: '莫纳克亚站是研究所五个站点中海拔最高的一处。其自适应光学系统使用五束钠激光在 90 公里高的大气层中生成人造导星，补偿大气湍流后的角分辨率可达 0.015 角秒——相当于从上海分辨北京街头的一枚硬币。',
    lat: 19.82, lng: -155.47,
  },
];

function showStationCard(id) {
  const s = STATIONS.find(st => st.id === id);
  if (!s) return;
  const card = document.getElementById('station-card');
  document.getElementById('st-name').textContent = s.name;
  document.getElementById('st-name-en').textContent = s.nameEn;
  document.getElementById('st-location').textContent = s.location;
  document.getElementById('st-coords').textContent = s.coords;
  document.getElementById('st-altitude').textContent = s.altitude;
  document.getElementById('st-established').textContent = s.established;
  document.getElementById('st-instruments').textContent = s.instruments;
  document.getElementById('st-focus').textContent = s.focus;
  document.getElementById('st-note').textContent = s.note;
  card.style.opacity = '1';
  card.style.pointerEvents = 'auto';
}

export function initStations() {
  const card = document.getElementById('station-card');
  const close = document.getElementById('station-card-close');

  document.querySelectorAll('.station-marker').forEach(m => {
    m.addEventListener('click', () => showStationCard(m.dataset.stationId));
  });

  document.querySelectorAll('.station-item').forEach(el => {
    el.addEventListener('click', () => showStationCard(el.dataset.stationId));
  });

  close.addEventListener('click', () => {
    card.style.opacity = '0';
    card.style.pointerEvents = 'none';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      card.style.opacity = '0';
      card.style.pointerEvents = 'none';
    }
  });
}
