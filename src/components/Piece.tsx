import type { Piece as PieceType } from '../types';

interface PieceProps {
  piece: PieceType;
  isSelected: boolean;
  onClick: () => void;
}

const PIECE_SIZE = 36;
const BOARD_OFFSET_X = 40;
const BOARD_OFFSET_Y = 40;
const CELL_SIZE = 50;

export function PieceComponent({ piece, isSelected, onClick }: PieceProps) {
  const cx = BOARD_OFFSET_X + piece.position[0] * CELL_SIZE;
  const cy = BOARD_OFFSET_Y + piece.position[1] * CELL_SIZE;
  const text = getPieceText(piece.type, piece.side);

  return (
    <g
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      transform={`translate(${cx}, ${cy})`}
    >
      <circle
        r={PIECE_SIZE / 2}
        fill={piece.side === 'red' ? '#fff0f0' : '#f0f0f0'}
        stroke={isSelected ? '#ff6600' : piece.side === 'red' ? '#cc0000' : '#000000'}
        strokeWidth={isSelected ? 3 : 2}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill={piece.side === 'red' ? '#cc0000' : '#000000'}
        fontSize={18}
        fontWeight="bold"
      >
        {text}
      </text>
    </g>
  );
}

function getPieceText(type: string, side: string): string {
  const map: Record<string, [string, string]> = {
    king: ['帅', '将'],
    advisor: ['仕', '士'],
    bishop: ['相', '象'],
    knight: ['傌', '馬'],
    rook: ['俥', '車'],
    cannon: ['炮', '砲'],
    pawn: ['兵', '卒'],
  };
  return map[type]?.[side === 'red' ? 0 : 1] ?? type;
}
