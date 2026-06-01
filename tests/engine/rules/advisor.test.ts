import { describe, it, expect } from 'vitest';
import { getAdvisorMoves } from '../../../src/engine/rules/advisor';
import { createInitialBoard } from '../../../src/engine/board';

describe('advisor moves', () => {
  it('should move diagonally one step in palace', () => {
    const board = createInitialBoard();
    const advisor = board[0][3]!;
    const moves = getAdvisorMoves(board, advisor);
    expect(moves).toHaveLength(1);
    expect(moves[0]).toEqual([4, 1]);
  });
});
