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
