import type { Piece as PieceType } from '../types';

interface PieceProps {
  piece: PieceType;
  isSelected: boolean;
  onClick: () => void;
}

const PIECE_SIZE = 46;
const BOARD_OFFSET_X = 48;
const BOARD_OFFSET_Y = 48;
const CELL_SIZE = 62;

export { BOARD_OFFSET_X, BOARD_OFFSET_Y, CELL_SIZE, PIECE_SIZE };

export function PieceComponent({ piece, isSelected, onClick }: PieceProps) {
  const cx = BOARD_OFFSET_X + piece.position[0] * CELL_SIZE;
  const cy = BOARD_OFFSET_Y + piece.position[1] * CELL_SIZE;
  const text = getPieceText(piece.type, piece.side);
  const isRed = piece.side === 'red';

  return (
    <g
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      transform={`translate(${cx}, ${cy})`}
    >
      {/* Shadow */}
      <circle
        r={PIECE_SIZE / 2}
        fill="rgba(0,0,0,0.15)"
        transform="translate(2, 2)"
      />
      {/* Outer ring */}
      <circle
        r={PIECE_SIZE / 2}
        fill={isRed ? '#fff5f5' : '#f8f8f8'}
        stroke={isSelected ? '#ff9500' : isRed ? '#c41e3a' : '#1a1a1a'}
        strokeWidth={isSelected ? 3.5 : 2.5}
      />
      {/* Inner ring for depth */}
      <circle
        r={PIECE_SIZE / 2 - 3}
        fill="none"
        stroke={isRed ? '#e8a0a0' : '#999999'}
        strokeWidth={0.8}
        opacity={0.6}
      />
      {/* Selection glow */}
      {isSelected && (
        <circle
          r={PIECE_SIZE / 2 + 4}
          fill="none"
          stroke="#ff9500"
          strokeWidth={2}
          opacity={0.4}
          strokeDasharray="4 2"
        />
      )}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill={isRed ? '#c41e3a' : '#1a1a1a'}
        fontSize={22}
        fontWeight="bold"
        style={{ userSelect: 'none', fontFamily: '"KaiTi", "STKaiti", "楷体", serif' }}
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
