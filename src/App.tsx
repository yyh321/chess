import { Board } from './components/Board';
import { GameInfo } from './components/GameInfo';
import { Controls } from './components/Controls';
import { useAI } from './hooks/useAI';

function App() {
  useAI();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', padding: 16 }}>
      <div style={{ flexShrink: 0 }}>
        <Board />
      </div>
      <div style={{ minWidth: 200 }}>
        <GameInfo />
        <Controls />
      </div>
    </div>
  );
}

export default App;
