# Starry Sky Lab · 星空研究所

> *"We are not studying the stars. We are studying where we came from."* — Chen Xingyuan, Founding Director

[← 中文版本](README.md)

The online home of a fictional cosmic research institute. 3D deep-space starfield, beacon star discovery, global observatory network, character observation diaries, real-time soundscape synthesis. Click stars. Collect the cosmos.

**Live site:** [enderisticw.github.io/starry-sky-lab](https://enderisticw.github.io/starry-sky-lab/)

> The Institute, its researchers, and observatories are fictional. Astronomical objects, instruments, and physics concepts referenced on the site are grounded in real science. Daily observation diaries are AI-generated from character profiles and should not be read as actual research records.

---

## Experience

| Page | Description |
|---|---|
| **Home** | Vertical scroll narrative: opening vista → NASA APOD → research mission → three portals → latest field note |
| **Observatory** | 10 pulsing-ring beacon stars; click to zoom in, view spectral type, distance, temperature & research notes |
| **Log Archive** | Daily observation diaries from five researchers, browsable by calendar month, with date-based permalinks |
| **Institute** | Research programmes, five observatory stations, core team profiles with bios & personal quotes |

### Details

| Detail | Description |
|---|---|
| **Starfield** | 420 stars · 5 depth layers · soft periodic twinkle |
| **Nebulae** | Noise-texture sprites · additive blending · parallax drift |
| **Constellations** | Dynamic lines drawn between bright stars · opacity fades with distance |
| **Scan Line** | Teal scan line sweeps every 6 seconds — CRT instrument aesthetic |
| **Collection** | Bottom-left counter "Discovered 3 / 10"; a hidden record unlocks when all 10 are found |
| **Tab State** | Active tab: light icon + "此刻，我们凝望深空"; inactive: dark icon + "宇宙未眠 · 等你归来" |
| **Soundscape** | Real-time Web Audio synthesis: low drone + CMB noise + particle pings |
| **Accessibility** | Respects `prefers-reduced-motion` · scroll-triggered animations degrade gracefully |

---

## Station Lore

| Station | Location | Altitude | Core Equipment | Specialty |
|---|---|---|---|---|
| **Tianshu Array** 天枢站 | Guizhou, China | 1,120 m | 500m radio interferometer array | Pulsar survey · Fast radio bursts |
| **Tianquan Observatory** 天权站 | Tibet, China | 5,100 m | 2.4m optical/IR telescope | Wide-field time-domain survey · dark matter lensing |
| **Southern Cross Array** 南十字站 | Atacama, Chile | 5,050 m | Submillimeter interferometer array | Protoplanetary disk chemistry · IGM |
| **Andes Eye** 安第斯之眼 | Pachón, Chile | 2,720 m | 8.4m wide-field survey telescope | Dark energy · time-domain astronomy |
| **Mauna Kea Station** 莫纳克亚站 | Hawaiʻi, USA | 4,145 m | 10m adaptive optics telescope | Exoplanet direct imaging · black hole horizons |

---

## Tech Stack

| Layer | Technology |
|---|---|
| 3D Rendering | Three.js · custom Canvas textures · particle systems |
| Build | Vite 6 · ES Modules · multi-page entry points |
| Soundscape | Web Audio API · real-time synthesis |
| Interaction | Vanilla JavaScript · CSS · Intersection Observer |
| Content | NASA APOD API · DeepSeek API (character diary generation) |
| Automation | GitHub Actions (daily diary generation · NASA cache refresh · Pages deploy) |
| Deployment | Static files · GitHub Pages |

---

## Project Structure

```text
starry-sky-lab/
├── index.html                   # Home entry
├── observatory.html             # Observatory entry
├── logs.html                    # Log archive entry
├── institute.html               # Institute entry
├── src/
│   ├── main.js                  # Page init, site-wide starfield & interaction orchestration
│   ├── pageTemplates.js         # Structural templates for all four pages
│   ├── Starfield.js             # Star particle system & beacon system
│   ├── Nebulae.js               # Volumetric nebula rendering
│   ├── ConstellationLines.js    # Constellation line drawing
│   ├── Telescope.js             # Observatory beacon tracking & zoom
│   ├── StarCatalog.js           # Star catalog data
│   ├── Stations.js              # Five observatory station details
│   ├── Diaries.js               # Diary date navigation & almanac
│   ├── APOD.js                  # NASA APOD cache display
│   ├── AudioEngine.js           # Web Audio soundscape engine
│   └── style.css                # Site-wide visual design & responsive layout
├── public/
│   ├── assets/                  # Brand marks & favicon assets
│   └── data/                    # NASA cache, diary archives & index
├── scripts/                     # Diary generation, APOD refresh, post-build
└── .github/workflows/           # Diaries · NASA · Pages automation
```

---

## Run Locally

Requires [Node.js](https://nodejs.org/) 20+.

### Windows Quick Start

Double-click `启动星空研究所.cmd`. The script installs dependencies on first run, starts the dev server, and opens the browser. Close the window or press `Ctrl+C` to stop.

### Command Line

```bash
npm install
npm run dev      # Starts Vite dev server
```

### Build & Preview

```bash
npm run build    # → dist/
npm run preview  # Preview production build
```

> Built output in `dist/` is deployable to any static hosting.

---

## Daily Content & Automation

### Observation Diaries

`.github/workflows/generate-diaries.yml` triggers daily at 06:37 UTC, calling the DeepSeek API to generate observation diaries for all five researchers. Output files:

- `public/data/diaries.json` — latest diary, shown on the home page preview
- `public/data/diaries/YYYY-MM-DD.json` — date-archived historical records
- `public/data/diaries/index.json` — date and character summary index

Manual trigger: GitHub Actions → **Generate Daily Observation Diaries → Run workflow**, enter a `YYYY-MM-DD` date to backfill. Requires secret: `DEEPSEEK_API_KEY`.

Local generation:

```powershell
$env:DEEPSEEK_API_KEY = "your API key"
$env:DIARY_DATE = "2026-07-26"   # optional; defaults to today's UTC date
node scripts/generate-diaries.cjs
```

### NASA APOD

`.github/workflows/refresh-apod.yml` triggers daily at 07:17 UTC, caching the NASA Astronomy Picture of the Day to `public/data/apod.json`. The browser only reads this cache — no API key is ever exposed to clients. Requires secret: `NASA_API_KEY`.

Local refresh: double-click `刷新今日宇宙.cmd`, or in a terminal:

```powershell
$env:NASA_API_KEY = "your API key"
npm run refresh:apod
```

### Deploy

`.github/workflows/deploy.yml` watches the `main` branch — any merge or push triggers an automatic build and deploy to GitHub Pages. Changes on feature branches won't affect the live site.

---

## Acknowledgments

This project was built with AI assistance from [Claude Code](https://claude.ai/code), [Codex](https://openai.com/index/introducing-codex/), and [DeepSeek](https://deepseek.com). 3D rendering powered by [Three.js](https://threejs.org). APOD imagery and captions courtesy of [NASA Astronomy Picture of the Day](https://apod.nasa.gov/apod/astropix.html), with copyright belonging to credited authors.

All observatory lore, star catalogs, and team bios are fictional — but the physics references are real.

---

> "The most moving thing about the cosmos is not its vastness or its eternity — but that this brief consciousness on a speck of dust can, against all odds, comprehend its laws."
>
> — Chen Xingyuan, Founding Director of the Institute for Cosmic Inquiry
