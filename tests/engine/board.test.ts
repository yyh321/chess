import { describe, it, expect } from 'vitest';
import { createInitialBoard, inBounds, cloneBoard } from '../../src/engine/board';

describe('board', () => {
  it('createInitialBoard should return 10x9 board', () => {
    const board = createInitialBoard();
    expect(board.length).toBe(10);
    expect(board[0].length).toBe(9);
  });

  it('createInitialBoard should place red king at [4, 0]', () => {
    const board = createInitialBoard();
    const king = board[0][4];
    expect(king).not.toBeNull();
    expect(king!.type).toBe('king');
    expect(king!.side).toBe('red');
  });

  it('inBounds should validate coordinates', () => {
    expect(inBounds([0, 0])).toBe(true);
    expect(inBounds([8, 9])).toBe(true);
    expect(inBounds([9, 0])).toBe(false);
    expect(inBounds([0, 10])).toBe(false);
    expect(inBounds([-1, 0])).toBe(false);
  });

  it('cloneBoard should create deep copy', () => {
    const board = createInitialBoard();
    const copy = cloneBoard(board);
    expect(copy).not.toBe(board);
    expect(copy[0][0]).not.toBe(board[0][0]);
    expect(copy[0][0]!.id).toBe(board[0][0]!.id);
  });
});
