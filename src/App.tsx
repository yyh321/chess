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
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f0e6 0%, #e8dfd0 100%)',
    padding: '24px 16px',
  },
  layout: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
    alignItems: 'flex-start',
    maxWidth: 960,
    margin: '0 auto',
  },
  boardArea: {
    flexShrink: 0,
  },
  sidebar: {
    minWidth: 240,
    maxWidth: 280,
    flex: 1,
  },
};

export default App;
