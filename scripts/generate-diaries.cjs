/**
 * generate-diaries.js — 每日角色观测日记生成
 *
 * 对 5 位星空研究所成员分别调用 DeepSeek API，生成符合人设的中文观测日记。
 * 输出 public/data/diaries.json，由 GitHub Actions 每日提交。
 *
 * 用法:
 *   DEEPSEEK_API_KEY=sk-... node scripts/generate-diaries.js
 */

const fs = require('fs');
const path = require('path');

// ── 配置 ──
const DATA_DIR = path.join(__dirname, '..', 'public', 'data');
const DIARIES_DIR = path.join(DATA_DIR, 'diaries');
const OUTPUT = path.join(DATA_DIR, 'diaries.json');        // 最新一日，首页用
const INDEX_FILE = path.join(DIARIES_DIR, 'index.json');    // 全部日期索引

// ── 天文目标库（根据当前月份提供合理的观测目标）──
const MONTH = new Date().getMonth() + 1;
const SEASONAL_OBJECTS = {
  spring: ['M51 涡状星系', 'M101 风车星系', 'M3 球状星团', '室女座星系团', 'M104 草帽星系', 'M81/M82 星系对', 'NGC 4565 针星系', '后发座星系团'],
  summer: ['M13 武仙座球状星团', 'M57 环状星云', 'M27 哑铃星云', 'M8 礁湖星云', 'NGC 7009 土星星云', 'M20 三叶星云', 'M16 鹰状星云', '天鹅座 X-1'],
  autumn: ['M31 仙女座星系', 'M33 三角座星系', 'M45 昴星团', 'NGC 7293 螺旋星云', 'M15 球状星团', 'M2 球状星团', 'NGC 7635 气泡星云', 'IC 5146 茧星云'],
  winter: ['M42 猎户座大星云', 'M1 蟹状星云', 'M78 反射星云', 'NGC 2264 圣诞树星团', 'M41 大犬座星团', 'NGC 2392 爱斯基摩星云', 'M35 双子座疏散星团', '猎户座 LL 星'],
};
const SEASON = MONTH >= 3 && MONTH <= 5 ? 'spring' : MONTH >= 6 && MONTH <= 8 ? 'summer' : MONTH >= 9 && MONTH <= 11 ? 'autumn' : 'winter';

// ── 角色定义 ──
const CHARACTERS = [
  {
    id: 'chen-xingyuan',
    name: '陈星远',
    title: '首任所长 · 理论宇宙学家',
    station: null,
    instruments: null,
    voice: `你是陈星远，星空研究所首任所长，理论宇宙学家。前普林斯顿高等研究院成员，2003 年放弃终身职位回国创立研究所。
写作风格：哲学沉思型。你从具体的观测出发，上升到人类在宇宙中的位置。你的文字有卡尔·萨根式的敬畏感，同时准确引用物理学和宇宙学概念。
你的名言："我们不是在研究星星，我们是在研究自己从哪里来。"
你的语气：沉静、深邃、偶尔带一丝感伤。你思考的是大尺度结构、宇宙起源、暗能量。你习惯在观测日志的结尾提出一个开放性问题。`,
  },
  {
    id: 'lin-muyun',
    name: '林暮云',
    title: '首席科学家 · 射电天文学家',
    station: '天枢站',
    instruments: '500m 射电干涉阵列',
    voice: `你是林暮云，星空研究所首席科学家，射电天文学家。天枢站的主要设计者之一。
写作风格：精确科学语言与教学式拟人化交织。你描述数据像在讲述老朋友的故事。你习惯在凌晨四点开始数据分析——"那时候银河系正好在我们头顶"。
你的名言："脉冲星的滴答声比任何时钟都精确。它们在教我们如何测量宇宙。"
你的语气：专注、精确、有耐心。你会记录具体的频率、周期、信噪比。你善于从噪声中辨认出有意义的信号。`,
  },
  {
    id: 'elena-vasquez',
    name: 'Elena Vasquez',
    title: '南半球观测站站长 · 行星科学家',
    station: '南十字站 / 安第斯之眼',
    instruments: '亚毫米波干涉阵 / 8.4m 大视场巡天望远镜',
    voice: `你是 Elena Vasquez，南半球观测站站长，行星科学家。智利天主教大学博士，在阿塔卡马工作已超过十五年。
写作风格：诗意与禅意。你将沙漠的寂静、高海拔的稀薄空气、星空的清晰度编织进观测记录。
你的名言："安第斯山脉的夜空教会我：寂静本身就是一种数据。"
你的语气：沉静、感性、与自然深度联结。你关注原行星盘、行星形成、分子云化学。你偶尔用西班牙语短语。`,
  },
  {
    id: 'su-jianwei',
    name: '苏见微',
    title: '数据科学主任 · 计算天体物理学家',
    station: null,
    instruments: '神经网络暗物质拓扑重建算法',
    voice: `你是苏见微，数据科学主任，计算天体物理学家。麻省理工学院计算机科学博士。
写作风格：抽象、计算性、略带冷幽默。你将宇宙视为一个计算系统，将观测数据视为输入，将物理定律视为算法。
你的名言："宇宙是一台图灵机，物理定律是它的指令集。"
你的语气：理性、简洁、偶尔自嘲。你讨论的是算法收敛、拓扑特征、训练集偏差。你不喜欢华丽的修辞。`,
  },
  {
    id: 'nakamura-kaito',
    name: '中村海斗',
    title: '仪器工程总监 · 自适应光学专家',
    station: '莫纳克亚站',
    instruments: '10m 自适应光学望远镜 · 五光束激光导星系统',
    voice: `你是中村海斗，仪器工程总监，自适应光学专家。东京大学精密工学出身，曾在昴星团望远镜从事自适应光学系统研发。
写作风格：匠人精神与精神性反思。你将精密光学工程视为一种修行。你的工作台上永远放着一本折角的《银河铁道之夜》。
你的名言："我们打磨镜片，本质上是在磨去人类与宇宙之间的那层雾。"
你的语气：温和、细腻、有工匠的执着。你关注波前校正、大气视宁度、衍射极限。你喜欢用比喻来解释复杂的工程概念。`,
  },
];

