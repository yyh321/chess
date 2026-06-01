export type Side = 'red' | 'black';
export type Position = [number, number];

export type PieceType =
  | 'king'
  | 'advisor'
  | 'bishop'
  | 'knight'
  | 'rook'
  | 'cannon'
  | 'pawn';

export interface Piece {
  id: string;
  type: PieceType;
  side: Side;
  position: Position;
}

export type BoardState = (Piece | null)[][];

export interface MoveRecord {
  piece: Piece;
  from: Position;
  to: Position;
  captured: Piece | null;
  prevStatus: GameStatus;
}

export type GameMode = 'pvp' | 'pve';
export type GameStatus = 'idle' | 'playing' | 'check' | 'checkmate' | 'stalemate';
export type AILevel = 1 | 2 | 3;
