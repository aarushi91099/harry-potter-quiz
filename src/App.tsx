import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { QuizRunner } from './pages/QuizRunner';
import { Results } from './pages/Results';
import { Achievements } from './pages/Achievements';
import { Leaderboard } from './pages/Leaderboard';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter basename="/harry-potter-quiz">
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="play/:modeId" element={<QuizRunner />} />
          <Route path="results" element={<Results />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
