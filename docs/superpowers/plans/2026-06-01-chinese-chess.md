# 中国象棋游戏 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现一个基于 React + TypeScript + SVG 的中国象棋游戏，支持双人对战和人机对战。

**Architecture:** 状态驱动架构，Zustand 管理全局状态，engine/ 目录下放纯逻辑（规则、AI），React + SVG 负责渲染。

**Tech Stack:** React 18, TypeScript, Vite, Zustand, SVG, Vitest, Web Worker

---

## 文件结构总览

| 文件 | 职责 |
|------|------|
| `src/types/index.ts` | 全局类型（Piece, Position, BoardState 等） |
| `src/engine/board.ts` | 棋盘初始化、深拷贝、坐标工具 |
| `src/engine/rules/index.ts` | 走法规则统一入口 |
| `src/engine/rules/king.ts` | 将/帅走法 |
| `src/engine/rules/advisor.ts` | 士/仕走法 |
| `src/engine/rules/bishop.ts` | 象/相走法 |
| `src/engine/rules/knight.ts` | 马走法（含蹩马腿） |
| `src/engine/rules/rook.ts` | 车走法 |
| `src/engine/rules/cannon.ts` | 炮走法 |
| `src/engine/rules/pawn.ts` | 兵/卒走法 |
| `src/engine/rules/check.ts` | 将军/将死检测 |
| `src/engine/ai/evaluator.ts` | 局面评估函数 |
| `src/engine/ai/searcher.ts` | Minimax + Alpha-Beta |
| `src/engine/ai/worker.ts` | Web Worker 入口 |
| `src/store/types.ts` | Zustand 状态类型 |
| `src/store/gameStore.ts` | Zustand Store 实现 |
| `src/components/Board.tsx` | SVG 棋盘 |
| `src/components/Piece.tsx` | SVG 棋子 |
| `src/components/GameInfo.tsx` | 对局信息面板 |
| `src/components/Controls.tsx` | 控制按钮 |
| `src/App.tsx` | 根组件 |
| `tests/engine/rules/*.test.ts` | 规则引擎单元测试 |

---

### Task 1: 项目初始化

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- Create: `src/main.tsx`, `src/App.tsx`
- Create: `vitest.config.ts`

- [ ] **Step 1: 使用 Vite 创建 React + TS 项目**

Run:
```bash
npm create vite@latest . -- --template react-ts
npm install
npm install zustand
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 2: 配置 Vitest**

Create: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

- [ ] **Step 3: 验证项目能启动**

Run: `npm run dev`
Expected: Vite 启动成功，打开 http://localhost:5173 看到默认 React 页面。

- [ ] **Step 4: 验证测试能运行**

Run: `npx vitest run`
Expected: 无测试但命令成功退出。

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: 初始化 Vite + React + TS 项目，安装 Zustand 和 Vitest"
```

---

### Task 2: 全局类型定义

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: 编写类型定义**

Create: `src/types/index.ts`

```typescript
export type Side = 'red' | 'black';
export type Position = [number, number];

export type PieceType =
  | 'king'
  | 'advisor'
  | 'bishop'
  | 'knight'
  | 'rook'
  | 'cannon'
  | 'pawn';

export interface Piece {
  id: string;
  type: PieceType;
  side: Side;
  position: Position;
}

export type BoardState = (Piece | null)[][];

export interface MoveRecord {
  piece: Piece;
  from: Position;
  to: Position;
  captured: Piece | null;
  prevStatus: GameStatus;
}

export type GameMode = 'pvp' | 'pve';
export type GameStatus = 'idle' | 'playing' | 'check' | 'checkmate' | 'stalemate';
export type AILevel = 1 | 2 | 3;
```

- [ ] **Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: 添加全局类型定义"
```

---

### Task 3: 棋盘工具函数

**Files:**
- Create: `src/engine/board.ts`
- Create: `tests/engine/board.test.ts`

- [ ] **Step 1: 写测试 — 棋盘初始化**

Create: `tests/engine/board.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { createInitialBoard, inBounds, cloneBoard } from '../../src/engine/board';

describe('board', () => {
  it('createInitialBoard should return 10x9 board', () => {
    const board = createInitialBoard();
    expect(board.length).toBe(10);
    expect(board[0].length).toBe(9);
  });

  it('createInitialBoard should place red king at [4, 0]', () => {
    const board = createInitialBoard();
    const king = board[0][4];
    expect(king).not.toBeNull();
    expect(king!.type).toBe('king');
    expect(king!.side).toBe('red');
  });

  it('inBounds should validate coordinates', () => {
    expect(inBounds([0, 0])).toBe(true);
    expect(inBounds([8, 9])).toBe(true);
    expect(inBounds([9, 0])).toBe(false);
    expect(inBounds([0, 10])).toBe(false);
    expect(inBounds([-1, 0])).toBe(false);
  });

  it('cloneBoard should create deep copy', () => {
    const board = createInitialBoard();
    const copy = cloneBoard(board);
    expect(copy).not.toBe(board);
    expect(copy[0][0]).not.toBe(board[0][0]);
    expect(copy[0][0]!.id).toBe(board[0][0]!.id);
  });
});
```

Run: `npx vitest run tests/engine/board.test.ts`
Expected: FAIL，函数未定义。

- [ ] **Step 2: 实现棋盘工具函数**

Create: `src/engine/board.ts`

```typescript
import type { BoardState, Piece, Position, Side } from '../types';

export function createInitialBoard(): BoardState {
  const board: BoardState = Array.from({ length: 10 }, () => Array(9).fill(null));

  const setup = (y: number, side: Side) => {
    const s = side === 'red' ? 'r' : 'b';
    const pieces: [number, PieceType][] = [
      [0, 'rook'], [1, 'knight'], [2, 'bishop'], [3, 'advisor'],
      [4, 'king'], [5, 'advisor'], [6, 'bishop'], [7, 'knight'], [8, 'rook'],
    ];
    pieces.forEach(([x, type]) => {
      board[y][x] = { id: `${s}_${type}_${x}`, type, side, position: [x, y] };
    });
    board[y === 0 ? 2 : 7][1] = { id: `${s}_cannon_1`, type: 'cannon', side, position: [1, y === 0 ? 2 : 7] };
    board[y === 0 ? 2 : 7][7] = { id: `${s}_cannon_7`, type: 'cannon', side, position: [7, y === 0 ? 2 : 7] };
    for (let x = 0; x < 9; x += 2) {
      const py = y === 0 ? 3 : 6;
      board[py][x] = { id: `${s}_pawn_${x}`, type: 'pawn', side, position: [x, py] };
    }
  };

  setup(0, 'red');
  setup(9, 'black');
  return board;
}

export function inBounds(pos: Position): boolean {
  const [x, y] = pos;
  return x >= 0 && x <= 8 && y >= 0 && y <= 9;
}

export function cloneBoard(board: BoardState): BoardState {
  return board.map(row =>
    row.map(piece => (piece ? { ...piece, position: [...piece.position] } : null))
  );
}

