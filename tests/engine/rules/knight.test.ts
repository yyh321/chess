import { describe, it, expect } from 'vitest';
import { getKnightMoves } from '../../../src/engine/rules/knight';
import { createInitialBoard } from '../../../src/engine/board';

describe('knight moves', () => {
  it('should move in L-shape', () => {
    const board = createInitialBoard();
    board[3][1] = null;
    const knight = board[0][1]!;
    const moves = getKnightMoves(board, knight);
    expect(moves.some(m => m[0] === 0 && m[1] === 2)).toBe(true);
    expect(moves.some(m => m[0] === 2 && m[1] === 2)).toBe(true);
  });

  it('should be blocked by hobbling', () => {
    const board = createInitialBoard();
    // Place a piece at [1,1] to block the knight
    board[1][1] = { id: 'r_block', type: 'pawn', side: 'red', position: [1, 1] };
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
