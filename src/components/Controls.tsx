import { useGameStore } from '../store/gameStore';

export function Controls() {
  const { undoMove, resetGame, mode, setMode, aiLevel, setAILevel } = useGameStore();
  return (
    <div style={{ padding: 16 }}>
      <button onClick={undoMove}>悔棋</button>
      <button onClick={resetGame} style={{ marginLeft: 8 }}>重新开始</button>
      <div style={{ marginTop: 12 }}>
        <label>模式: </label>
        <select value={mode} onChange={e => setMode(e.target.value as 'pvp' | 'pve')}>
          <option value="pvp">双人对战</option>
          <option value="pve">人机对战</option>
        </select>
      </div>
      {mode === 'pve' && (
        <div style={{ marginTop: 8 }}>
          <label>AI 难度: </label>
          <select value={aiLevel} onChange={e => setAILevel(Number(e.target.value) as 1 | 2 | 3)}>
            <option value={1}>简单</option>
            <option value={2}>中等</option>
            <option value={3}>困难</option>
          </select>
        </div>
      )}
    </div>
  );
}
