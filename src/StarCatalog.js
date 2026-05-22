const SPECTRAL_TYPES = [
  { type: 'O5V', temp: '42,000 K', freq: 0.02 },
  { type: 'B2V', temp: '22,000 K', freq: 0.05 },
  { type: 'A0V', temp: '9,700 K', freq: 0.10 },
  { type: 'A5V', temp: '8,200 K', freq: 0.10 },
  { type: 'F5V', temp: '6,500 K', freq: 0.12 },
  { type: 'G2V', temp: '5,780 K', freq: 0.18 },
  { type: 'G8V', temp: '5,400 K', freq: 0.12 },
  { type: 'K0V', temp: '5,100 K', freq: 0.10 },
  { type: 'K5V', temp: '4,400 K', freq: 0.08 },
  { type: 'M0V', temp: '3,800 K', freq: 0.08 },
  { type: 'M5V', temp: '3,000 K', freq: 0.05 },
];

const PREFIXES = ['天', '紫', '太', '北', '南', '东', '西', '华', '玉', '金', '银', '明', '辰', '枢', '衡'];
const SUFFIXES = ['微', '垣', '宿', '宫', '门', '星', '光', '元', '阳', '阴', '辰', '衡', '权', '斗', '极'];

const NOTES = [
  '该恒星光谱中存在异常吸收线，疑似周围存在大量星际尘埃。研究团队已申请额外观测时间以进一步确认。',
  '初步数据显示该星可能拥有至少两颗行星级伴星，轨道周期分别为 87 天和 412 天。等待径向速度法验证。',
  '上一次大规模光谱巡天中，此星的亮度在三个月内波动了 0.07 个星等。原因未知，已列入重点监测目标。',
  '该恒星位于一个疏散星团的边缘区域，其金属含量异常低，暗示它可能是星团形成早期的第一代恒星之一。',
  'M-系外行星调查项目在此星方向检测到微弱的凌星信号。若确认为行星，其轨道将位于宜居带内缘。',
  '快速旋转的年轻恒星，自转周期仅 1.4 天。强烈的星冕活动导致 X 射线辐射远超同类型恒星平均水平。',
  '这是一颗造父变星候选体，其光度变化周期约为 5.2 天。若确认，将成为该天区距离测量的重要标准烛光。',
  '档案数据对比显示，该恒星在过去 60 年间自行运动显著，可能是银河系厚盘成员。其运动轨迹暗示来自银晕方向。',
  '智利阿塔卡马站记录的该星光谱中，He II 线呈现周期性多普勒位移，可能指示存在一颗致密双星伴星。',
  '该天区存在微弱的星际消光现象。扣除前景消光后，该星的绝对光度比原先估计高约 23%。',
  '这颗 K 型矮星的色球层活动处于极低水平，是搜寻宜居带岩石行星的理想目标。夏威夷站已对其展开为期三年的监测计划。',
  '恒星光谱中存在微弱的锂吸收线，这是年轻恒星的典型特征。该星年龄估计不超过 1 亿年。',
  '贵州射电望远镜阵列在该方向检测到窄带脉冲信号，但尚未排除人为干扰。已列入 SETI 候选列表进行后续分析。',
];

const cache = new Map();

export const StarCatalog = {
  getStarData(star) {
    const key = `${star.layerIndex}-${star.starIndex}`;
    if (cache.has(key)) return cache.get(key);

    const sp = SPECTRAL_TYPES[Math.floor(Math.random() * SPECTRAL_TYPES.length)];
    const distLy = (4.2 + Math.random() * 2800).toFixed(0);
    const dist = +distLy < 100 ? distLy + ' 光年' : (+distLy / 1000).toFixed(1) + ' kly';
    const mag = (-1.5 + Math.random() * 12).toFixed(1);
    const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
    const num = String(Math.floor(Math.random() * 90000) + 10000);

    const data = {
      id: `ICI-${num}`,
      name: `${prefix}${suffix}${Math.floor(Math.random() * 9) + 1}`,
      spectralType: sp.type,
      distance: dist,
      magnitude: mag,
      temperature: sp.temp,
      note: NOTES[Math.floor(Math.random() * NOTES.length)],
    };
    cache.set(key, data);
    return data;
  },
};
