import type { BoardState, Position, Side } from '../../types';
import { getValidMoves } from './index';

export function isPositionUnderAttack(board: BoardState, pos: Position, bySide: Side): boolean {
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (piece && piece.side === bySide) {
        const moves = getValidMoves(board, piece);
        if (moves.some(m => m[0] === pos[0] && m[1] === pos[1])) {
          return true;
        }
      }
    }
  }
  return false;
}

export function isInCheck(board: BoardState, side: Side): boolean {
  let kingPos: Position | null = null;
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (piece && piece.side === side && piece.type === 'king') {
        kingPos = [x, y];
        break;
      }
    }
    if (kingPos) break;
  }
  if (!kingPos) return false;
  return isPositionUnderAttack(board, kingPos, side === 'red' ? 'black' : 'red');
}

export function isCheckmate(board: BoardState, side: Side): boolean {
  if (!isInCheck(board, side)) return false;
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (piece && piece.side === side) {
        const moves = getValidMoves(board, piece);
        for (const move of moves) {
          const testBoard = board.map(row => [...row]);
          testBoard[move[1]][move[0]] = { ...piece, position: move };
          testBoard[y][x] = null;
          if (!isInCheck(testBoard, side)) {
            return false;
          }
        }
      }
    }
  }
  return true;
}

export function isKingFacing(board: BoardState): boolean {
  let redKing: Position | null = null;
  let blackKing: Position | null = null;
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (piece && piece.type === 'king') {
        if (piece.side === 'red') redKing = [x, y];
        else blackKing = [x, y];
      }
    }
  }
  if (!redKing || !blackKing || redKing[0] !== blackKing[0]) return false;
  const x = redKing[0];
  for (let y = redKing[1] + 1; y < blackKing[1]; y++) {
    if (board[y][x]) return false;
  }
  return true;
}