export function getPiece(board: BoardState, pos: Position): Piece | null {
  const [x, y] = pos;
  return board[y][x];
}

export function setPiece(board: BoardState, pos: Position, piece: Piece | null): void {
  const [x, y] = pos;
  board[y][x] = piece ? { ...piece, position: [x, y] } : null;
}
```

Run: `npx vitest run tests/engine/board.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/engine/board.ts tests/engine/board.test.ts
git commit -m "feat: 实现棋盘初始化与工具函数，含单元测试"
```

---

### Task 4: 车的走法规则

**Files:**
- Create: `src/engine/rules/rook.ts`
- Create: `tests/engine/rules/rook.test.ts`

- [ ] **Step 1: 写测试**

Create: `tests/engine/rules/rook.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { getRookMoves } from '../../../src/engine/rules/rook';
import { createInitialBoard, cloneBoard } from '../../../src/engine/board';

describe('rook moves', () => {
  it('should move horizontally and vertically', () => {
    const board = createInitialBoard();
    // Red rook at [0, 0], clear the pawn in front
    board[3][0] = null;
    const rook = board[0][0]!;
    const moves = getRookMoves(board, rook);
    expect(moves.some(m => m[0] === 0 && m[1] === 3)).toBe(true);
    expect(moves.some(m => m[0] === 1 && m[1] === 0)).toBe(true);
  });

  it('should be blocked by own piece', () => {
    const board = createInitialBoard();
    const rook = board[0][0]!;
    const moves = getRookMoves(board, rook);
    expect(moves.some(m => m[0] === 0 && m[1] === 1)).toBe(false);
  });

  it('should capture enemy piece and stop beyond', () => {
    const board = createInitialBoard();
    board[3][0] = null;
    const rook = board[0][0]!;
    const moves = getRookMoves(board, rook);
    expect(moves.some(m => m[0] === 0 && m[1] === 6)).toBe(true);
    expect(moves.some(m => m[0] === 0 && m[1] === 7)).toBe(false);
  });
});
```

Run: `npx vitest run tests/engine/rules/rook.test.ts`
Expected: FAIL

- [ ] **Step 2: 实现车的走法**

Create: `src/engine/rules/rook.ts`

```typescript
import type { BoardState, Piece, Position } from '../../types';
import { inBounds } from '../board';

export function getRookMoves(board: BoardState, piece: Piece): Position[] {
  const [px, py] = piece.position;
  const moves: Position[] = [];
  const directions: Position[] = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  for (const [dx, dy] of directions) {
    let x = px + dx;
    let y = py + dy;
    while (inBounds([x, y])) {
      const target = board[y][x];
      if (!target) {
        moves.push([x, y]);
      } else {
        if (target.side !== piece.side) {
          moves.push([x, y]);
        }
        break;
      }
      x += dx;
      y += dy;
    }
  }
  return moves;
}
```

Run: `npx vitest run tests/engine/rules/rook.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/engine/rules/rook.ts tests/engine/rules/rook.test.ts
git commit -m "feat: 实现车的走法规则与测试"
```

---

### Task 5: 马的走法规则（含蹩马腿）

**Files:**
- Create: `src/engine/rules/knight.ts`
- Create: `tests/engine/rules/knight.test.ts`

- [ ] **Step 1: 写测试**

Create: `tests/engine/rules/knight.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { getKnightMoves } from '../../../src/engine/rules/knight';
import { createInitialBoard } from '../../../src/engine/board';

describe('knight moves', () => {
  it('should move in L-shape', () => {
    const board = createInitialBoard();
    board[3][1] = null; // clear pawn
    const knight = board[0][1]!;
    const moves = getKnightMoves(board, knight);
    expect(moves.some(m => m[0] === 0 && m[1] === 2)).toBe(true);
    expect(moves.some(m => m[0] === 2 && m[1] === 2)).toBe(true);
  });

  it('should be blocked by hobbling (蹩马腿)', () => {
    const board = createInitialBoard();
    const knight = board[0][1]!;
    const moves = getKnightMoves(board, knight);
    expect(moves.some(m => m[0] === 0 && m[1] === 2)).toBe(false);
    expect(moves.some(m => m[0] === 2 && m[1] === 2)).toBe(false);
  });

  it('should capture enemy but not own piece', () => {
    const board = createInitialBoard();
    board[3][0] = null;
    board[3][2] = null;
    const knight = board[0][1]!;
    const moves = getKnightMoves(board, knight);
    expect(moves.some(m => m[0] === 2 && m[1] === 2)).toBe(true);
  });
});
```

Run: `npx vitest run tests/engine/rules/knight.test.ts`
Expected: FAIL

- [ ] **Step 2: 实现马的走法**

Create: `src/engine/rules/knight.ts`

```typescript
import type { BoardState, Piece, Position } from '../../types';
import { inBounds } from '../board';

export function getKnightMoves(board: BoardState, piece: Piece): Position[] {
  const [px, py] = piece.position;
  const moves: Position[] = [];
  const deltas: [Position, Position][] = [
    [[0, 1], [1, 2]], [[0, 1], [-1, 2]],
    [[0, -1], [1, -2]], [[0, -1], [-1, -2]],
    [[1, 0], [2, 1]], [[1, 0], [2, -1]],
    [[-1, 0], [-2, 1]], [[-1, 0], [-2, -1]],
  ];

  for (const [[dx1, dy1], [dx2, dy2]] of deltas) {
    const blockX = px + dx1;
    const blockY = py + dy1;
    if (inBounds([blockX, blockY]) && !board[blockY][blockX]) {
      const x = px + dx2;
      const y = py + dy2;
      if (inBounds([x, y])) {
        const target = board[y][x];
        if (!target || target.side !== piece.side) {
          moves.push([x, y]);
        }
      }
    }
  }
  return moves;
}
```

Run: `npx vitest run tests/engine/rules/knight.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/engine/rules/knight.ts tests/engine/rules/knight.test.ts
git commit -m "feat: 实现马的走法规则（含蹩马腿）与测试"
```

---

### Task 6: 将/帅走法规则

**Files:**
- Create: `src/engine/rules/king.ts`
- Create: `tests/engine/rules/king.test.ts`

- [ ] **Step 1: 写测试**

Create: `tests/engine/rules/king.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { getKingMoves } from '../../../src/engine/rules/king';
import { createInitialBoard } from '../../../src/engine/board';

describe('king moves', () => {
  it('should stay within palace (九宫)', () => {
    const board = createInitialBoard();
    const king = board[0][4]!;
    const moves = getKingMoves(board, king);
    expect(moves.every(m => m[0] >= 3 && m[0] <= 5 && m[1] >= 0 && m[1] <= 2)).toBe(true);
  });

  it('should move one step orthogonally', () => {
    const board = createInitialBoard();
    // Move red king to center of palace
    board[0][4] = null;
    board[1][4] = { id: 'r_king', type: 'king', side: 'red', position: [4, 1] };
    const king = board[1][4]!;
    const moves = getKingMoves(board, king);
    expect(moves).toHaveLength(4);
    expect(moves.some(m => m[0] === 4 && m[1] === 0)).toBe(true);
    expect(moves.some(m => m[0] === 4 && m[1] === 2)).toBe(true);
    expect(moves.some(m => m[0] === 3 && m[1] === 1)).toBe(true);
    expect(moves.some(m => m[0] === 5 && m[1] === 1)).toBe(true);
  });
});
```

Run: `npx vitest run tests/engine/rules/king.test.ts`
Expected: FAIL

- [ ] **Step 2: 实现将/帅走法**

Create: `src/engine/rules/king.ts`

```typescript
import type { BoardState, Piece, Position } from '../../types';
import { inBounds } from '../board';

