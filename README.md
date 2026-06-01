# 中国象棋

基于 React + TypeScript + SVG 的网页版中国象棋，支持双人对战和人机对战。

![预览](./src/assets/hero.png)

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建工具 | Vite 8 |
| 状态管理 | Zustand |
| 测试 | Vitest + jsdom + @testing-library/react |
| AI 引擎 | Minimax + Alpha-Beta 剪枝（Web Worker 异步计算） |
| 音效 | Web Audio API（合成音效 + HTMLAudioElement 背景音乐） |
| 部署 | Vercel / 任意静态托管 |

## 功能特性

- **双人对战（PvP）**：两位玩家在同一设备上轮流对弈
- **人机对战（PvE）**：三级 AI 难度（简单/中等/困难），AI 通过 Web Worker 计算不阻塞 UI
- **完整规则**：支持各棋子走法、将军检测、将死判定、长将限制、送将过滤
- **悔棋**：PvP 回退一步，PvE 同时回退用户步与 AI 步
- **音效**：选子、走子、吃子、将军、将死五种合成音效
- **背景音乐**：支持放入外部音频文件播放
- **响应式棋盘**：SVG 绘制，自适应屏幕大小

## 项目结构

```
├── public/
│   ├── favicon.svg
│   └── music/
│       └── README.md          # 背景音乐使用说明
├── src/
│   ├── components/
│   │   ├── Board.tsx          # 棋盘 SVG 渲染（网格、楚河汉界、士角、标记）
│   │   ├── Piece.tsx          # 棋子 SVG 渲染（阴影、外圈、文字、悬浮动画）
│   │   ├── GameInfo.tsx       # 游戏信息面板（回合、状态、步数）
│   │   └── Controls.tsx       # 控制面板（悔棋、重置、模式、难度、音效、音乐）
│   ├── engine/
│   │   ├── board.ts           # 棋盘初始化、克隆、边界检查
│   │   ├── rules/
│   │   │   ├── index.ts       # getValidMoves 分发器
│   │   │   ├── king.ts        # 将/帅走法
│   │   │   ├── advisor.ts     # 士/仕走法
│   │   │   ├── bishop.ts      # 象/相走法
│   │   │   ├── knight.ts      # 傌/馬走法
│   │   │   ├── rook.ts        # 俥/車走法
│   │   │   ├── cannon.ts      # 炮/砲走法
│   │   │   ├── pawn.ts        # 兵/卒走法
│   │   │   └── check.ts       # 将军/将死/照面检测
│   │   └── ai/
│   │       ├── evaluator.ts   # 局面评估函数（棋子价值 + 位置分）
│   │       ├── searcher.ts    # Minimax + Alpha-Beta 搜索
│   │       └── worker.ts      # Web Worker 入口
│   ├── store/
│   │   ├── gameStore.ts       # Zustand 游戏状态与逻辑
│   │   └── types.ts           # Store 类型定义
│   ├── hooks/
│   │   └── useAI.ts           # AI 触发 Hook（监听回合切换）
│   ├── utils/
│   │   ├── sound.ts           # 合成音效（选子/走子/吃子/将军/将死）
│   │   └── music.ts           # 背景音乐播放器
│   ├── types/
│   │   └── index.ts           # 全局类型（Piece、BoardState、Position 等）
│   ├── App.tsx                # 根组件（全屏布局 + AI Hook）
│   └── main.tsx               # 应用入口
├── tests/                     # 测试文件（与 src 一一对应）
│   ├── engine/
│   │   ├── board.test.ts
│   │   ├── rules/
│   │   │   ├── *.test.ts
│   │   └── ai/
│   │       ├── evaluator.test.ts
│   │       └── searcher.test.ts
│   └── store/
│       ├── gameStore.test.ts
│       └── undo.test.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── index.html
```

## 本地启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

开发服务器默认运行在 `http://localhost:5173/`。

## 构建

```bash
npm run build
```

构建产物输出到 `dist/` 目录，可直接部署到任何静态托管服务。

## 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 构建命令保持默认（`vite build`）
4. 输出目录保持默认（`dist`）

> **注意**：本项目是纯前端静态应用，无需配置后端或数据库。

## 测试

```bash
# 运行所有测试
npx vitest run

# 开发模式持续运行
npx vitest
```

当前共 33 个测试用例，覆盖棋盘初始化、各棋子走法、将军检测、AI 搜索、Store 状态流转、悔棋逻辑。

## 添加背景音乐

1. 准备一首喜欢的音频文件（建议轻柔氛围类）
2. 重命名为 `bg.mp3`，放入 `public/music/` 文件夹
3. 重新构建部署
4. 在游戏右侧面板点击「音乐」开关播放

更多说明见 `public/music/README.md`。

## 仓库地址

https://github.com/yyh321/chess
