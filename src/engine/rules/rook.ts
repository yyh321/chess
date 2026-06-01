import type { BoardState, Piece, Position } from '../../types';
import { inBounds } from '../board';

export function getRookMoves(board: BoardState, piece: Piece): Position[] {
  const [px, py] = piece.position;
  const moves: Position[] = [];
  const directions: Position[] = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  for (const [dx, dy] of directions) {
    let x = px + dx;
    let y = py + dy;
    while (inBounds([x, y])) {
      const target = board[y][x];
      if (!target) {
        moves.push([x, y]);
      } else {
        if (target.side !== piece.side) {
          moves.push([x, y]);
        }
        break;
      }
      x += dx;
      y += dy;
    }
  }
  return moves;
}