export function getKingMoves(board: BoardState, piece: Piece): Position[] {
  const [px, py] = piece.position;
  const moves: Position[] = [];
  const isRed = piece.side === 'red';
  const minX = 3, maxX = 5;
  const minY = isRed ? 0 : 7;
  const maxY = isRed ? 2 : 9;

  const directions: Position[] = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  for (const [dx, dy] of directions) {
    const x = px + dx;
    const y = py + dy;
    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
      const target = board[y][x];
      if (!target || target.side !== piece.side) {
        moves.push([x, y]);
      }
    }
  }
  return moves;
}
```

Run: `npx vitest run tests/engine/rules/king.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/engine/rules/king.ts tests/engine/rules/king.test.ts
git commit -m "feat: 实现将/帅走法规则与测试"
```

---

### Task 7: 士/仕、象/相、炮、兵走法规则

**Files:**
- Create: `src/engine/rules/advisor.ts`
- Create: `src/engine/rules/bishop.ts`
- Create: `src/engine/rules/cannon.ts`
- Create: `src/engine/rules/pawn.ts`
- Create: `tests/engine/rules/advisor.test.ts`
- Create: `tests/engine/rules/bishop.test.ts`
- Create: `tests/engine/rules/cannon.test.ts`
- Create: `tests/engine/rules/pawn.test.ts`

- [ ] **Step 1: 写测试**

Create: `tests/engine/rules/advisor.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { getAdvisorMoves } from '../../../src/engine/rules/advisor';
import { createInitialBoard } from '../../../src/engine/board';

describe('advisor moves', () => {
  it('should move diagonally one step in palace', () => {
    const board = createInitialBoard();
    const advisor = board[0][3]!;
    const moves = getAdvisorMoves(board, advisor);
    expect(moves).toHaveLength(1);
    expect(moves[0]).toEqual([4, 1]);
  });
});
```

Create: `tests/engine/rules/bishop.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { getBishopMoves } from '../../../src/engine/rules/bishop';
import { createInitialBoard } from '../../../src/engine/board';

describe('bishop moves', () => {
  it('should move diagonally two steps with eye (象眼)', () => {
    const board = createInitialBoard();
    board[3][0] = null;
    const bishop = board[0][2]!;
    const moves = getBishopMoves(board, bishop);
    expect(moves.some(m => m[0] === 0 && m[1] === 2)).toBe(false);
    expect(moves.some(m => m[0] === 4 && m[1] === 2)).toBe(true);
  });

  it('should be blocked if eye is occupied', () => {
    const board = createInitialBoard();
    const bishop = board[0][2]!;
    const moves = getBishopMoves(board, bishop);
    expect(moves).toHaveLength(0);
  });

  it('should not cross river', () => {
    const board = createInitialBoard();
    board[3][2] = { id: 'r_bishop_test', type: 'bishop', side: 'red', position: [2, 3] };
    const bishop = board[3][2]!;
    const moves = getBishopMoves(board, bishop);
    expect(moves.every(m => m[1] <= 4)).toBe(true);
  });
});
```

Create: `tests/engine/rules/cannon.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { getCannonMoves } from '../../../src/engine/rules/cannon';
import { createInitialBoard } from '../../../src/engine/board';

describe('cannon moves', () => {
  it('should move like rook when not capturing', () => {
    const board = createInitialBoard();
    board[3][1] = null;
    const cannon = board[2][1]!;
    const moves = getCannonMoves(board, cannon);
    expect(moves.some(m => m[0] === 1 && m[1] === 3)).toBe(true);
  });

  it('should capture by jumping exactly one piece', () => {
    const board = createInitialBoard();
    board[3][1] = null;
    const cannon = board[2][1]!;
    const moves = getCannonMoves(board, cannon);
    expect(moves.some(m => m[0] === 1 && m[1] === 7)).toBe(true);
    expect(moves.some(m => m[0] === 1 && m[1] === 8)).toBe(false);
  });
});
```

Create: `tests/engine/rules/pawn.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { getPawnMoves } from '../../../src/engine/rules/pawn';
import { createInitialBoard } from '../../../src/engine/board';

describe('pawn moves', () => {
  it('should move forward only before crossing river', () => {
    const board = createInitialBoard();
    const pawn = board[3][0]!;
    const moves = getPawnMoves(board, pawn);
    expect(moves).toHaveLength(1);
    expect(moves[0]).toEqual([0, 4]);
  });

  it('should move forward and sideways after crossing river', () => {
    const board = createInitialBoard();
    board[6][0] = { id: 'r_pawn_test', type: 'pawn', side: 'red', position: [0, 6] };
    const pawn = board[6][0]!;
    const moves = getPawnMoves(board, pawn);
    expect(moves.some(m => m[0] === 0 && m[1] === 7)).toBe(true);
    expect(moves.some(m => m[0] === 1 && m[1] === 6)).toBe(true);
  });
});
```

Run: `npx vitest run tests/engine/rules/advisor.test.ts tests/engine/rules/bishop.test.ts tests/engine/rules/cannon.test.ts tests/engine/rules/pawn.test.ts`
Expected: FAIL

- [ ] **Step 2: 实现各棋子走法**

Create: `src/engine/rules/advisor.ts`

```typescript
import type { BoardState, Piece, Position } from '../../types';

export function getAdvisorMoves(board: BoardState, piece: Piece): Position[] {
  const [px, py] = piece.position;
  const isRed = piece.side === 'red';
  const minY = isRed ? 0 : 7;
  const maxY = isRed ? 2 : 9;
  const moves: Position[] = [];
  const deltas: Position[] = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

  for (const [dx, dy] of deltas) {
    const x = px + dx;
    const y = py + dy;
    if (x >= 3 && x <= 5 && y >= minY && y <= maxY) {
      const target = board[y][x];
      if (!target || target.side !== piece.side) {
        moves.push([x, y]);
      }
    }
  }
  return moves;
}
```

Create: `src/engine/rules/bishop.ts`

```typescript
import type { BoardState, Piece, Position } from '../../types';
import { inBounds } from '../board';

