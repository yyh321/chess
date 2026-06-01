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