// ── 日记生成 ──
async function generateEntry(char, apiKey) {
  const today = new Date().toISOString().slice(0, 10);
  const dayOfWeek = ['日', '一', '二', '三', '四', '五', '六'][new Date().getDay()];
  const seasonCN = { spring: '春', summer: '夏', autumn: '秋', winter: '冬' }[SEASON];
  const objects = SEASONAL_OBJECTS[SEASON];
  const shuffled = [...objects].sort(() => Math.random() - 0.5);

  const systemPrompt = `${char.voice}

当前日期：${today}（星期${dayOfWeek}），${seasonCN}季。
当前季节适合观测的天体包括：${shuffled.slice(0, 4).join('、')} 等。

请以${char.name}的身份，用第一人称中文写今日的观测日记。要求：
- 长度 150–300 字
- 选择一个真实的天体或天象作为今日观测主题（优先从上面列出的天体中选择，也可自选）
- 如果角色有指定观测站，可提及该站点的设备和观测条件
- 风格严格遵循角色的写作风格
- 可以提及一个具体的科学细节（如频率、温度、红移值等）
- 结尾保持角色的标志性语气

请只输出以下 JSON 格式，不要加任何其他文字：
{"character":"${char.name}","character_id":"${char.id}","title":"${char.title}","station":"${char.station || ''}","astronomical_object":"","entry":"","mood":"","observation_id":"ICI-${today.replace(/-/g, '')}-${char.id.slice(0, 2).toUpperCase()}"}`;

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      max_tokens: 800,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `请以${char.name}的身份，写下今天的观测日记。直接输出 JSON。` },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API error ${response.status}: ${body.slice(0, 200)}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;

  // 清理可能的 markdown 代码块包裹
  const cleaned = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
  return JSON.parse(cleaned);
}

// ── 主流程 ──
async function main() {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    console.error('错误：未设置 DEEPSEEK_API_KEY 环境变量');
    process.exit(1);
  }

  console.log('使用 DeepSeek API 生成日记…');
  console.log(`日期: ${new Date().toISOString().slice(0, 10)}\n`);

  const entries = [];
  for (const char of CHARACTERS) {
    console.log(`正在生成 ${char.name} 的日记…`);
    try {
      const entry = await generateEntry(char, apiKey);
      entries.push(entry);
      console.log(`  ✓ ${char.name} — ${entry.astronomical_object}`);
      // 请求之间短暂延迟，避免速率限制
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.error(`  ✗ ${char.name} 失败:`, e.message);
    }
  }

  if (entries.length === 0) {
    console.error('所有日记生成失败。');
    process.exit(1);
  }

  // 写入输出文件
  const dateStr = new Date().toISOString().slice(0, 10);
  const diary = {
    date: dateStr,
    generated_at: new Date().toISOString(),
    provider: 'deepseek',
    entries,
  };

  // 1. 写入最新一日（首页用）
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(diary, null, 2), 'utf-8');
  console.log(`\n已写入首页日记 → ${OUTPUT}`);

  // 2. 写入历史档案 diaries/YYYY-MM-DD.json
  fs.mkdirSync(DIARIES_DIR, { recursive: true });
  const archivePath = path.join(DIARIES_DIR, `${dateStr}.json`);
  fs.writeFileSync(archivePath, JSON.stringify(diary, null, 2), 'utf-8');
  console.log(`已写入历史档案 → ${archivePath}`);

  // 3. 更新日期索引 index.json
  let index = { updated: new Date().toISOString(), dates: [] };
  if (fs.existsSync(INDEX_FILE)) {
    try {
      index = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));
    } catch (_) { /* 索引损坏则重建 */ }
  }
  index.dates = index.dates.filter(d => d.date !== dateStr);
  index.dates.push({
    date: dateStr,
    count: entries.length,
    characters: entries.map(e => ({ name: e.character, object: e.astronomical_object, mood: e.mood })),
  });
  index.dates.sort((a, b) => a.date.localeCompare(b.date));
  index.updated = new Date().toISOString();
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
  console.log(`已更新日期索引 → ${INDEX_FILE} (共 ${index.dates.length} 天)`);

  console.log(`\n完成！${entries.length}/${CHARACTERS.length} 篇日记已生成`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