export function getBishopMoves(board: BoardState, piece: Piece): Position[] {
  const [px, py] = piece.position;
  const isRed = piece.side === 'red';
  const riverLimit = isRed ? 4 : 5;
  const moves: Position[] = [];
  const deltas: Position[] = [[2, 2], [2, -2], [-2, 2], [-2, -2]];

  for (const [dx, dy] of deltas) {
    const eyeX = px + dx / 2;
    const eyeY = py + dy / 2;
    const x = px + dx;
    const y = py + dy;
    if (inBounds([x, y]) && !board[eyeY][eyeX] && (isRed ? y <= riverLimit : y >= riverLimit)) {
      const target = board[y][x];
      if (!target || target.side !== piece.side) {
        moves.push([x, y]);
      }
    }
  }
  return moves;
}
```

Create: `src/engine/rules/cannon.ts`

```typescript
import type { BoardState, Piece, Position } from '../../types';
import { inBounds } from '../board';

export function getCannonMoves(board: BoardState, piece: Piece): Position[] {
  const [px, py] = piece.position;
  const moves: Position[] = [];
  const directions: Position[] = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  for (const [dx, dy] of directions) {
    let x = px + dx;
    let y = py + dy;
    let jumped = false;
    while (inBounds([x, y])) {
      const target = board[y][x];
      if (!jumped) {
        if (!target) {
          moves.push([x, y]);
        } else {
          jumped = true;
        }
      } else {
        if (target) {
          if (target.side !== piece.side) {
            moves.push([x, y]);
          }
          break;
        }
      }
      x += dx;
      y += dy;
    }
  }
  return moves;
}
```

Create: `src/engine/rules/pawn.ts`

```typescript
import type { BoardState, Piece, Position } from '../../types';
import { inBounds } from '../board';

export function getPawnMoves(board: BoardState, piece: Piece): Position[] {
  const [px, py] = piece.position;
  const isRed = piece.side === 'red';
  const forward: Position = isRed ? [0, 1] : [0, -1];
  const riverCrossed = isRed ? py >= 5 : py <= 4;
  const directions: Position[] = [forward];
  if (riverCrossed) {
    directions.push([1, 0], [-1, 0]);
  }

  const moves: Position[] = [];
  for (const [dx, dy] of directions) {
    const x = px + dx;
    const y = py + dy;
    if (inBounds([x, y])) {
      const target = board[y][x];
      if (!target || target.side !== piece.side) {
        moves.push([x, y]);
      }
    }
  }
  return moves;
}
```

Run: `npx vitest run tests/engine/rules/advisor.test.ts tests/engine/rules/bishop.test.ts tests/engine/rules/cannon.test.ts tests/engine/rules/pawn.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/engine/rules/advisor.ts src/engine/rules/bishop.ts src/engine/rules/cannon.ts src/engine/rules/pawn.ts tests/
git commit -m "feat: 实现士、象、炮、兵走法规则与测试"
```

---

### Task 8: 走法规则统一入口与将军检测

**Files:**
- Create: `src/engine/rules/index.ts`
- Create: `src/engine/rules/check.ts`
- Create: `tests/engine/rules/index.test.ts`
- Create: `tests/engine/rules/check.test.ts`

- [ ] **Step 1: 写测试 — 统一入口**

Create: `tests/engine/rules/index.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { getValidMoves } from '../../../src/engine/rules';
import { createInitialBoard } from '../../../src/engine/board';

describe('getValidMoves', () => {
  it('should dispatch to correct piece type', () => {
    const board = createInitialBoard();
    const rook = board[0][0]!;
    const moves = getValidMoves(board, rook);
    expect(moves.length).toBeGreaterThan(0);
  });
});
```

Create: `tests/engine/rules/check.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { isInCheck, isCheckmate, isKingFacing } from '../../../src/engine/rules/check';
import { createInitialBoard, cloneBoard } from '../../../src/engine/board';
import type { Piece } from '../../../src/types';

describe('check detection', () => {
  it('should detect when king is under attack', () => {
    const board = createInitialBoard();
    // Clear pieces between red king and black rook
    board[0][4] = null;
    board[1][4] = null;
    board[2][4] = null;
    board[3][4] = null;
    // Place red king
    board[1][4] = { id: 'r_king', type: 'king', side: 'red', position: [4, 1] };
    const moves = isInCheck(board, 'red');
    expect(moves).toBe(true);
  });

  it('should detect king facing', () => {
    const board = createInitialBoard();
    board[3][4] = null;
    board[4][4] = null;
    board[5][4] = null;
    const facing = isKingFacing(board);
    expect(facing).toBe(true);
  });
});
```

Run: `npx vitest run tests/engine/rules/index.test.ts tests/engine/rules/check.test.ts`
Expected: FAIL

- [ ] **Step 2: 实现统一入口与将军检测**

Create: `src/engine/rules/index.ts`

```typescript
import type { BoardState, Piece, Position } from '../../types';
import { getKingMoves } from './king';
import { getAdvisorMoves } from './advisor';
import { getBishopMoves } from './bishop';
import { getKnightMoves } from './knight';
import { getRookMoves } from './rook';
import { getCannonMoves } from './cannon';
import { getPawnMoves } from './pawn';

const moveMap = {
  king: getKingMoves,
  advisor: getAdvisorMoves,
  bishop: getBishopMoves,
  knight: getKnightMoves,
  rook: getRookMoves,
  cannon: getCannonMoves,
  pawn: getPawnMoves,
};

export function getValidMoves(board: BoardState, piece: Piece): Position[] {
  return moveMap[piece.type](board, piece);
}

export * from './check';
```

Create: `src/engine/rules/check.ts`

```typescript
import type { BoardState, Position, Side } from '../../types';
import { getValidMoves } from './index';

export function isPositionUnderAttack(board: BoardState, pos: Position, bySide: Side): boolean {
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (piece && piece.side === bySide) {
        const moves = getValidMoves(board, piece);
        if (moves.some(m => m[0] === pos[0] && m[1] === pos[1])) {
          return true;
        }
      }
    }
  }
  return false;
}

export function isInCheck(board: BoardState, side: Side): boolean {
  let kingPos: Position | null = null;
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (piece && piece.side === side && piece.type === 'king') {
        kingPos = [x, y];
        break;
      }
    }
    if (kingPos) break;
  }
  if (!kingPos) return false;
  return isPositionUnderAttack(board, kingPos, side === 'red' ? 'black' : 'red');
}

export function isCheckmate(board: BoardState, side: Side): boolean {
  if (!isInCheck(board, side)) return false;
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (piece && piece.side === side) {
        const moves = getValidMoves(board, piece);
        for (const move of moves) {
          const testBoard = board.map(row => [...row]);
          testBoard[move[1]][move[0]] = { ...piece, position: move };
          testBoard[y][x] = null;
          if (!isInCheck(testBoard, side)) {
            return false;
          }
        }
      }
    }
  }
  return true;
}

