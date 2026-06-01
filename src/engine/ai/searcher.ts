import type { BoardState, Position, Side, Piece } from '../../types';
import { evaluateForSide } from './evaluator';
import { getValidMoves, isInCheck, isKingFacing } from '../rules';
import { cloneBoard } from '../board';

export interface AIMove {
  from: Position;
  to: Position;
  piece: Piece;
}

function isMoveLegal(board: BoardState, piece: Piece, to: Position): boolean {
  const testBoard = cloneBoard(board);
  testBoard[to[1]][to[0]] = { ...piece, position: to };
  const [fromX, fromY] = piece.position;
  testBoard[fromY][fromX] = null;
  return !isInCheck(testBoard, piece.side) && !isKingFacing(testBoard);
}

export function findBestMove(board: BoardState, side: Side, depth: number): AIMove | null {
  let bestMove: AIMove | null = null;
  let bestScore = -Infinity;

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (piece && piece.side === side) {
        const moves = getValidMoves(board, piece).filter(move => isMoveLegal(board, piece, move));
        for (const move of moves) {
          const newBoard = cloneBoard(board);
          newBoard[move[1]][move[0]] = { ...piece, position: move };
          newBoard[y][x] = null;
          const score = -negamax(newBoard, depth - 1, -Infinity, Infinity, side === 'red' ? 'black' : 'red');
          if (score > bestScore) {
            bestScore = score;
            bestMove = { from: [x, y], to: move, piece };
          }
        }
      }
    }
  }
  return bestMove;
}

function negamax(board: BoardState, depth: number, alpha: number, beta: number, side: Side): number {
  if (depth === 0) {
    return evaluateForSide(board, side);
  }

  let bestScore = -Infinity;
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (piece && piece.side === side) {
        const moves = getValidMoves(board, piece).filter(move => isMoveLegal(board, piece, move));
        for (const move of moves) {
          const newBoard = cloneBoard(board);
          newBoard[move[1]][move[0]] = { ...piece, position: move };
          newBoard[y][x] = null;
          const score = -negamax(newBoard, depth - 1, -beta, -alpha, side === 'red' ? 'black' : 'red');
          bestScore = Math.max(bestScore, score);
          alpha = Math.max(alpha, score);
          if (alpha >= beta) {
            return bestScore;
          }
        }
      }
    }
  }
  return bestScore;
}
