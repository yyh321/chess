import { describe, it, expect } from 'vitest';
import { getRookMoves } from '../../../src/engine/rules/rook';
import { createInitialBoard } from '../../../src/engine/board';

describe('rook moves', () => {
  it('should move horizontally and vertically', () => {
    const board = createInitialBoard();
    board[3][0] = null;
    const rook = board[0][0]!;
    const moves = getRookMoves(board, rook);
    expect(moves.some(m => m[0] === 0 && m[1] === 3)).toBe(true);
    expect(moves.some(m => m[0] === 1 && m[1] === 0)).toBe(false); // own knight blocks
  });

  it('should be blocked by own piece', () => {
    const board = createInitialBoard();
    const rook = board[0][0]!;
    const moves = getRookMoves(board, rook);
    expect(moves.some(m => m[0] === 0 && m[1] === 4)).toBe(false); // pawn at [0,3] blocks
  });

  it('should capture enemy piece and stop beyond', () => {
    const board = createInitialBoard();
    board[3][0] = null;
    const rook = board[0][0]!;
    const moves = getRookMoves(board, rook);
    expect(moves.some(m => m[0] === 0 && m[1] === 6)).toBe(true); // black pawn at [0,6]
    expect(moves.some(m => m[0] === 0 && m[1] === 7)).toBe(false); // blocked by black pawn
  });
});