export function isKingFacing(board: BoardState): boolean {
  let redKing: Position | null = null;
  let blackKing: Position | null = null;
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (piece && piece.type === 'king') {
        if (piece.side === 'red') redKing = [x, y];
        else blackKing = [x, y];
      }
    }
  }
  if (!redKing || !blackKing || redKing[0] !== blackKing[0]) return false;
  const x = redKing[0];
  for (let y = redKing[1] + 1; y < blackKing[1]; y++) {
    if (board[y][x]) return false;
  }
  return true;
}
```

Run: `npx vitest run tests/engine/rules/index.test.ts tests/engine/rules/check.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/engine/rules/index.ts src/engine/rules/check.ts tests/
git commit -m "feat: 实现走法统一入口与将军/将死检测"
```

---

### Task 9: Zustand Store 实现

**Files:**
- Create: `src/store/types.ts`
- Create: `src/store/gameStore.ts`

- [ ] **Step 1: 实现 Store 类型**

Create: `src/store/types.ts`

```typescript
import type { BoardState, Position, GameMode, GameStatus, AILevel, Side, MoveRecord } from '../types';

export interface GameStore {
  board: BoardState;
  currentTurn: Side;
  selectedPiece: { type: string; side: Side; position: Position } | null;
  validMoves: Position[];
  gameStatus: GameStatus;
  moveHistory: MoveRecord[];
  mode: GameMode;
  playerSide: Side;
  aiLevel: AILevel;

  selectPiece: (pos: Position) => void;
  movePiece: (to: Position) => void;
  undoMove: () => void;
  resetGame: () => void;
  setMode: (mode: GameMode) => void;
  setAILevel: (level: AILevel) => void;
}
```

- [ ] **Step 2: 实现 GameStore**

Create: `src/store/gameStore.ts`

```typescript
import { create } from 'zustand';
import type { GameStore } from './types';
import { createInitialBoard, cloneBoard } from '../engine/board';
import { getValidMoves, isInCheck, isCheckmate, isKingFacing } from '../engine/rules';
import type { Position, Piece, MoveRecord } from '../types';

export const useGameStore = create<GameStore>((set, get) => ({
  board: createInitialBoard(),
  currentTurn: 'red',
  selectedPiece: null,
  validMoves: [],
  gameStatus: 'playing',
  moveHistory: [],
  mode: 'pvp',
  playerSide: 'red',
  aiLevel: 2,

  selectPiece: (pos: Position) => {
    const { board, currentTurn } = get();
    const piece = board[pos[1]][pos[0]];
    if (!piece || piece.side !== currentTurn) {
      set({ selectedPiece: null, validMoves: [] });
      return;
    }
    const moves = getValidMoves(board, piece);
    set({ selectedPiece: piece, validMoves: moves });
  },

  movePiece: (to: Position) => {
    const { board, selectedPiece, currentTurn, moveHistory, gameStatus, mode, playerSide } = get();
    if (!selectedPiece) return;

    const isValid = get().validMoves.some(m => m[0] === to[0] && m[1] === to[1]);
    if (!isValid) return;

    const newBoard = cloneBoard(board);
    const from: Position = [...selectedPiece.position];
    const captured = newBoard[to[1]][to[0]];

    newBoard[to[1]][to[0]] = { ...selectedPiece, position: to };
    newBoard[from[1]][from[0]] = null;

    // Check for king facing
    if (isKingFacing(newBoard)) {
      return; // Illegal move
    }

    const nextTurn = currentTurn === 'red' ? 'black' : 'red';
    const record: MoveRecord = {
      piece: selectedPiece,
      from,
      to,
      captured,
      prevStatus: gameStatus,
    };

    let newStatus: typeof gameStatus = 'playing';
    if (isInCheck(newBoard, nextTurn)) {
      newStatus = isCheckmate(newBoard, nextTurn) ? 'checkmate' : 'check';
    }

    set({
      board: newBoard,
      currentTurn: nextTurn,
      selectedPiece: null,
      validMoves: [],
      gameStatus: newStatus,
      moveHistory: [...moveHistory, record],
    });
  },

  undoMove: () => {
    const { moveHistory } = get();
    if (moveHistory.length === 0) return;
    const last = moveHistory[moveHistory.length - 1];
    const newBoard = cloneBoard(get().board);
    newBoard[last.from[1]][last.from[0]] = last.piece;
    newBoard[last.to[1]][last.to[0]] = last.captured;

    set({
      board: newBoard,
      currentTurn: last.piece.side,
      selectedPiece: null,
      validMoves: [],
      gameStatus: last.prevStatus,
      moveHistory: moveHistory.slice(0, -1),
    });
  },

  resetGame: () => {
    set({
      board: createInitialBoard(),
      currentTurn: 'red',
      selectedPiece: null,
      validMoves: [],
      gameStatus: 'playing',
      moveHistory: [],
    });
  },

  setMode: (mode) => set({ mode }),
  setAILevel: (aiLevel) => set({ aiLevel }),
}));
```

- [ ] **Step 3: Commit**

```bash
git add src/store/types.ts src/store/gameStore.ts
git commit -m "feat: 实现 Zustand GameStore，含选子、移动、悔棋、重置"
```

---

### Task 10: SVG 棋盘与棋子组件

**Files:**
- Create: `src/components/Board.tsx`
- Create: `src/components/Piece.tsx`
- Create: `src/components/GameInfo.tsx`
- Create: `src/components/Controls.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: 实现 Piece 组件**

Create: `src/components/Piece.tsx`

```typescript
import type { Piece as PieceType } from '../types';

interface PieceProps {
  piece: PieceType;
  isSelected: boolean;
  onClick: () => void;
}

const PIECE_SIZE = 36;
const BOARD_OFFSET_X = 40;
const BOARD_OFFSET_Y = 40;
const CELL_SIZE = 50;

export function PieceComponent({ piece, isSelected, onClick }: PieceProps) {
  const cx = BOARD_OFFSET_X + piece.position[0] * CELL_SIZE;
  const cy = BOARD_OFFSET_Y + piece.position[1] * CELL_SIZE;
  const text = getPieceText(piece.type, piece.side);

  return (
    <g
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      transform={`translate(${cx}, ${cy})`}
    >
      <circle
        r={PIECE_SIZE / 2}
        fill={piece.side === 'red' ? '#fff0f0' : '#f0f0f0'}
        stroke={isSelected ? '#ff6600' : piece.side === 'red' ? '#cc0000' : '#000000'}
        strokeWidth={isSelected ? 3 : 2}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill={piece.side === 'red' ? '#cc0000' : '#000000'}
        fontSize={18}
        fontWeight="bold"
      >
        {text}
      </text>
    </g>
  );
}

function getPieceText(type: string, side: string): string {
  const map: Record<string, [string, string]> = {
    king: ['帅', '将'],
    advisor: ['仕', '士'],
    bishop: ['相', '象'],
    knight: ['傌', '馬'],
    rook: ['俥', '車'],
    cannon: ['炮', '砲'],
    pawn: ['兵', '卒'],
  };
  return map[type]?.[side === 'red' ? 0 : 1] ?? type;
}
```

- [ ] **Step 2: 实现 Board 组件**

Create: `src/components/Board.tsx`

