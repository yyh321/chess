import type { BoardState, Piece, Position } from '../../types';

export function getAdvisorMoves(board: BoardState, piece: Piece): Position[] {
  const [px, py] = piece.position;
  const isRed = piece.side === 'red';
  const minY = isRed ? 0 : 7;
  const maxY = isRed ? 2 : 9;
  const moves: Position[] = [];
  const deltas: Position[] = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

  for (const [dx, dy] of deltas) {
    const x = px + dx;
    const y = py + dy;
    if (x >= 3 && x <= 5 && y >= minY && y <= maxY) {
      const target = board[y][x];
      if (!target || target.side !== piece.side) {
        moves.push([x, y]);
      }
    }
  }
  return moves;
}
