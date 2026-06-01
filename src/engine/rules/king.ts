import type { BoardState, Piece, Position } from '../../types';

export function getKingMoves(board: BoardState, piece: Piece): Position[] {
  const [px, py] = piece.position;
  const moves: Position[] = [];
  const isRed = piece.side === 'red';
  const minX = 3, maxX = 5;
  const minY = isRed ? 0 : 7;
  const maxY = isRed ? 2 : 9;

  const directions: Position[] = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  for (const [dx, dy] of directions) {
    const x = px + dx;
    const y = py + dy;
    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
      const target = board[y][x];
      if (!target || target.side !== piece.side) {
        moves.push([x, y]);
      }
    }
  }
  return moves;
}
