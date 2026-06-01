# 网页版中国象棋游戏设计文档

## 1. 项目概述

开发一个基于 React + TypeScript + SVG 的网页版中国象棋游戏，支持单机双人对战和人机对战，架构上预留在线对战扩展能力。

## 2. 技术栈

| 层级 | 技术 | 用途 |
|------|------|------|
| 框架 | React 18 + TypeScript | UI 组件与状态绑定 |
| 构建 | Vite | 开发服务器与生产打包 |
| 状态管理 | Zustand | 轻量全局状态管理 |
| 渲染 | SVG | 棋盘与棋子矢量绘制 |
| 样式 | CSS Modules | 组件级样式隔离 |
| 测试 | Vitest + React Testing Library | 单元测试与组件测试 |
| AI 计算 | Web Worker | 将搜索计算移出主线程 |

## 3. 架构设计（状态驱动）

```
┌──────────────────────────────────────────┐
│            React + SVG UI                │  ← 订阅状态，纯展示
├──────────────────────────────────────────┤
│           Zustand Store                  │  ← 单一状态源
│  ├─ Game State（棋盘、回合、历史记录）   │
│  └─ Actions（移动、悔棋、重置）          │
├──────────────────────────────────────────┤
│  MoveEngine │  AIManager │  HistoryMgr   │  ← 纯逻辑模块，无 React 依赖
└──────────────────────────────────────────┘
```

### 架构决策
- **游戏逻辑与渲染解耦**：`engine/` 目录下不引入任何 React 依赖，保证可独立测试
- **状态集中管理**：Zustand Store 作为唯一数据源，UI 通过订阅自动更新
- **预留在线扩展**：后期只需新增 NetworkAdapter 将远程消息转为 Store Actions

## 4. 项目结构

```
chinese-chess/
├── public/
│   └── assets/              # 棋子音效等静态资源
├── src/
│   ├── components/          # React 组件
│   │   ├── Board/           # SVG 棋盘
│   │   ├── Piece/           # 棋子组件
│   │   ├── GameInfo/        # 对局信息（回合、计时）
│   │   └── Controls/        # 控制按钮（悔棋、重置）
│   ├── store/               # Zustand 状态管理
│   │   ├── gameStore.ts     # 主状态与 Actions
│   │   └── types.ts         # 状态类型定义
│   ├── engine/              # 纯逻辑层（无 React 依赖）
│   │   ├── rules/           # 走法规则引擎
│   │   ├── ai/              # AI 策略
│   │   │   ├── evaluator.ts # 局面评估函数
│   │   │   ├── searcher.ts  # minimax + alpha-beta
│   │   │   └── worker.ts    # Web Worker 入口
│   │   └── history.ts       # 棋谱记录（悔棋/复盘）
│   ├── types/               # 全局类型定义
│   ├── utils/               # 工具函数
│   ├── App.tsx
│   └── main.tsx
├── docs/
│   ├── dev-guide.md         # 开发规范
│   └── api-spec.md          # 模块接口文档
├── tests/
└── package.json
```

## 5. 数据模型

### 坐标系
采用标准记谱坐标：横向 `0-8`（九列），纵向 `0-9`（十行）。红方在下（y=0 到 4），黑方在上（y=5 到 9）。

```typescript
type Position = [x: number, y: number]; // [0-8, 0-9]

interface Piece {
  id: string;           // 唯一标识，如 "r_king"
  type: PieceType;      // 帅/将/士/象/马/车/炮/兵
  side: 'red' | 'black';
  position: Position;
}

type BoardState = (Piece | null)[][];
```

### Zustand Store

```typescript
interface GameState {
  board: BoardState;
  currentTurn: 'red' | 'black';
  selectedPiece: Piece | null;
  validMoves: Position[];
  gameStatus: 'idle' | 'playing' | 'check' | 'checkmate' | 'stalemate';
  moveHistory: MoveRecord[];
  mode: 'pvp' | 'pve';
  playerSide: 'red' | 'black';
  aiLevel: 1 | 2 | 3;

  selectPiece: (pos: Position) => void;
  movePiece: (from: Position, to: Position) => void;
  undoMove: () => void;
  resetGame: () => void;
}
```

