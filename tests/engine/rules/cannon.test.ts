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
    board[6][1] = null; // clear the second black pawn so only one piece between
    const cannon = board[2][1]!;
    const moves = getCannonMoves(board, cannon);
    expect(moves.some(m => m[0] === 1 && m[1] === 6)).toBe(true); // jump [1,4] to capture [1,6]
    expect(moves.some(m => m[0] === 1 && m[1] === 7)).toBe(false); // blocked by [1,6]
  });
});
