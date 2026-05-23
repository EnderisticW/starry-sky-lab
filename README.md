# 星空研究所 · Starry Sky Lab

> *"我们不是在研究星星，我们是在研究自己从哪里来。"* — 陈星远 · 首任所长
>
> *"We are not studying the stars. We are studying where we came from."* — Chen Xingyuan, Founding Director

一个虚构天文研究机构的交互式主页 — 3D 深空星场、信标星探索、观测站网络、生成式太空声景。点击星星，收集宇宙图鉴。

An interactive homepage for a fictional cosmic research institute — 3D deep-space starfield, beacon star discovery, global observatory network, generative space soundscape. Click stars. Collect the cosmos.

---

## 体验 / Experience

| 模块 / Section | 中文 | English |
|---|---|---|
| **英雄区** / Hero | 3D 星空视差 + 标题文字淡入 | 3D starfield parallax + text fade-in |
| **信标星** / Beacons | 10 颗脉冲光环星，点击推镜观测，显示光谱 / 距离 / 研究笔记 | 10 pulsing-ring beacon stars, click to zoom & view spectral data |
| **图鉴收集** / Collection | 左下角计数器 "已发现 3 / 10"，全部集齐触发彩蛋 | Counter in bottom-left, Easter egg when all 10 found |
| **扫描线** / Scan Line | 每 6 秒一道青色扫描线划过屏幕，营造仪器感 | Teal scan line sweeps every 6s for instrument feel |
| **研究方向** / Research | 三张卡片：恒星演化、暗物质制图、系外大气光谱学 | 3 cards: stellar evolution, dark matter topology, exoplanet spectroscopy |
| **观测站网络** / Stations | SVG 世界地图 + 5 座虚构观测站，点击查看设备 / 焦点 / 笔记 | SVG world map + 5 fictional observatories with equipment, focus & notes |
| **核心团队** / Team | 5 位虚构科研人员，含履历与个人名言 | 5 fictional researchers with bios & personal quotes |
| **声景** / Soundscape | Web Audio 实时合成：低频 drone + 宇宙微波背景噪声 + 粒子 ping | Real-time Web Audio: low drone + CMB noise + particle pings |
| **语录** / Quote | 首任所长陈星远的名言 | Quote from founding director |

## 观测站设定 / Station Lore

| 站名 | 位置 | 海拔 | 专长 |
|------|------|------|------|
| **天枢站** Tianshu Array | 中国 · 贵州 | 1,120 m | 500m 射电干涉阵列 · 脉冲星巡天 |
| **天权站** Tianquan Observatory | 中国 · 西藏阿里 | 5,100 m | 2.4m 光学/红外 · 广域时域巡天 |
| **南十字站** Southern Cross Array | 智利 · 阿塔卡马 | 5,050 m | 亚毫米波干涉阵 · 原行星盘化学 |
| **安第斯之眼** Andes Eye | 智利 · 帕穹山 | 2,720 m | 8.4m 大视场巡天 · 暗能量 |
| **莫纳克亚站** Mauna Kea Station | 美国 · 夏威夷 | 4,145 m | 10m 自适应光学 · 系外行星直接成像 |

## 技术栈 / Tech Stack

| 层 / Layer | 技术 / Tech |
|------------|-------------|
| 3D 渲染 | Three.js + 自定义 GLSL 着色器 / Custom GLSL shaders |
| 星空粒子 | 420 颗 · 5 层深度 · 柔和周期闪烁 / 420 stars · 5 depth layers · soft twinkle |
| 体积星云 | 噪声纹理 Sprite · 加法混合 / Noise-texture sprites · additive blending |
| 工具函数 | Vite 6 · ES Modules |
| 声景 | Web Audio API · 实时合成 / real-time synthesis |
| 部署 | 纯静态文件，GitHub Pages 一键部署 / Static files, one-click GitHub Pages |

## 本地运行 / Run Locally

```bash
npm install
npm run dev      # → http://localhost:5173/starry-sky-lab/
```

## 构建 / Build

```bash
npm run build    # → dist/
npm run preview  # 预览构建产物 / preview built output
```

> 构建产物在 `dist/` 目录，可直接部署到任意静态托管服务。
> Built output in `dist/` is deployable to any static hosting.

## 作者 / Author

Made with [Claude Code](https://claude.ai/code) and Three.js. All observatory data, star catalogs, and team bios are fictional — but the physics references are real.
