import { describe, it, expect } from 'vitest';
import { getBishopMoves } from '../../../src/engine/rules/bishop';
import { createInitialBoard } from '../../../src/engine/board';

describe('bishop moves', () => {
  it('should move diagonally two steps with eye', () => {
    const board = createInitialBoard();
    board[3][0] = null;
    const bishop = board[0][2]!;
    const moves = getBishopMoves(board, bishop);
    expect(moves.some(m => m[0] === 4 && m[1] === 2)).toBe(true);
    expect(moves.some(m => m[0] === 0 && m[1] === 2)).toBe(true); // [-2, 2] move
  });

  it('should be blocked if eye is occupied', () => {
    const board = createInitialBoard();
    // Place a piece at [1,1] (the eye) to block the [-2, 2] direction
    board[1][1] = { id: 'r_block', type: 'pawn', side: 'red', position: [1, 1] };
    const bishop = board[0][2]!;
    const moves = getBishopMoves(board, bishop);
    expect(moves.some(m => m[0] === 0 && m[1] === 2)).toBe(false); // blocked direction
    expect(moves.some(m => m[0] === 4 && m[1] === 2)).toBe(true);  // open direction
  });

  it('should not cross river', () => {
    const board = createInitialBoard();
    board[3][2] = { id: 'r_bishop_test', type: 'bishop', side: 'red', position: [2, 3] };
    const bishop = board[3][2]!;
    const moves = getBishopMoves(board, bishop);
    expect(moves.every(m => m[1] <= 4)).toBe(true);
  });
});
