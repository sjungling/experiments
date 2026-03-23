import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { WireColorGuide } from './components/WireColorGuide';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Wiring Diagram Tool</h1>
        <span className="app-subtitle">
          Interactive house electrical wiring planner
        </span>
      </header>
      <div className="app-body">
        <Toolbar />
        <Canvas />
      </div>
      <WireColorGuide />
    </div>
  );
}

export default App;
