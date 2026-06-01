import { useGameStore } from '../store/gameStore';

export function GameInfo() {
  const { currentTurn, gameStatus, mode, moveHistory } = useGameStore();
  return (
    <div style={{ padding: 16, minWidth: 200 }}>
      <h2>中国象棋</h2>
      <p>模式: {mode === 'pvp' ? '双人对战' : '人机对战'}</p>
      <p>当前回合: {currentTurn === 'red' ? '红方' : '黑方'}</p>
      <p>状态: {statusText(gameStatus)}</p>
      <p>步数: {moveHistory.length}</p>
    </div>
  );
}

function statusText(status: string): string {
  const map: Record<string, string> = {
    idle: '空闲',
    playing: '进行中',
    check: '将军！',
    checkmate: '将死，游戏结束',
    stalemate: '和棋',
  };
  return map[status] ?? status;
}