```typescript
import { useGameStore } from '../store/gameStore';
import { PieceComponent } from './Piece';

const BOARD_OFFSET_X = 40;
const BOARD_OFFSET_Y = 40;
const CELL_SIZE = 50;
const BOARD_W = 8 * CELL_SIZE;
const BOARD_H = 9 * CELL_SIZE;

export function Board() {
  const board = useGameStore(s => s.board);
  const selectedPiece = useGameStore(s => s.selectedPiece);
  const validMoves = useGameStore(s => s.validMoves);
  const selectPiece = useGameStore(s => s.selectPiece);
  const movePiece = useGameStore(s => s.movePiece);

  const handleBoardClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!validMoves.length) return;
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const loc = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    const x = Math.round((loc.x - BOARD_OFFSET_X) / CELL_SIZE);
    const y = Math.round((loc.y - BOARD_OFFSET_Y) / CELL_SIZE);
    if (x >= 0 && x <= 8 && y >= 0 && y <= 9) {
      movePiece([x, y]);
    }
  };

  return (
    <svg width={BOARD_W + 80} height={BOARD_H + 80} onClick={handleBoardClick}>
      {/* Background */}
      <rect x={10} y={10} width={BOARD_W + 60} height={BOARD_H + 60} fill="#f5deb3" rx={4} />
      
      {/* Grid lines */}
      {Array.from({ length: 10 }, (_, i) => (
        <line
          key={`h${i}`}
          x1={BOARD_OFFSET_X}
          y1={BOARD_OFFSET_Y + i * CELL_SIZE}
          x2={BOARD_OFFSET_X + BOARD_W}
          y2={BOARD_OFFSET_Y + i * CELL_SIZE}
          stroke="#333"
          strokeWidth={1}
        />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={BOARD_OFFSET_X + i * CELL_SIZE}
          y1={BOARD_OFFSET_Y}
          x2={BOARD_OFFSET_X + i * CELL_SIZE}
          y2={BOARD_OFFSET_Y + BOARD_H}
          stroke="#333"
          strokeWidth={1}
        />
      ))}
      
      {/* River gap */}
      <line
        x1={BOARD_OFFSET_X}
        y1={BOARD_OFFSET_Y + 4 * CELL_SIZE}
        x2={BOARD_OFFSET_X}
        y2={BOARD_OFFSET_Y + 5 * CELL_SIZE}
        stroke="#f5deb3"
        strokeWidth={2}
      />
      <line
        x1={BOARD_OFFSET_X + BOARD_W}
        y1={BOARD_OFFSET_Y + 4 * CELL_SIZE}
        x2={BOARD_OFFSET_X + BOARD_W}
        y2={BOARD_OFFSET_Y + 5 * CELL_SIZE}
        stroke="#f5deb3"
        strokeWidth={2}
      />
      
      {/* Palace diagonals */}
      <line x1={BOARD_OFFSET_X + 3 * CELL_SIZE} y1={BOARD_OFFSET_Y} x2={BOARD_OFFSET_X + 5 * CELL_SIZE} y2={BOARD_OFFSET_Y + 2 * CELL_SIZE} stroke="#333" />
      <line x1={BOARD_OFFSET_X + 5 * CELL_SIZE} y1={BOARD_OFFSET_Y} x2={BOARD_OFFSET_X + 3 * CELL_SIZE} y2={BOARD_OFFSET_Y + 2 * CELL_SIZE} stroke="#333" />
      <line x1={BOARD_OFFSET_X + 3 * CELL_SIZE} y1={BOARD_OFFSET_Y + 7 * CELL_SIZE} x2={BOARD_OFFSET_X + 5 * CELL_SIZE} y2={BOARD_OFFSET_Y + 9 * CELL_SIZE} stroke="#333" />
      <line x1={BOARD_OFFSET_X + 5 * CELL_SIZE} y1={BOARD_OFFSET_Y + 7 * CELL_SIZE} x2={BOARD_OFFSET_X + 3 * CELL_SIZE} y2={BOARD_OFFSET_Y + 9 * CELL_SIZE} stroke="#333" />

      {/* Valid move indicators */}
      {validMoves.map(([x, y]) => (
        <circle
          key={`m${x}-${y}`}
          cx={BOARD_OFFSET_X + x * CELL_SIZE}
          cy={BOARD_OFFSET_Y + y * CELL_SIZE}
          r={6}
          fill="rgba(0, 128, 0, 0.5)"
          pointerEvents="none"
        />
      ))}

      {/* Pieces */}
      {board.flat().map(piece =>
        piece ? (
          <PieceComponent
            key={piece.id}
            piece={piece}
            isSelected={selectedPiece?.id === piece.id}
            onClick={() => selectPiece(piece.position)}
          />
        ) : null
      )}
    </svg>
  );
}
```

- [ ] **Step 3: 实现 GameInfo 和 Controls**

Create: `src/components/GameInfo.tsx`

```typescript
import { useGameStore } from '../store/gameStore';

export function GameInfo() {
  const { currentTurn, gameStatus, mode, moveHistory } = useGameStore();
  return (
    <div style={{ padding: 16, minWidth: 200 }}>
      <h2>中国象棋</h2>
      <p>模式: {mode === 'pvp' ? '双人对战' : '人机对战'}</p>
      <p>当前回合: {currentTurn === 'red' ? '红方' : '黑方'}</p>
      <p>状态: {statusText(gameStatus)}</p>
      <p>步数: {moveHistory.length}</p>
    </div>
  );
}

function statusText(status: string): string {
  const map: Record<string, string> = {
    idle: '空闲',
    playing: '进行中',
    check: '将军！',
    checkmate: '将死，游戏结束',
    stalemate: '和棋',
  };
  return map[status] ?? status;
}
```

Create: `src/components/Controls.tsx`

```typescript
import { useGameStore } from '../store/gameStore';

export function Controls() {
  const { undoMove, resetGame, mode, setMode, aiLevel, setAILevel } = useGameStore();
  return (
    <div style={{ padding: 16 }}>
      <button onClick={undoMove}>悔棋</button>
      <button onClick={resetGame} style={{ marginLeft: 8 }}>重新开始</button>
      <div style={{ marginTop: 12 }}>
        <label>模式: </label>
        <select value={mode} onChange={e => setMode(e.target.value as 'pvp' | 'pve')}>
          <option value="pvp">双人对战</option>
          <option value="pve">人机对战</option>
        </select>
      </div>
      {mode === 'pve' && (
        <div style={{ marginTop: 8 }}>
          <label>AI 难度: </label>
          <select value={aiLevel} onChange={e => setAILevel(Number(e.target.value) as 1 | 2 | 3)}>
            <option value={1}>简单</option>
            <option value={2}>中等</option>
            <option value={3}>困难</option>
          </select>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: 更新 App.tsx**

Modify: `src/App.tsx`

```tsx
import { Board } from './components/Board';
import { GameInfo } from './components/GameInfo';
import { Controls } from './components/Controls';

function App() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div>
        <Board />
      </div>
      <div>
        <GameInfo />
        <Controls />
      </div>
    </div>
  );
}

