import { useGameStore } from '../store/gameStore';
import { PieceComponent, BOARD_OFFSET_X, BOARD_OFFSET_Y, CELL_SIZE } from './Piece';

const BOARD_W = 8 * CELL_SIZE;
const BOARD_H = 9 * CELL_SIZE;
const PADDING = 56;

export function Board() {
  const board = useGameStore(s => s.board);
  const selectedPiece = useGameStore(s => s.selectedPiece);
  const validMoves = useGameStore(s => s.validMoves);
  const selectPiece = useGameStore(s => s.selectPiece);
  const movePiece = useGameStore(s => s.movePiece);

  const handleBoardClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!validMoves.length) return;
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const loc = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    const x = Math.round((loc.x - BOARD_OFFSET_X) / CELL_SIZE);
    const y = Math.round((loc.y - BOARD_OFFSET_Y) / CELL_SIZE);
    if (x >= 0 && x <= 8 && y >= 0 && y <= 9) {
      movePiece([x, y]);
    }
  };

  return (
    <svg
      viewBox={`0 0 ${BOARD_W + PADDING * 2} ${BOARD_H + PADDING * 2}`}
      style={{ width: '100%', maxWidth: 680, height: 'auto', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))' }}
      onClick={handleBoardClick}
    >
      {/* Background */}
      <rect
        x={8}
        y={8}
        width={BOARD_W + PADDING * 2 - 16}
        height={BOARD_H + PADDING * 2 - 16}
        fill="#e8d5a3"
        rx={8}
        stroke="#c4a265"
        strokeWidth={3}
      />
      <rect
        x={16}
        y={16}
        width={BOARD_W + PADDING * 2 - 32}
        height={BOARD_H + PADDING * 2 - 32}
        fill="#f0dcb0"
        rx={4}
      />

      {/* Board inner margin */}
      <rect
        x={BOARD_OFFSET_X - 12}
        y={BOARD_OFFSET_Y - 12}
        width={BOARD_W + 24}
        height={BOARD_H + 24}
        fill="none"
        stroke="#b8956a"
        strokeWidth={2}
        rx={2}
      />

      {/* Grid lines */}
      {Array.from({ length: 10 }, (_, i) => (
        <line
          key={`h${i}`}
          x1={BOARD_OFFSET_X}
          y1={BOARD_OFFSET_Y + i * CELL_SIZE}
          x2={BOARD_OFFSET_X + BOARD_W}
          y2={BOARD_OFFSET_Y + i * CELL_SIZE}
          stroke="#5c3a1e"
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={BOARD_OFFSET_X + i * CELL_SIZE}
          y1={BOARD_OFFSET_Y}
          x2={BOARD_OFFSET_X + i * CELL_SIZE}
          y2={BOARD_OFFSET_Y + BOARD_H}
          stroke="#5c3a1e"
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      ))}

      {/* River gap - erase vertical lines */}
      <line
        x1={BOARD_OFFSET_X - 1}
        y1={BOARD_OFFSET_Y + 4 * CELL_SIZE}
        x2={BOARD_OFFSET_X - 1}
        y2={BOARD_OFFSET_Y + 5 * CELL_SIZE}
        stroke="#f0dcb0"
        strokeWidth={4}
      />
      <line
        x1={BOARD_OFFSET_X + BOARD_W + 1}
        y1={BOARD_OFFSET_Y + 4 * CELL_SIZE}
        x2={BOARD_OFFSET_X + BOARD_W + 1}
        y2={BOARD_OFFSET_Y + 5 * CELL_SIZE}
        stroke="#f0dcb0"
        strokeWidth={4}
      />

      {/* River text */}
      <text
        x={BOARD_OFFSET_X + BOARD_W / 2 - CELL_SIZE * 1.8}
        y={BOARD_OFFSET_Y + 4.55 * CELL_SIZE}
        fill="#5c3a1e"
        fontSize={22}
        fontWeight="bold"
        opacity={0.7}
        style={{ fontFamily: '"KaiTi", "STKaiti", "楷体", serif' }}
      >
        楚 河
      </text>
      <text
        x={BOARD_OFFSET_X + BOARD_W / 2 + CELL_SIZE * 0.3}
        y={BOARD_OFFSET_Y + 4.55 * CELL_SIZE}
        fill="#5c3a1e"
        fontSize={22}
        fontWeight="bold"
        opacity={0.7}
        style={{ fontFamily: '"KaiTi", "STKaiti", "楷体", serif' }}
      >
        汉 界
      </text>

      {/* Palace diagonals */}
      <line
        x1={BOARD_OFFSET_X + 3 * CELL_SIZE}
        y1={BOARD_OFFSET_Y}
        x2={BOARD_OFFSET_X + 5 * CELL_SIZE}
        y2={BOARD_OFFSET_Y + 2 * CELL_SIZE}
        stroke="#5c3a1e"
        strokeWidth={1.2}
      />
      <line
        x1={BOARD_OFFSET_X + 5 * CELL_SIZE}
        y1={BOARD_OFFSET_Y}
        x2={BOARD_OFFSET_X + 3 * CELL_SIZE}
        y2={BOARD_OFFSET_Y + 2 * CELL_SIZE}
        stroke="#5c3a1e"
        strokeWidth={1.2}
      />
      <line
        x1={BOARD_OFFSET_X + 3 * CELL_SIZE}
        y1={BOARD_OFFSET_Y + 7 * CELL_SIZE}
        x2={BOARD_OFFSET_X + 5 * CELL_SIZE}
        y2={BOARD_OFFSET_Y + 9 * CELL_SIZE}
        stroke="#5c3a1e"
        strokeWidth={1.2}
      />
      <line
        x1={BOARD_OFFSET_X + 5 * CELL_SIZE}
        y1={BOARD_OFFSET_Y + 7 * CELL_SIZE}
        x2={BOARD_OFFSET_X + 3 * CELL_SIZE}
        y2={BOARD_OFFSET_Y + 9 * CELL_SIZE}
        stroke="#5c3a1e"
        strokeWidth={1.2}
      />

      {/* Cross markers at cannon and pawn positions */}
      {[
        [1, 2], [7, 2], [1, 7], [7, 7],
        [0, 3], [2, 3], [4, 3], [6, 3], [8, 3],
        [0, 6], [2, 6], [4, 6], [6, 6], [8, 6],
      ].map(([x, y]) => (
        <g key={`cross-${x}-${y}`}>
          <line x1={BOARD_OFFSET_X + x * CELL_SIZE - 5} y1={BOARD_OFFSET_Y + y * CELL_SIZE - 2} x2={BOARD_OFFSET_X + x * CELL_SIZE - 2} y2={BOARD_OFFSET_Y + y * CELL_SIZE - 2} stroke="#5c3a1e" strokeWidth={1} />
          <line x1={BOARD_OFFSET_X + x * CELL_SIZE - 2} y1={BOARD_OFFSET_Y + y * CELL_SIZE - 5} x2={BOARD_OFFSET_X + x * CELL_SIZE - 2} y2={BOARD_OFFSET_Y + y * CELL_SIZE - 2} stroke="#5c3a1e" strokeWidth={1} />
          <line x1={BOARD_OFFSET_X + x * CELL_SIZE + 5} y1={BOARD_OFFSET_Y + y * CELL_SIZE - 2} x2={BOARD_OFFSET_X + x * CELL_SIZE + 2} y2={BOARD_OFFSET_Y + y * CELL_SIZE - 2} stroke="#5c3a1e" strokeWidth={1} />
          <line x1={BOARD_OFFSET_X + x * CELL_SIZE + 2} y1={BOARD_OFFSET_Y + y * CELL_SIZE - 5} x2={BOARD_OFFSET_X + x * CELL_SIZE + 2} y2={BOARD_OFFSET_Y + y * CELL_SIZE - 2} stroke="#5c3a1e" strokeWidth={1} />
          <line x1={BOARD_OFFSET_X + x * CELL_SIZE - 5} y1={BOARD_OFFSET_Y + y * CELL_SIZE + 2} x2={BOARD_OFFSET_X + x * CELL_SIZE - 2} y2={BOARD_OFFSET_Y + y * CELL_SIZE + 2} stroke="#5c3a1e" strokeWidth={1} />
          <line x1={BOARD_OFFSET_X + x * CELL_SIZE - 2} y1={BOARD_OFFSET_Y + y * CELL_SIZE + 5} x2={BOARD_OFFSET_X + x * CELL_SIZE - 2} y2={BOARD_OFFSET_Y + y * CELL_SIZE + 2} stroke="#5c3a1e" strokeWidth={1} />
          <line x1={BOARD_OFFSET_X + x * CELL_SIZE + 5} y1={BOARD_OFFSET_Y + y * CELL_SIZE + 2} x2={BOARD_OFFSET_X + x * CELL_SIZE + 2} y2={BOARD_OFFSET_Y + y * CELL_SIZE + 2} stroke="#5c3a1e" strokeWidth={1} />
          <line x1={BOARD_OFFSET_X + x * CELL_SIZE + 2} y1={BOARD_OFFSET_Y + y * CELL_SIZE + 5} x2={BOARD_OFFSET_X + x * CELL_SIZE + 2} y2={BOARD_OFFSET_Y + y * CELL_SIZE + 2} stroke="#5c3a1e" strokeWidth={1} />
        </g>
      ))}

      {/* Valid move indicators */}
      {validMoves.map(([x, y]) => {
        const cx = BOARD_OFFSET_X + x * CELL_SIZE;
        const cy = BOARD_OFFSET_Y + y * CELL_SIZE;
        const hasPiece = board[y][x] !== null;
        return hasPiece ? (
          <circle
            key={`m${x}-${y}`}
            cx={cx}
            cy={cy}
            r={22}
            fill="none"
            stroke="rgba(255, 149, 0, 0.7)"
            strokeWidth={3}
            pointerEvents="none"
          />
        ) : (
          <circle
            key={`m${x}-${y}`}
            cx={cx}
            cy={cy}
            r={7}
            fill="rgba(76, 175, 80, 0.7)"
            pointerEvents="none"
          />
        );
      })}

      {/* Pieces */}
      {board.flat().map(piece =>
        piece ? (
          <PieceComponent
            key={piece.id}
            piece={piece}
            isSelected={selectedPiece?.id === piece.id}
            onClick={() => selectPiece(piece.position)}
          />
        ) : null
      )}
    </svg>
  );
}
