import { useGameStore } from '../store/gameStore';

export function GameInfo() {
  const { currentTurn, gameStatus, mode, moveHistory } = useGameStore();
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>中国象棋</h2>
      <div style={styles.row}>
        <span style={styles.label}>模式</span>
        <span style={styles.value}>{mode === 'pvp' ? '双人对战' : '人机对战'}</span>
      </div>
      <div style={styles.row}>
        <span style={styles.label}>当前回合</span>
        <span style={{ ...styles.value, color: currentTurn === 'red' ? '#c41e3a' : '#1a1a1a' }}>
          {currentTurn === 'red' ? '红方' : '黑方'}
        </span>
      </div>
      <div style={styles.row}>
        <span style={styles.label}>状态</span>
        <span style={{ ...styles.value, fontWeight: 'bold', color: gameStatus === 'check' ? '#ff6600' : '#333' }}>
          {statusText(gameStatus)}
        </span>
      </div>
      <div style={styles.row}>
        <span style={styles.label}>步数</span>
        <span style={styles.value}>{moveHistory.length}</span>
      </div>
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

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 14,
    minWidth: 0,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    marginBottom: 16,
  },
  title: {
    margin: '0 0 16px 0',
    fontSize: 24,
    color: '#5c3a1e',
    fontFamily: '"KaiTi", "STKaiti", "楷体", serif',
    textAlign: 'center',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  label: {
    color: '#888',
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: 500,
  },
};
