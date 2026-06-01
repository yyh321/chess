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