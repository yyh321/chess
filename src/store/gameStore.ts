import { create } from 'zustand';
import type { GameStore } from './types';
import { createInitialBoard, cloneBoard } from '../engine/board';
import { getValidMoves, isInCheck, isCheckmate, isKingFacing } from '../engine/rules';
import type { Position, MoveRecord, Piece } from '../types';
import { playSelect, playMove, playCapture, playCheck, playCheckmate } from '../utils/sound';

function isMoveLegal(board: ReturnType<typeof cloneBoard>, piece: Piece, to: Position): boolean {
  const testBoard = cloneBoard(board);
  testBoard[to[1]][to[0]] = { ...piece, position: to };
  const [fromX, fromY] = piece.position;
  testBoard[fromY][fromX] = null;
  return !isInCheck(testBoard, piece.side) && !isKingFacing(testBoard);
}

export const useGameStore = create<GameStore>((set, get) => ({
  board: createInitialBoard(),
  currentTurn: 'red',
  selectedPiece: null,
  validMoves: [],
  gameStatus: 'playing',
  moveHistory: [],
  mode: 'pvp',
  playerSide: 'red',
  aiLevel: 2,

  selectPiece: (pos: Position) => {
    const { board, currentTurn } = get();
    const piece = board[pos[1]][pos[0]];
    if (!piece || piece.side !== currentTurn) {
      set({ selectedPiece: null, validMoves: [] });
      return;
    }
    const moves = getValidMoves(board, piece).filter(move =>
      isMoveLegal(board, piece, move)
    );
    set({ selectedPiece: piece, validMoves: moves });
    playSelect();
  },

  movePiece: (to: Position) => {
    const { board, selectedPiece, currentTurn, moveHistory, gameStatus } = get();
    if (!selectedPiece) return;

    const isValid = get().validMoves.some(m => m[0] === to[0] && m[1] === to[1]);
    if (!isValid) return;

    if (!isMoveLegal(board, selectedPiece, to)) return;

    const newBoard = cloneBoard(board);
    const from = selectedPiece.position;
    const captured = newBoard[to[1]][to[0]];

    newBoard[to[1]][to[0]] = { ...selectedPiece, position: to };
    newBoard[from[1]][from[0]] = null;

    const nextTurn = currentTurn === 'red' ? 'black' : 'red';
    const record: MoveRecord = {
      piece: selectedPiece,
      from,
      to,
      captured,
      prevStatus: gameStatus,
    };

    let newStatus: typeof gameStatus = 'playing';
    if (isInCheck(newBoard, nextTurn)) {
      newStatus = isCheckmate(newBoard, nextTurn) ? 'checkmate' : 'check';
    }

    if (captured) {
      playCapture();
    } else {
      playMove();
    }
    if (newStatus === 'check') {
      playCheck();
    } else if (newStatus === 'checkmate') {
      playCheckmate();
    }

    set({
      board: newBoard,
      currentTurn: nextTurn,
      selectedPiece: null,
      validMoves: [],
      gameStatus: newStatus,
      moveHistory: [...moveHistory, record],
    });
  },

  undoMove: () => {
    const { moveHistory, mode } = get();
    if (moveHistory.length === 0) return;

    // PVE 模式下悔棋一次性回退两步（用户步 + AI 步）
    const steps = mode === 'pve' && moveHistory.length >= 2 ? 2 : 1;
    const newBoard = cloneBoard(get().board);

    for (let i = 0; i < steps; i++) {
      const record = moveHistory[moveHistory.length - 1 - i];
      newBoard[record.from[1]][record.from[0]] = record.piece;
      newBoard[record.to[1]][record.to[0]] = record.captured;
    }

    const lastUndone = moveHistory[moveHistory.length - steps];

    set({
      board: newBoard,
      currentTurn: lastUndone.piece.side,
      selectedPiece: null,
      validMoves: [],
      gameStatus: lastUndone.prevStatus,
      moveHistory: moveHistory.slice(0, -steps),
    });
  },

  resetGame: () => {
    set({
      board: createInitialBoard(),
      currentTurn: 'red',
      selectedPiece: null,
      validMoves: [],
      gameStatus: 'playing',
      moveHistory: [],
    });
  },

  setMode: (mode) => set({ mode }),
  setAILevel: (aiLevel) => set({ aiLevel }),
}));
