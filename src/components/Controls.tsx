import { useGameStore } from '../store/gameStore';

export function Controls() {
  const { undoMove, resetGame, mode, setMode, aiLevel, setAILevel } = useGameStore();
  return (
    <div style={styles.container}>
      <div style={styles.buttonRow}>
        <button style={styles.button} onClick={undoMove}>悔棋</button>
        <button style={styles.secondaryButton} onClick={resetGame}>重新开始</button>
      </div>
      <div style={styles.field}>
        <label style={styles.label}>模式</label>
        <select style={styles.select} value={mode} onChange={e => setMode(e.target.value as 'pvp' | 'pve')}>
          <option value="pvp">双人对战</option>
          <option value="pve">人机对战</option>
        </select>
      </div>
      {mode === 'pve' && (
        <div style={styles.field}>
          <label style={styles.label}>AI 难度</label>
          <select style={styles.select} value={aiLevel} onChange={e => setAILevel(Number(e.target.value) as 1 | 2 | 3)}>
            <option value={1}>简单</option>
            <option value={2}>中等</option>
            <option value={3}>困难</option>
          </select>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 14,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  },
  buttonRow: {
    display: 'flex',
    gap: 10,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    padding: '10px 0',
    fontSize: 15,
    cursor: 'pointer',
    border: 'none',
    borderRadius: 8,
    background: '#c41e3a',
    color: '#fff',
    fontWeight: 'bold',
    transition: 'background 0.2s',
  },
  secondaryButton: {
    flex: 1,
    padding: '10px 0',
    fontSize: 15,
    cursor: 'pointer',
    border: '1px solid #ddd',
    borderRadius: 8,
    background: '#fff',
    color: '#333',
    fontWeight: 'bold',
    transition: 'background 0.2s',
  },
  field: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderTop: '1px solid #f0f0f0',
  },
  label: {
    color: '#666',
    fontSize: 14,
  },
  select: {
    padding: '6px 10px',
    fontSize: 14,
    borderRadius: 6,
    border: '1px solid #ddd',
    background: '#fff',
  },
};
