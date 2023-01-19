import './App.css';
import { RoutesDoria } from './routes/RoutesDoria/RoutesDoria';
import { GlobalState } from './state/GlobalState';

function App() {
  return (
    <GlobalState>
      <RoutesDoria />
    </GlobalState>
  );
}

export default App;
