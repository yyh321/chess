import type { BoardState, Piece, Position } from '../../types';
import { inBounds } from '../board';

export function getPawnMoves(board: BoardState, piece: Piece): Position[] {
  const [px, py] = piece.position;
  const isRed = piece.side === 'red';
  const forward: Position = isRed ? [0, 1] : [0, -1];
  const riverCrossed = isRed ? py >= 5 : py <= 4;
  const directions: Position[] = [forward];
  if (riverCrossed) {
    directions.push([1, 0], [-1, 0]);
  }

  const moves: Position[] = [];
  for (const [dx, dy] of directions) {
    const x = px + dx;
    const y = py + dy;
    if (inBounds([x, y])) {
      const target = board[y][x];
      if (!target || target.side !== piece.side) {
        moves.push([x, y]);
      }
    }
  }
  return moves;
}