export default App;
```

- [ ] **Step 5: 验证 UI**

Run: `npm run dev`
Expected: 浏览器打开看到完整棋盘、32 个棋子、右侧信息面板和控制按钮。点击棋子会高亮，点击棋盘绿色落点会移动棋子。

- [ ] **Step 6: Commit**

```bash
git add src/components/ src/App.tsx
git commit -m "feat: 实现 SVG 棋盘、棋子、信息面板和控制组件"
```

---

### Task 11: AI 局面评估函数

**Files:**
- Create: `src/engine/ai/evaluator.ts`
- Create: `tests/engine/ai/evaluator.test.ts`

- [ ] **Step 1: 写测试**

Create: `tests/engine/ai/evaluator.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { evaluateBoard } from '../../../src/engine/ai/evaluator';
import { createInitialBoard } from '../../../src/engine/board';

describe('evaluator', () => {
  it('should return 0 for initial board', () => {
    const board = createInitialBoard();
    const score = evaluateBoard(board);
    expect(score).toBe(0);
  });

  it('should favor board with material advantage', () => {
    const board = createInitialBoard();
    board[0][0] = null; // Remove red rook
    const score = evaluateBoard(board);
    expect(score).toBeLessThan(0);
  });
});
```

Run: `npx vitest run tests/engine/ai/evaluator.test.ts`
Expected: FAIL

- [ ] **Step 2: 实现评估函数**

Create: `src/engine/ai/evaluator.ts`

```typescript
import type { BoardState, PieceType, Side } from '../../types';

const PIECE_VALUES: Record<PieceType, number> = {
  king: 10000,
  advisor: 20,
  bishop: 20,
  knight: 45,
  rook: 90,
  cannon: 50,
  pawn: 10,
};

// Simple position bonus: center is better for most pieces
const POSITION_BONUS: Record<PieceType, number[][]> = {
  king: Array.from({ length: 10 }, () => Array(9).fill(0)),
  advisor: Array.from({ length: 10 }, () => Array(9).fill(0)),
  bishop: Array.from({ length: 10 }, () => Array(9).fill(0)),
  knight: Array.from({ length: 10 }, (_, y) =>
    Array.from({ length: 9 }, (_, x) => {
      const cx = 4, cy = 4.5;
      const dist = Math.abs(x - cx) + Math.abs(y - cy);
      return Math.max(0, 6 - dist);
    })
  ),
  rook: Array.from({ length: 10 }, (_, y) =>
    Array.from({ length: 9 }, (_, x) => {
      const cx = 4, cy = 4.5;
      const dist = Math.abs(x - cx) + Math.abs(y - cy);
      return Math.max(0, 5 - dist);
    })
  ),
  cannon: Array.from({ length: 10 }, () => Array(9).fill(0)),
  pawn: Array.from({ length: 10 }, (_, y) =>
    Array.from({ length: 9 }, (_, x) => {
      // Pawns are better when they cross river
      const redBonus = y >= 5 ? (y - 4) * 3 : 0;
      const blackBonus = y <= 4 ? (5 - y) * 3 : 0;
      return redBonus + blackBonus;
    })
  ),
};

export function evaluateBoard(board: BoardState): number {
  let score = 0;
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (piece) {
        const value = PIECE_VALUES[piece.type] + (POSITION_BONUS[piece.type][y]?.[x] ?? 0);
        score += piece.side === 'red' ? value : -value;
      }
    }
  }
  return score;
}

export function evaluateForSide(board: BoardState, side: Side): number {
  const score = evaluateBoard(board);
  return side === 'red' ? score : -score;
}
```

Run: `npx vitest run tests/engine/ai/evaluator.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/engine/ai/evaluator.ts tests/engine/ai/
git commit -m "feat: 实现 AI 局面评估函数"
```

---

### Task 12: Minimax + Alpha-Beta 搜索

**Files:**
- Create: `src/engine/ai/searcher.ts`
- Create: `tests/engine/ai/searcher.test.ts`

- [ ] **Step 1: 写测试**

Create: `tests/engine/ai/searcher.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { findBestMove } from '../../../src/engine/ai/searcher';
import { createInitialBoard, cloneBoard } from '../../../src/engine/board';

describe('searcher', () => {
  it('should return a valid move for black', () => {
    const board = createInitialBoard();
    const move = findBestMove(board, 'black', 2);
    expect(move).not.toBeNull();
    expect(move!.from).toBeDefined();
    expect(move!.to).toBeDefined();
  });

  it('should capture unprotected piece if beneficial', () => {
    const board = createInitialBoard();
    // Set up a position where black can capture a red piece
    board[3][4] = null;
    const move = findBestMove(board, 'black', 2);
    expect(move).not.toBeNull();
  });
});
```

Run: `npx vitest run tests/engine/ai/searcher.test.ts`
Expected: FAIL

- [ ] **Step 2: 实现搜索器**

Create: `src/engine/ai/searcher.ts`

```typescript
import type { BoardState, Position, Side, Piece } from '../../types';
import { evaluateForSide } from './evaluator';
import { getValidMoves } from '../rules';
import { cloneBoard } from '../board';

export interface AIMove {
  from: Position;
  to: Position;
  piece: Piece;
}

export function findBestMove(board: BoardState, side: Side, depth: number): AIMove | null {
  let bestMove: AIMove | null = null;
  let bestScore = -Infinity;

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (piece && piece.side === side) {
        const moves = getValidMoves(board, piece);
        for (const move of moves) {
          const newBoard = cloneBoard(board);
          newBoard[move[1]][move[0]] = { ...piece, position: move };
          newBoard[y][x] = null;
          const score = -negamax(newBoard, depth - 1, -Infinity, Infinity, side === 'red' ? 'black' : 'red');
          if (score > bestScore) {
            bestScore = score;
            bestMove = { from: [x, y], to: move, piece };
          }
        }
      }
    }
  }
  return bestMove;
}

function negamax(board: BoardState, depth: number, alpha: number, beta: number, side: Side): number {
  if (depth === 0) {
    return evaluateForSide(board, side);
  }

  let bestScore = -Infinity;
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (piece && piece.side === side) {
        const moves = getValidMoves(board, piece);
        for (const move of moves) {
          const newBoard = cloneBoard(board);
          newBoard[move[1]][move[0]] = { ...piece, position: move };
          newBoard[y][x] = null;
          const score = -negamax(newBoard, depth - 1, -beta, -alpha, side === 'red' ? 'black' : 'red');
          bestScore = Math.max(bestScore, score);
          alpha = Math.max(alpha, score);
          if (alpha >= beta) {
            return bestScore;
          }
        }
      }
    }
  }
  return bestScore;
}
```

Run: `npx vitest run tests/engine/ai/searcher.test.ts`
Expected: PASS（注意：搜索可能较慢，但应在几秒内完成）

- [ ] **Step 3: Commit**

```bash
git add src/engine/ai/searcher.ts tests/engine/ai/searcher.test.ts
git commit -m "feat: 实现 Minimax + Alpha-Beta 搜索"
```

---

### Task 13: Web Worker 集成与人机对战

**Files:**
- Create: `src/engine/ai/worker.ts`
- Create: `src/hooks/useAI.ts`
- Modify: `src/store/gameStore.ts`（AI 行动逻辑）
- Modify: `src/components/Controls.tsx`（切换 PvE 模式提示）

- [ ] **Step 1: 实现 Web Worker**

Create: `src/engine/ai/worker.ts`

```typescript
import { findBestMove } from './searcher';
import type { BoardState, Side } from '../../types';

