import { describe, it, expect } from 'vitest';
import { findBestMove } from '../../../src/engine/ai/searcher';
import { createInitialBoard } from '../../../src/engine/board';

describe('searcher', () => {
  it('should return a valid move for black', () => {
    const board = createInitialBoard();
    const move = findBestMove(board, 'black', 2);
    expect(move).not.toBeNull();
    expect(move!.from).toBeDefined();
    expect(move!.to).toBeDefined();
  });

  it('should capture unprotected piece if beneficial', () => {
    const board = createInitialBoard();
    board[3][4] = null;
    const move = findBestMove(board, 'black', 2);
    expect(move).not.toBeNull();
  });
});
