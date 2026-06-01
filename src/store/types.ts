import type { BoardState, Position, GameMode, GameStatus, AILevel, Side, MoveRecord } from '../types';

export interface GameStore {
  board: BoardState;
  currentTurn: Side;
  selectedPiece: { type: string; side: Side; position: Position } | null;
  validMoves: Position[];
  gameStatus: GameStatus;
  moveHistory: MoveRecord[];
  mode: GameMode;
  playerSide: Side;
  aiLevel: AILevel;

  selectPiece: (pos: Position) => void;
  movePiece: (to: Position) => void;
  undoMove: () => void;
  resetGame: () => void;
  setMode: (mode: GameMode) => void;
  setAILevel: (level: AILevel) => void;
}
