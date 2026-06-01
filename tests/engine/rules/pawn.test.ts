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