export interface AIWorkerRequest {
  board: BoardState;
  side: Side;
  depth: number;
}

self.onmessage = (e: MessageEvent<AIWorkerRequest>) => {
  const { board, side, depth } = e.data;
  const move = findBestMove(board, side, depth);
  self.postMessage(move);
};
```

- [ ] **Step 2: 实现 AI Hook**

Create: `src/hooks/useAI.ts`

```typescript
import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { cloneBoard } from '../engine/board';
import type { AIMove } from '../engine/ai/searcher';

const DEPTH_MAP = { 1: 2, 2: 3, 3: 4 };

export function useAI() {
  const { mode, currentTurn, playerSide, aiLevel, board, movePiece } = useGameStore();
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (mode !== 'pve') return;
    if (currentTurn === playerSide) return;

    const worker = new Worker(new URL('../engine/ai/worker.ts', import.meta.url), { type: 'module' });
    workerRef.current = worker;

    worker.postMessage({
      board: cloneBoard(board),
      side: currentTurn,
      depth: DEPTH_MAP[aiLevel],
    });

    worker.onmessage = (e: MessageEvent<AIMove | null>) => {
      const move = e.data;
      if (move) {
        // Select then move
        useGameStore.getState().selectPiece(move.from);
        setTimeout(() => {
          useGameStore.getState().movePiece(move.to);
        }, 300);
      }
      worker.terminate();
    };

    return () => {
      worker.terminate();
    };
  }, [mode, currentTurn, playerSide, aiLevel, board, movePiece]);
}
```

- [ ] **Step 3: 在 App 中启用 AI Hook**

Modify: `src/App.tsx`

```tsx
import { Board } from './components/Board';
import { GameInfo } from './components/GameInfo';
import { Controls } from './components/Controls';
import { useAI } from './hooks/useAI';

function App() {
  useAI();
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div>
        <Board />
      </div>
      <div>
        <GameInfo />
        <Controls />
      </div>
    </div>
  );
}

export default App;
```

- [ ] **Step 4: 验证人机对战**

Run: `npm run dev`
Steps:
1. 在控制面板切换到"人机对战"
2. 点击红方棋子，移动到落点
3. 观察黑方（AI）是否在几百毫秒后自动走棋
4. 确认 AI 不会走违规步

Expected: AI 能正常回应玩家的每一步。

- [ ] **Step 5: Commit**

```bash
git add src/engine/ai/worker.ts src/hooks/useAI.ts src/App.tsx
git commit -m "feat: 集成 Web Worker AI，实现人机对战"
```

---

### Task 14: 移动端响应式与体验优化

**Files:**
- Modify: `src/components/Board.tsx`
- Modify: `src/App.tsx`
- Create: `src/index.css`（或修改现有样式文件）

- [ ] **Step 1: 添加响应式缩放**

Modify: `src/components/Board.tsx`（添加 viewBox 和响应式缩放）

在 svg 元素上添加：
```
viewBox={`0 0 ${BOARD_W + 80} ${BOARD_H + 80}`}
style={{ width: '100%', maxWidth: 520, height: 'auto' }}
```

- [ ] **Step 2: 优化 App 布局**

Modify: `src/App.tsx`

```tsx
function App() {
  useAI();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', padding: 16 }}>
      <div style={{ flexShrink: 0 }}>
        <Board />
      </div>
      <div style={{ minWidth: 200 }}>
        <GameInfo />
        <Controls />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 添加基础 CSS**

Create/Modify: `src/index.css`

```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f0f0f0;
}

button {
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
}

button:hover {
  background: #f5f5f5;
}

select {
  padding: 6px;
  font-size: 14px;
}
```

在 `src/main.tsx` 中引入：
```tsx
import './index.css';
```

- [ ] **Step 4: 验证响应式**

Run: `npm run dev`
Steps: 打开浏览器开发者工具，切换手机视口（iPhone SE / iPhone 12），确认棋盘自适应缩放，不出现横向滚动条。

- [ ] **Step 5: Commit**

```bash
git add src/components/Board.tsx src/App.tsx src/index.css src/main.tsx
git commit -m "style: 添加响应式布局和基础样式"
```

---

### Task 15: 最终集成测试与文档

**Files:**
- Create: `docs/dev-guide.md`
- Create: `docs/api-spec.md`

- [ ] **Step 1: 编写开发指南**

Create: `docs/dev-guide.md`

```markdown
# 开发指南

## 启动开发服务器
```bash
npm run dev
```

## 运行测试
```bash
npx vitest run
```

## 构建生产包
```bash
npm run build
```

## 项目结构
- `src/components/` — React UI 组件
- `src/store/` — Zustand 状态管理
- `src/engine/rules/` — 象棋走法规则引擎
- `src/engine/ai/` — AI 评估与搜索
- `tests/` — 单元测试

## 添加新规则
在 `src/engine/rules/` 下新建文件，导出 `getXXXMoves` 函数，
然后在 `src/engine/rules/index.ts` 的 `moveMap` 中注册。
```

- [ ] **Step 2: 编写 API 规范**

Create: `docs/api-spec.md`

```markdown
# 模块接口文档

## engine/board.ts
- `createInitialBoard(): BoardState` — 创建初始棋盘
- `cloneBoard(board): BoardState` — 深拷贝棋盘
- `inBounds(pos): boolean` — 检查坐标是否在棋盘内

## engine/rules/index.ts
- `getValidMoves(board, piece): Position[]` — 获取某棋子的所有合法落点

## engine/ai/searcher.ts
- `findBestMove(board, side, depth): AIMove | null` — 搜索最佳着法

## store/gameStore.ts
- `selectPiece(pos)` — 选中某位置棋子
- `movePiece(to)` — 将已选棋子移动到目标位置
- `undoMove()` — 悔棋一步
- `resetGame()` — 重新开始
```

- [ ] **Step 3: 运行全部测试**

Run: `npx vitest run`
Expected: 所有测试通过。

- [ ] **Step 4: 最终 Commit**

```bash
git add docs/
git commit -m "docs: 添加开发指南和 API 规范文档"
```

---

## 自我审查

1. **Spec 覆盖检查：**
   - ✅ React + TypeScript + Vite 项目初始化 — Task 1
   - ✅ SVG 棋盘与棋子渲染 — Task 10
   - ✅ 走法规则引擎（所有棋子）— Task 4-7
   - ✅ 将军/将死检测 — Task 8
   - ✅ Zustand 状态管理 — Task 9
   - ✅ AI Minimax + Alpha-Beta — Task 11-12
   - ✅ Web Worker — Task 13
   - ✅ 悔棋功能 — Task 9
   - ✅ 响应式 — Task 14
   - ✅ 规范文档 — Task 15

2. **占位符扫描：** 无 TBD/TODO/"implement later"。

3. **类型一致性：** `GameStore` 接口中的方法名与实现一致；`Piece`, `Position`, `BoardState` 类型在所有文件中一致。
