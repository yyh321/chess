import type { BoardState, Piece, Position } from '../../types';
import { getKingMoves } from './king';
import { getAdvisorMoves } from './advisor';
import { getBishopMoves } from './bishop';
import { getKnightMoves } from './knight';
import { getRookMoves } from './rook';
import { getCannonMoves } from './cannon';
import { getPawnMoves } from './pawn';

const moveMap = {
  king: getKingMoves,
  advisor: getAdvisorMoves,
  bishop: getBishopMoves,
  knight: getKnightMoves,
  rook: getRookMoves,
  cannon: getCannonMoves,
  pawn: getPawnMoves,
};

export function getValidMoves(board: BoardState, piece: Piece): Position[] {
  return moveMap[piece.type](board, piece);
}

export * from './check';
