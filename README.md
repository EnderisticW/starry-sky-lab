# 星空研究所 · Starry Sky Lab

> *"我们不是在研究星星，我们是在研究自己从哪里来。"* — 陈星远 · 首任所长

[English version →](README.en.md)

一座虚构天文研究机构的线上驻地。3D 深空星场、信标星探索、全球观测站网络、角色观测日志、实时合成太空声景——点击星星，收集宇宙图鉴。

**在线访问：** [enderisticw.github.io/starry-sky-lab](https://enderisticw.github.io/starry-sky-lab/)

> 星空研究所、研究人员与观测站均为虚构设定。页面中涉及的天体、仪器及物理学概念以真实天文学知识为基础。每日观测日志由 AI 根据角色设定生成，不应视为真实科研记录。

---

## 体验

| 页面 | 描述 |
|---|---|
| **首页** | 纵览式叙事：主视觉 → NASA 今日宇宙 → 研究使命 → 三大通道 → 最新日志 |
| **观测台** | 10 颗脉冲光环信标星，点击推镜观测，显示光谱类型、距离、温度与研究笔记 |
| **日志档案** | 五位研究员的每日观测日志，按月历翻阅，支持 URL 日期永久链接 |
| **研究所** | 研究方向、五座观测站详情、核心团队档案（含履历与个人名言） |

### 细节

| 细节 | 描述 |
|---|---|
| **星空粒子** | 420 颗恒星 · 5 层深度视差 · 柔和周期闪烁 |
| **体积星云** | 噪声纹理 Sprite · 加法混合 · 随视点漂移 |
| **星座连线** | 亮星之间动态绘制 · 透明度随距离衰减 |
| **扫描线** | 每 6 秒一道青色扫描线划过屏幕，模拟观测仪器 CRT 质感 |
| **图鉴收集** | 左下角计数器「已发现 3 / 10」，全部集齐触发隐藏记录 |
| **动态页签** | 活跃时：「此刻，我们凝望深空」+ 浅色图标；离开时：「宇宙未眠 · 等你归来」+ 深色图标 |
| **声景** | Web Audio 实时合成：低频 drone + 宇宙微波背景噪声 + 粒子 ping |
| **无障碍** | 尊重系统「减少动态效果」设置 · 滚动触发动画自动降级 |

---

## 观测站设定

| 站名 | 位置 | 海拔 | 核心设备 | 专长 |
|---|---|---|---|---|
| **天枢站** | 中国 · 贵州 | 1,120 m | 500m 射电干涉阵列 | 脉冲星巡天 · 快速射电暴 |
| **天权站** | 中国 · 西藏阿里 | 5,100 m | 2.4m 光学/红外望远镜 | 广域时域巡天 · 暗物质透镜 |
| **南十字站** | 智利 · 阿塔卡马 | 5,050 m | 亚毫米波干涉阵 | 原行星盘化学 · 星系际介质 |
| **安第斯之眼** | 智利 · 帕穹山 | 2,720 m | 8.4m 大视场巡天望远镜 | 暗能量 · 时域天文 |
| **莫纳克亚站** | 美国 · 夏威夷 | 4,145 m | 10m 自适应光学望远镜 | 系外行星直接成像 · 黑洞视界 |

---

## 技术栈

| 层 | 技术 |
|---|---|
| 3D 渲染 | Three.js · 自定义 Canvas 纹理 · 粒子系统 |
| 构建 | Vite 6 · ES Modules · 多页面入口 |
| 声景 | Web Audio API · 实时合成 |
| 交互 | JavaScript · CSS · Intersection Observer |
| 内容 | NASA APOD API · DeepSeek API（角色日记生成） |
| 自动化 | GitHub Actions（每日日志生成 · NASA 缓存刷新 · Pages 部署） |
| 部署 | 纯静态文件 · GitHub Pages |

---

## 项目结构

```text
starry-sky-lab/
├── index.html                   # 首页
├── observatory.html             # 观测台
├── logs.html                    # 日志档案
├── institute.html               # 研究所
├── src/
│   ├── main.js                  # 页面初始化、全站星空与交互调度
│   ├── pageTemplates.js         # 四个页面的结构模板
│   ├── Starfield.js             # 星空粒子与信标系统
│   ├── Nebulae.js               # 体积星云渲染
│   ├── ConstellationLines.js    # 星座连线
│   ├── Telescope.js             # 观测台信标追踪与推镜
│   ├── StarCatalog.js           # 恒星目录数据
│   ├── Stations.js              # 五座观测站详情
│   ├── Diaries.js               # 日志日期导航与星历
│   ├── APOD.js                  # NASA 今日宇宙缓存展示
│   ├── AudioEngine.js           # Web Audio 声景引擎
│   └── style.css                # 全站视觉与响应式布局
├── public/
│   ├── assets/                  # 品牌标识与页签图标
│   └── data/                    # NASA 缓存、日志档案与索引
├── scripts/                     # 日记生成、APOD 刷新、构建后处理
└── .github/workflows/           # 日志 · NASA · Pages 自动化
```

---

## 本地运行

需要 [Node.js](https://nodejs.org/) 20+。

### Windows 快捷启动

双击 `启动星空研究所.cmd`。脚本会在首次运行时安装依赖、启动开发服务器并打开浏览器。关闭窗口或 `Ctrl+C` 即可停止。

### 命令行

```bash
npm install
npm run dev      # 启动 Vite 开发服务器
```

### 构建与预览

```bash
npm run build    # → dist/
npm run preview  # 预览生产构建
```

> 构建产物可直接部署到任意静态托管服务。

---

## 每日内容与自动化

### 观测日志

`.github/workflows/generate-diaries.yml` 每天 UTC 06:37 触发，调用 DeepSeek API 为五位研究人员生成当日观测日志。生成的文件包括：

- `public/data/diaries.json` — 当日最新日志，供首页预览
- `public/data/diaries/YYYY-MM-DD.json` — 按日期归档的历史记录
- `public/data/diaries/index.json` — 日期与人物摘要索引

在 GitHub Actions → **Generate Daily Observation Diaries → Run workflow** 中可手动触发，输入 `YYYY-MM-DD` 补写历史日志。需要配置 Secret：`DEEPSEEK_API_KEY`。

本地生成：

```powershell
$env:DEEPSEEK_API_KEY = "你的 API Key"
$env:DIARY_DATE = "2026-07-26"   # 可选，省略则使用当天 UTC
node scripts/generate-diaries.cjs
```

### NASA 今日宇宙

`.github/workflows/refresh-apod.yml` 每天 UTC 07:17 将 NASA Astronomy Picture of the Day 缓存到 `public/data/apod.json`。浏览器只读取此缓存，不会携带 API Key。需要配置 Secret：`NASA_API_KEY`。

本地刷新：双击 `刷新今日宇宙.cmd`，或在终端：

```powershell
$env:NASA_API_KEY = "你的 API Key"
npm run refresh:apod
```

### 部署

`.github/workflows/deploy.yml` 监听 `main` 分支——合并或推送后自动构建并部署到 GitHub Pages。功能分支上的改动不会影响线上。

---

## 致谢

本项目通过 [Claude Code](https://claude.ai/code)、[Codex](https://openai.com/index/introducing-codex/) 与 [DeepSeek](https://deepseek.com) AI 辅助开发完成。3D 渲染基于 [Three.js](https://threejs.org)。今日宇宙影像与说明来自 [NASA Astronomy Picture of the Day](https://apod.nasa.gov/apod/astropix.html)，版权归各数据标注作者所有。

所有观测站设定、恒星数据与人物介绍均为虚构——但其中涉及的物理学概念是真实的。

---

> "宇宙中最令人感动的，不是它的浩瀚与永恒，而是我们这颗微尘上的短暂意识，竟然能够理解它的法则。"
>
> —— 陈星远 · 星空研究所首任所长
