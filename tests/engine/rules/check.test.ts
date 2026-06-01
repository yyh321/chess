import { describe, it, expect } from 'vitest';
import { isInCheck, isCheckmate, isKingFacing } from '../../../src/engine/rules/check';
import { createInitialBoard } from '../../../src/engine/board';

describe('check detection', () => {
  it('should detect when king is under attack', () => {
    const board = createInitialBoard();
    // Place a black rook directly facing the red king with clear path
    board[2][4] = null;
    board[3][4] = null;
    board[4][4] = { id: 'b_rook_test', type: 'rook', side: 'black', position: [4, 4] };
    const result = isInCheck(board, 'red');
    expect(result).toBe(true);
  });

  it('should detect king facing', () => {
    const board = createInitialBoard();
    // Clear the entire column between the two kings
    for (let y = 1; y < 9; y++) {
      board[y][4] = null;
    }
    const facing = isKingFacing(board);
    expect(facing).toBe(true);
  });

  it('should not detect king facing when blocked', () => {
    const board = createInitialBoard();
    // Only clear a few squares, leave blockers
    board[3][4] = null;
    board[4][4] = null;
    board[5][4] = null;
    const facing = isKingFacing(board);
    expect(facing).toBe(false);
  });
});
