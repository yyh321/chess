import type { BoardState, Piece, Position, Side } from '../types';
import type { PieceType } from '../types';

export function createInitialBoard(): BoardState {
  const board: BoardState = Array.from({ length: 10 }, () => Array(9).fill(null));

  const setup = (y: number, side: Side) => {
    const s = side === 'red' ? 'r' : 'b';
    const pieces: [number, PieceType][] = [
      [0, 'rook'], [1, 'knight'], [2, 'bishop'], [3, 'advisor'],
      [4, 'king'], [5, 'advisor'], [6, 'bishop'], [7, 'knight'], [8, 'rook'],
    ];
    pieces.forEach(([x, type]) => {
      board[y][x] = { id: `${s}_${type}_${x}`, type, side, position: [x, y] };
    });
    board[y === 0 ? 2 : 7][1] = { id: `${s}_cannon_1`, type: 'cannon', side, position: [1, y === 0 ? 2 : 7] };
    board[y === 0 ? 2 : 7][7] = { id: `${s}_cannon_7`, type: 'cannon', side, position: [7, y === 0 ? 2 : 7] };
    for (let x = 0; x < 9; x += 2) {
      const py = y === 0 ? 3 : 6;
      board[py][x] = { id: `${s}_pawn_${x}`, type: 'pawn', side, position: [x, py] };
    }
  };

  setup(0, 'red');
  setup(9, 'black');
  return board;
}

export function inBounds(pos: Position): boolean {
  const [x, y] = pos;
  return x >= 0 && x <= 8 && y >= 0 && y <= 9;
}

export function cloneBoard(board: BoardState): BoardState {
  return board.map(row =>
    row.map(piece => (piece ? { ...piece, position: [...piece.position] } : null))
  );
}

export function getPiece(board: BoardState, pos: Position): Piece | null {
  const [x, y] = pos;
  return board[y][x];
}

export function setPiece(board: BoardState, pos: Position, piece: Piece | null): void {
  const [x, y] = pos;
  board[y][x] = piece ? { ...piece, position: [x, y] } : null;
}
