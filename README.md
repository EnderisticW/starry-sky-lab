# 星空研究所

<p align="center">
  <img src="public/assets/brand-mark-nav.png" width="128" alt="星空研究所标志">
</p>

<p align="center">
  <em>把不可见之物，带入人类的视野。</em>
</p>

一个以虚构天文研究机构为背景的沉浸式多页面网站。项目将实时渲染的 3D 星空、交互式深空观测、NASA 每日天文图像与 AI 角色日志组织成一套完整的研究所叙事体验。

**在线访问：** [https://enderisticw.github.io/starry-sky-lab/](https://enderisticw.github.io/starry-sky-lab/)

> 星空研究所、研究人员与观测站均为虚构设定；页面涉及的天体、仪器及物理学概念以真实天文学知识为基础。每日观测日志由 AI 根据角色设定生成，不应视为真实科研记录。

## 页面结构

| 页面 | 作用 |
| --- | --- |
| **首页** | 以整屏滚动叙事串联研究所主视觉、NASA 今日宇宙、研究使命、页面入口与最新日志 |
| **观测台** | 网站唯一的信标收集区域，可发现 10 颗信标星并查看光谱、距离和观测笔记 |
| **日志档案** | 按日期浏览五位研究人员的观测日志，支持前后切换、月历选择及带日期的页面链接 |
| **研究所** | 展示研究方向、五座虚构观测站、全球观测网络与核心团队档案 |

## 主要特性

- **全站动态星空**：基于 Three.js 的多层粒子星场、星云和星座连线会随鼠标产生柔和视差。
- **沉浸式首页翻页**：桌面端滚轮触发缓慢、平滑的整屏过渡；移动端保留自然滚动体验。
- **独立深空观测台**：信标发现、推镜观测和图鉴计数集中在观测台，避免与首页叙事混杂。
- **日志星历管理**：历史日志按日期归档，月历只高亮有记录的日期，并同步 `?date=YYYY-MM-DD` 地址参数。
- **NASA APOD 缓存**：浏览器读取仓库内的本地缓存，避免直接暴露 API Key，并降低 NASA 服务暂时不可用造成的影响。
- **自动内容更新**：GitHub Actions 每日生成角色日志，并刷新 NASA 今日宇宙缓存。
- **生成式宇宙声景**：Web Audio API 实时合成低频环境音、背景噪声和粒子提示音。
- **动态页签状态**：浏览页面时显示浅色图标与“此刻，我们凝望深空”；离开时切换为深色图标与“宇宙未眠 · 等你归来”。
- **多端适配与无障碍降级**：针对窄屏布局进行适配，并尊重系统的“减少动态效果”设置。

## 本地运行

需要安装 [Node.js](https://nodejs.org/) 20 或更高版本。

### Windows 快捷启动

双击项目根目录中的 `启动星空研究所.cmd`。脚本会在首次运行时安装依赖、启动本地开发服务器，并自动打开浏览器。

关闭命令窗口或在窗口中按 `Ctrl+C` 即可停止服务。

### 使用命令行

```bash
npm install
npm run dev
```

开发服务器启动后，终端会显示本地访问地址。

### 构建与预览

```bash
npm run build
npm run preview
```

生产构建输出到 `dist/`。构建过程会同时生成首页、观测台、日志档案和研究所四个入口页面，并复制静态数据文件。

## 可用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | 构建多页面生产版本，并执行构建后数据整理 |
| `npm run preview` | 在本地预览生产构建 |
| `npm run refresh:apod` | 使用 NASA API 刷新本地 APOD 缓存 |

## 每日内容与自动化

### 观测日志

`.github/workflows/generate-diaries.yml` 每天在 UTC 06:37 触发，调用 DeepSeek API，为五位研究人员生成当日观测日志。工作流会更新：

- `public/data/diaries.json`：当前最新日志，供首页预览使用；
- `public/data/diaries/YYYY-MM-DD.json`：按日期保存的历史档案；
- `public/data/diaries/index.json`：日志日期与人物摘要索引。

在 GitHub 的 **Actions → Generate Daily Observation Diaries → Run workflow** 中，可以留空日期生成当天日志，也可以输入 `YYYY-MM-DD` 补写历史记录。补写早于最新记录的日期时，只会增加历史档案，不会把首页的最新日志退回旧日期。

仓库需要配置以下 Actions Secret：

```text
DEEPSEEK_API_KEY
```

本地生成或补写日志时，可在 PowerShell 中运行：

```powershell
$env:DEEPSEEK_API_KEY = "你的 API Key"
$env:DIARY_DATE = "2026-07-26"
node scripts/generate-diaries.cjs
```

省略 `DIARY_DATE` 时使用当天的 UTC 日期。

### NASA 今日宇宙

`.github/workflows/refresh-apod.yml` 每天在 UTC 07:17 触发，将 NASA Astronomy Picture of the Day 数据保存到 `public/data/apod.json`。前端只读取该缓存，不会在用户浏览器中携带密钥访问 NASA API。

仓库需要配置：

```text
NASA_API_KEY
```

本地刷新可以运行：

```powershell
$env:NASA_API_KEY = "你的 API Key"
npm run refresh:apod
```

也可以双击 `刷新今日宇宙.cmd`。若没有配置 `NASA_API_KEY` 且仓库中已有缓存，脚本会保留现有内容，不会破坏可用数据。

## 部署

`.github/workflows/deploy.yml` 监听 `main` 分支。每次有提交进入 `main` 后，GitHub Actions 会自动完成以下流程：

1. 安装依赖；
2. 执行 `npm run build`；
3. 上传 `dist/`；
4. 部署到 GitHub Pages。

因此，功能分支上的改动不会直接影响线上页面；只有合并或推送到 `main` 后才会触发正式部署。

## 技术栈

| 范围 | 技术 |
| --- | --- |
| 构建与模块 | Vite 6、ES Modules |
| 3D 渲染 | Three.js、自定义 Canvas 纹理与粒子系统 |
| 交互与界面 | 原生 JavaScript、CSS、Intersection Observer |
| 音频 | Web Audio API |
| 内容服务 | NASA APOD API、DeepSeek API |
| 自动化与部署 | GitHub Actions、GitHub Pages |

## 项目结构

```text
starry-sky-lab/
├─ index.html                   # 首页入口
├─ observatory.html             # 观测台入口
├─ logs.html                    # 日志档案入口
├─ institute.html               # 研究所入口
├─ src/
│  ├─ main.js                   # 页面初始化、全站星空与交互调度
│  ├─ pageTemplates.js          # 四个页面的结构模板
│  ├─ Starfield.js              # 星空与信标系统
│  ├─ Telescope.js              # 观测台交互
│  ├─ Diaries.js                # 日志日期管理
│  ├─ APOD.js                   # NASA 缓存展示
│  └─ style.css                 # 全站视觉与响应式布局
├─ public/
│  ├─ assets/                   # 品牌标识与页签图标
│  └─ data/                     # NASA 缓存与日志档案
├─ scripts/                     # 数据生成、刷新及构建后脚本
└─ .github/workflows/           # 日志、NASA 与 Pages 自动化
```

## 数据来源与致谢

- 3D 渲染由 [Three.js](https://threejs.org/) 提供。
- 今日宇宙图像和说明来自 [NASA Astronomy Picture of the Day](https://apod.nasa.gov/apod/astropix.html)，具体版权归每条数据标注的作者所有。
- 角色观测日志由 DeepSeek API 根据虚构人物设定生成。
- 项目在 Claude Code 与 Codex 的协作辅助下持续设计和开发。

> “我们不是在研究星星，我们是在研究自己从哪里来。”
>
> —— 陈星远 · 星空研究所首任所长
