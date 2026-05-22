# 星空研究所 · Starry Sky Lab

一个交互式 3D 深空探索体验。点击信标星，探索宇宙。

![screenshot](screenshot.png)

## 玩法

- **发现信标**：10 颗带脉冲光环的信标星散布在星空中
- **点击观测**：相机推进，显示恒星数据卡片（编号、光谱、距离、研究笔记）
- **收集图鉴**：左下角计数器追踪已发现 / 总数，全部发现后有彩蛋
- **音频氛围**：右下角音符按钮开启生成式太空声景

## 技术栈

| 层 | 技术 |
|------|------|
| 3D 渲染 | Three.js + 自定义 GLSL 着色器 |
| 星空 | 420 颗粒子，5 层深度，柔和闪烁 |
| 星云 | 噪声纹理 Sprite，加法混合 |
| 声景 | Web Audio API 实时生成（drone + 脉冲） |
| 构建 | Vite 6 |
| 部署 | GitHub Pages 静态托管 |

## 本地运行

```bash
npm install
npm run dev      # http://localhost:5173/starry-sky-lab/
```

## 构建

```bash
npm run build    # 输出到 dist/
npm run preview  # 预览构建产物
```
