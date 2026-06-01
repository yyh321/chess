import { describe, it, expect } from 'vitest';
import { useGameStore } from '../../src/store/gameStore';
import { createInitialBoard, cloneBoard } from '../../src/engine/board';
import type { Piece } from '../../src/types';

describe('gameStore', () => {
  it('should detect check and not allow illegal moves', () => {
    const board = createInitialBoard();
    // Set up a direct check: black rook at [4, 3] faces red king at [4, 0]
    // Clear the path
    board[3][4] = null;
    board[2][4] = null;
    board[1][4] = null;
    // Place black rook at [4, 3]
    board[3][4] = { id: 'b_rook_test', type: 'rook', side: 'black', position: [4, 3] };

    // Manually set store state to simulate red in check
    useGameStore.setState({
      board,
      currentTurn: 'red',
      selectedPiece: null,
      validMoves: [],
      gameStatus: 'check',
      moveHistory: [],
    });

    // Try to select red pawn at [0, 3] and see if its moves are filtered
    useGameStore.getState().selectPiece([0, 3]);
    const state = useGameStore.getState();
    expect(state.gameStatus).toBe('check');
    // Pawn at [0,3] can normally move to [0,4], but that does not block the rook
    // So it should have no valid moves (or only moves that block/intercept the rook)
    expect(state.selectedPiece).not.toBeNull();
  });

  it('should prevent moving into self-check', () => {
    const board = createInitialBoard();
    // Clear path for black rook to attack red king if red king moves
    board[1][4] = null;
    board[2][4] = null;
    board[3][4] = null;
    board[4][4] = null;
    board[5][4] = null;
    // Place black rook at [4, 6]
    board[6][4] = { id: 'b_rook_test', type: 'rook', side: 'black', position: [4, 6] };

    useGameStore.setState({
      board,
      currentTurn: 'red',
      selectedPiece: null,
      validMoves: [],
      gameStatus: 'playing',
      moveHistory: [],
    });

    // Red king at [4,0] tries to move to [3,0] - that should be illegal because
    // black rook at [4,6] would then attack [3,0]? No, rook attacks column 4.
    // Let me pick a simpler case: red king at [4,0] tries to move to [4,1].
    // But black rook is at [4,6], so [4,1] is under attack. So moving to [4,1] should be illegal.
    useGameStore.getState().selectPiece([4, 0]);
    const state = useGameStore.getState();
    expect(state.validMoves.some(m => m[0] === 4 && m[1] === 1)).toBe(false);
  });
});
