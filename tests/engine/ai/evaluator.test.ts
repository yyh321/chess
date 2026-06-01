import { describe, it, expect } from 'vitest';
import { evaluateBoard } from '../../../src/engine/ai/evaluator';
import { createInitialBoard } from '../../../src/engine/board';

describe('evaluator', () => {
  it('should return 0 for initial board', () => {
    const board = createInitialBoard();
    const score = evaluateBoard(board);
    expect(score).toBe(0);
  });

  it('should favor board with material advantage', () => {
    const board = createInitialBoard();
    board[0][0] = null; // Remove red rook
    const score = evaluateBoard(board);
    expect(score).toBeLessThan(0);
  });
});
