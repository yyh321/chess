import { Board } from './components/Board';
import { GameInfo } from './components/GameInfo';
import { Controls } from './components/Controls';

function App() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div>
        <Board />
      </div>
      <div>
        <GameInfo />
        <Controls />
      </div>
    </div>
  );
}

export default App;
