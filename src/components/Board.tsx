import { useGameStore } from '../store/gameStore';
import { PieceComponent } from './Piece';

const BOARD_OFFSET_X = 40;
const BOARD_OFFSET_Y = 40;
const CELL_SIZE = 50;
const BOARD_W = 8 * CELL_SIZE;
const BOARD_H = 9 * CELL_SIZE;

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
    <svg viewBox={`0 0 ${BOARD_W + 80} ${BOARD_H + 80}`} style={{ width: '100%', maxWidth: 520, height: 'auto' }} onClick={handleBoardClick}>
      <rect x={10} y={10} width={BOARD_W + 60} height={BOARD_H + 60} fill="#f5deb3" rx={4} />

      {Array.from({ length: 10 }, (_, i) => (
        <line
          key={`h${i}`}
          x1={BOARD_OFFSET_X}
          y1={BOARD_OFFSET_Y + i * CELL_SIZE}
          x2={BOARD_OFFSET_X + BOARD_W}
          y2={BOARD_OFFSET_Y + i * CELL_SIZE}
          stroke="#333"
          strokeWidth={1}
        />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={BOARD_OFFSET_X + i * CELL_SIZE}
          y1={BOARD_OFFSET_Y}
          x2={BOARD_OFFSET_X + i * CELL_SIZE}
          y2={BOARD_OFFSET_Y + BOARD_H}
          stroke="#333"
          strokeWidth={1}
        />
      ))}

      <line
        x1={BOARD_OFFSET_X}
        y1={BOARD_OFFSET_Y + 4 * CELL_SIZE}
        x2={BOARD_OFFSET_X}
        y2={BOARD_OFFSET_Y + 5 * CELL_SIZE}
        stroke="#f5deb3"
        strokeWidth={2}
      />
      <line
        x1={BOARD_OFFSET_X + BOARD_W}
        y1={BOARD_OFFSET_Y + 4 * CELL_SIZE}
        x2={BOARD_OFFSET_X + BOARD_W}
        y2={BOARD_OFFSET_Y + 5 * CELL_SIZE}
        stroke="#f5deb3"
        strokeWidth={2}
      />

      <line x1={BOARD_OFFSET_X + 3 * CELL_SIZE} y1={BOARD_OFFSET_Y} x2={BOARD_OFFSET_X + 5 * CELL_SIZE} y2={BOARD_OFFSET_Y + 2 * CELL_SIZE} stroke="#333" />
      <line x1={BOARD_OFFSET_X + 5 * CELL_SIZE} y1={BOARD_OFFSET_Y} x2={BOARD_OFFSET_X + 3 * CELL_SIZE} y2={BOARD_OFFSET_Y + 2 * CELL_SIZE} stroke="#333" />
      <line x1={BOARD_OFFSET_X + 3 * CELL_SIZE} y1={BOARD_OFFSET_Y + 7 * CELL_SIZE} x2={BOARD_OFFSET_X + 5 * CELL_SIZE} y2={BOARD_OFFSET_Y + 9 * CELL_SIZE} stroke="#333" />
      <line x1={BOARD_OFFSET_X + 5 * CELL_SIZE} y1={BOARD_OFFSET_Y + 7 * CELL_SIZE} x2={BOARD_OFFSET_X + 3 * CELL_SIZE} y2={BOARD_OFFSET_Y + 9 * CELL_SIZE} stroke="#333" />

      {validMoves.map(([x, y]) => (
        <circle
          key={`m${x}-${y}`}
          cx={BOARD_OFFSET_X + x * CELL_SIZE}
          cy={BOARD_OFFSET_Y + y * CELL_SIZE}
          r={6}
          fill="rgba(0, 128, 0, 0.5)"
          pointerEvents="none"
        />
      ))}

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
