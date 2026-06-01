import type { BoardState, Piece, Position } from '../../types';
import { inBounds } from '../board';

export function getBishopMoves(board: BoardState, piece: Piece): Position[] {
  const [px, py] = piece.position;
  const isRed = piece.side === 'red';
  const riverLimit = isRed ? 4 : 5;
  const moves: Position[] = [];
  const deltas: Position[] = [[2, 2], [2, -2], [-2, 2], [-2, -2]];

  for (const [dx, dy] of deltas) {
    const eyeX = px + dx / 2;
    const eyeY = py + dy / 2;
    const x = px + dx;
    const y = py + dy;
    if (inBounds([x, y]) && !board[eyeY][eyeX] && (isRed ? y <= riverLimit : y >= riverLimit)) {
      const target = board[y][x];
      if (!target || target.side !== piece.side) {
        moves.push([x, y]);
      }
    }
  }
  return moves;
}