### 设计决策
- **不可变更新**：每次移动生成新 `BoardState`，便于历史记录和调试
- **合法落点预计算**：选中棋子时立即计算 `validMoves`，UI 高亮并二次校验
- **将军检测**：每次移动后扫描对方是否被将军，更新 `gameStatus`

## 6. 走法规则引擎

纯函数设计，位于 `engine/rules/`：

```typescript
function getValidMoves(board: BoardState, piece: Piece): Position[];
function getKingMoves(...): Position[];
function getAdvisorMoves(...): Position[];
function getBishopMoves(...): Position[];
function getKnightMoves(...): Position[];   // 蹩马腿
function getRookMoves(...): Position[];     // 堵路
function getCannonMoves(...): Position[];   // 隔子
function getPawnMoves(...): Position[];     // 过河规则
```

### 特殊校验
- `isKingFacing(board)`：将帅不能照面
- `isPositionUnderAttack(board, pos, side)`：检测某位置是否被攻击
- `wouldCauseSelfCheck(board, move)`：排除自杀走法

## 7. AI 策略

### 算法
- **Minimax + Alpha-Beta 剪枝 + 局面评估**
- 运行在 Web Worker 中，异步返回最佳着法

### 难度分级

| 等级 | 搜索深度 | 预计用时 |
|------|----------|----------|
| 简单 | 2 层 | < 100ms |
| 中等 | 3 层 | < 500ms |
| 困难 | 4 层 | 1-3s |

### 评估函数要素
- 子力价值（车 > 马/炮 > 兵 > 士/象）
- 位置分（兵过河、马在中心加分）
- 灵活性（可移动格子数）
- 将军/被将军状态（大幅加权）

## 8. 开发里程碑

### 阶段一：基础骨架（第 1-2 天）
1. Vite + React + TS + Zustand 项目初始化
2. SVG 棋盘绘制（九宫格、楚河汉界）
3. SVG 棋子绘制（圆形 + 文字）
4. 点击交互（选子、落子，无规则校验）

**验收标准**：能看到完整棋盘和32个棋子，能点击选子和随意移动。

### 阶段二：规则引擎（第 3-4 天）
1. 各棋子走法实现
2. 将军/将死检测
3. 特殊规则（照面、长将）
4. 核心规则单元测试

**验收标准**：无法走违规步，将军时有提示，将死时游戏结束。

### 阶段三：人机对战（第 5-6 天）
1. 局面评估函数
2. Minimax + Alpha-Beta 搜索
3. Web Worker 集成
4. 三档难度

**验收标准**：能与电脑完整对弈，三种难度有明显差异。

### 阶段四：体验优化（第 7 天）
1. 落点提示、移动动画
2. 悔棋功能
3. 音效
4. 移动端响应式适配

### 阶段五：在线对战预留（架构就绪）
- 状态管理已抽象为 Actions，后期增加网络同步层即可

## 9. 规范文档

### 代码规范
- 组件 PascalCase（`GameBoard.tsx`），函数/变量 camelCase，常量 UPPER_SNAKE_CASE
- 优先 `interface` 描述对象，`type` 用于联合类型；禁用 `any`
- 函数组件 + Hooks，无类组件；单组件不超过 150 行
- `engine/` 下不引入任何 React 依赖

### 测试规范
- 规则引擎：每棋子至少 3 个测试用例
- AI：评估函数结果可复现
- 组件：渲染、交互、结束场景覆盖

### Git 规范
- `feat:` 新功能
- `fix:` 修复
- `test:` 测试
- `docs:` 文档

### 文档清单
- `docs/dev-guide.md` — 开发调试命令
- `docs/api-spec.md` — 模块接口定义
- `docs/ai-design.md` — AI 权重与算法说明
