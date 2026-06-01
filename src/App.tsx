import { Board } from './components/Board';
import { GameInfo } from './components/GameInfo';
import { Controls } from './components/Controls';
import { useAI } from './hooks/useAI';

function App() {
  useAI();
  return (
    <div style={styles.page}>
      <div style={styles.layout}>
        <div style={styles.boardArea}>
          <Board />
        </div>
        <div style={styles.sidebar}>
          <GameInfo />
          <Controls />
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    height: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #f5f0e6 0%, #e8dfd0 100%)',
    overflow: 'hidden',
  },
  layout: {
    display: 'flex',
    height: '100%',
    width: '100%',
  },
  boardArea: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    minWidth: 0,
  },
  sidebar: {
    width: 200,
    flexShrink: 0,
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    background: 'rgba(255,255,255,0.35)',
    borderLeft: '1px solid rgba(0,0,0,0.06)',
    overflowY: 'auto',
  },
};

export default App;
