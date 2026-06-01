import { describe, it, expect } from 'vitest';
import { getKingMoves } from '../../../src/engine/rules/king';
import { createInitialBoard } from '../../../src/engine/board';

describe('king moves', () => {
  it('should stay within palace', () => {
    const board = createInitialBoard();
    const king = board[0][4]!;
    const moves = getKingMoves(board, king);
    expect(moves.every(m => m[0] >= 3 && m[0] <= 5 && m[1] >= 0 && m[1] <= 2)).toBe(true);
  });

  it('should move one step orthogonally', () => {
    const board = createInitialBoard();
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
