import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import BracketView from './components/BracketView';
import LandingPage from './pages/LandingPage';
import SmartNavMenu from './components/SmartNavMenu';

type View = 'landing' | 'group' | 'bracket';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [refreshKey, setRefreshKey] = useState(0);

  // ── Landing page ──
  if (view === 'landing') {
    return (
      <LandingPage
        onEnterGroup={() => setView('group')}
        onEnterBracket={() => setView('bracket')}
      />
    );
  }

  // ── Group / Bracket ──
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={
          view === 'bracket'
            ? <BracketView key={`b-${refreshKey}`} />
            : <HomePage key={`g-${refreshKey}`} />
        } />
        <Route path="/analysis" element={<AnalysisPage />} />
      </Routes>

      {/* 智能上下文悬浮菜单 */}
      <SmartNavMenu
        currentPage={view === 'group' ? 'group' : 'bracket'}
        onGoHome={() => setView('landing')}
        onGoGroup={() => setView('group')}
        onGoBracket={() => setView('bracket')}
      />
    </div>
  );
}
