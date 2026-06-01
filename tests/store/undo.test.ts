import { describe, it, expect } from 'vitest';
import { useGameStore } from '../../src/store/gameStore';
import { createInitialBoard } from '../../src/engine/board';

describe('undoMove', () => {
  beforeEach(() => {
    useGameStore.setState({
      board: createInitialBoard(),
      currentTurn: 'red',
      selectedPiece: null,
      validMoves: [],
      gameStatus: 'playing',
      moveHistory: [],
      mode: 'pvp',
    });
  });

  it('should restore a simple move', () => {
    const board = createInitialBoard();
    board[3][0] = null;

    useGameStore.setState({ board, currentTurn: 'red', moveHistory: [] });

    useGameStore.getState().selectPiece([0, 0]);
    useGameStore.getState().movePiece([0, 2]);

    let state = useGameStore.getState();
    expect(state.board[2][0]?.type).toBe('rook');
    expect(state.board[0][0]).toBeNull();
    expect(state.moveHistory.length).toBe(1);

    useGameStore.getState().undoMove();
    state = useGameStore.getState();
    expect(state.board[0][0]?.type).toBe('rook');
    expect(state.board[2][0]).toBeNull();
    expect(state.moveHistory.length).toBe(0);
  });

  it('should restore a capture', () => {
    const board = createInitialBoard();
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 9; x++) {
        if (!((x === 0 && y === 0) || (x === 0 && y === 6))) {
          board[y][x] = null;
        }
      }
    }

    useGameStore.setState({ board, currentTurn: 'red', moveHistory: [] });

    useGameStore.getState().selectPiece([0, 0]);
    useGameStore.getState().movePiece([0, 6]);

    let state = useGameStore.getState();
    expect(state.board[6][0]?.type).toBe('rook');

    useGameStore.getState().undoMove();
    state = useGameStore.getState();
    expect(state.board[0][0]?.type).toBe('rook');
    expect(state.board[0][0]?.side).toBe('red');
    expect(state.board[6][0]?.type).toBe('pawn');
    expect(state.board[6][0]?.side).toBe('black');
    expect(state.moveHistory.length).toBe(0);
  });

  it('should undo two steps in PVE mode', () => {
    const board = createInitialBoard();
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 9; x++) {
        if (!((x === 0 && y === 0) || (x === 0 && y === 6) || (x === 8 && y === 9))) {
          board[y][x] = null;
        }
      }
    }

    useGameStore.setState({
      board,
      currentTurn: 'red',
      moveHistory: [],
      mode: 'pve',
    });

    // User moves red rook [0,0] -> [0,6]
    useGameStore.getState().selectPiece([0, 0]);
    useGameStore.getState().movePiece([0, 6]);

    // Simulate AI move black rook [8,9] -> [8,8]
    useGameStore.getState().selectPiece([8, 9]);
    useGameStore.getState().movePiece([8, 8]);

    let state = useGameStore.getState();
    expect(state.moveHistory.length).toBe(2);
    expect(state.board[6][0]?.type).toBe('rook');
    expect(state.board[8][8]?.type).toBe('rook');
    expect(state.currentTurn).toBe('red');

    // Undo in PVE should revert both moves
    useGameStore.getState().undoMove();
    state = useGameStore.getState();
    expect(state.moveHistory.length).toBe(0);
    expect(state.board[0][0]?.type).toBe('rook');
    expect(state.board[6][0]?.type).toBe('pawn');
    expect(state.board[9][8]?.type).toBe('rook');
    expect(state.board[8][8]).toBeNull();
    expect(state.currentTurn).toBe('red');
  });
});
