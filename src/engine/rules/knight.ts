import type { BoardState, Piece, Position } from '../../types';
import { inBounds } from '../board';

export function getKnightMoves(board: BoardState, piece: Piece): Position[] {
  const [px, py] = piece.position;
  const moves: Position[] = [];
  const deltas: [Position, Position][] = [
    [[0, 1], [1, 2]], [[0, 1], [-1, 2]],
    [[0, -1], [1, -2]], [[0, -1], [-1, -2]],
    [[1, 0], [2, 1]], [[1, 0], [2, -1]],
    [[-1, 0], [-2, 1]], [[-1, 0], [-2, -1]],
  ];

  for (const [[dx1, dy1], [dx2, dy2]] of deltas) {
    const blockX = px + dx1;
    const blockY = py + dy1;
    if (inBounds([blockX, blockY]) && !board[blockY][blockX]) {
      const x = px + dx2;
      const y = py + dy2;
      if (inBounds([x, y])) {
        const target = board[y][x];
        if (!target || target.side !== piece.side) {
          moves.push([x, y]);
        }
      }
    }
  }
  return moves;
}
