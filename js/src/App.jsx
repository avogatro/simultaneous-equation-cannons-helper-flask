import { useState, useEffect, useMemo } from 'react';
import { SimultaneousEquationCannonsState } from './Model';
import HomeView from './HomeView';
import DeckConfigView from './DeckConfigView';
import HelpView from './HelpView';
import AboutView from './AboutView';
import './index.css';

const DEFAULT_EXTRA_FUSION = [2, 3, 4, 5, 6];
const DEFAULT_EXTRA_XYZ = [2, 3, 4, 5, 6];

function App() {
  const [currentView, setCurrentView] = useState('home');
  
  // State for Deck Configuration
  const [extraFusion, setExtraFusion] = useState(() => {
    const saved = localStorage.getItem('sec_extra_fusion');
    return saved ? JSON.parse(saved) : DEFAULT_EXTRA_FUSION;
  });
  
  const [extraXyz, setExtraXyz] = useState(() => {
    const saved = localStorage.getItem('sec_extra_xyz');
    return saved ? JSON.parse(saved) : DEFAULT_EXTRA_XYZ;
  });
  
  // State for Banished Monsters
  const [banishedFusion, setBanishedFusion] = useState(() => {
    const saved = localStorage.getItem('sec_banished_fusion');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [banishedXyz, setBanishedXyz] = useState(() => {
    const saved = localStorage.getItem('sec_banished_xyz');
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate State Model (Memoized to prevent blocking main thread)
  const secState = useMemo(() => new SimultaneousEquationCannonsState(
    extraFusion,
    extraXyz,
    banishedFusion,
    banishedXyz
  ), [extraFusion, extraXyz, banishedFusion, banishedXyz]);

  // Persistence Effects
  useEffect(() => localStorage.setItem('sec_extra_fusion', JSON.stringify(extraFusion)), [extraFusion]);
  useEffect(() => localStorage.setItem('sec_extra_xyz', JSON.stringify(extraXyz)), [extraXyz]);
  useEffect(() => localStorage.setItem('sec_banished_fusion', JSON.stringify(banishedFusion)), [banishedFusion]);
  useEffect(() => localStorage.setItem('sec_banished_xyz', JSON.stringify(banishedXyz)), [banishedXyz]);

  // Parse URL Parameters for shared setups
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let updated = false;

    if (params.has('fusion')) {
      const f = params.get('fusion').split(',').map(n => parseInt(n)).filter(n => !isNaN(n));
      if (f.length > 0) {
        setExtraFusion(f);
        updated = true;
      }
    }

    if (params.has('xyz')) {
      const x = params.get('xyz').split(',').map(n => parseInt(n)).filter(n => !isNaN(n));
      if (x.length > 0) {
        setExtraXyz(x);
        updated = true;
      }
    }

    if (updated) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleResetBanished = () => {
    setBanishedFusion([]);
    setBanishedXyz([]);
  };

  const handleResetExtraDeck = () => {
    setExtraFusion(DEFAULT_EXTRA_FUSION);
    setExtraXyz(DEFAULT_EXTRA_XYZ);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView secState={secState} onResetBanished={handleResetBanished} onResetExtraDeck={handleResetExtraDeck} />;
      case 'extra':
        return (
          <DeckConfigView 
            title="Extra Deck Monsters" 
            subtitle="Select the levels/ranks available in your Extra Deck"
            fusion={extraFusion}
            setFusion={setExtraFusion}
            xyz={extraXyz}
            setXyz={setExtraXyz}
            onSave={() => setCurrentView('home')}
          />
        );
      case 'banished':
        return (
          <DeckConfigView 
            title="Banished Monsters" 
            subtitle="Select previously banished SEC targets"
            fusion={banishedFusion}
            setFusion={setBanishedFusion}
            xyz={banishedXyz}
            setXyz={setBanishedXyz}
            onSave={() => setCurrentView('home')}
            showReset={true}
          />
        );
      case 'help':
        return <HelpView />;
      case 'about':
        return <AboutView />;
      default:
        return <HomeView secState={secState} onResetBanished={handleResetBanished} onResetExtraDeck={handleResetExtraDeck} />;
    }
  };

  return (
    <div className="app-container">
      <nav className="glass-container" id="navbar">
        <div className="logo-container">
          <button className="logo-btn" onClick={() => setCurrentView('home')}>
            <img src={`${import.meta.env.BASE_URL}img/icon.webp`} alt="logo" className="logo-img" />
          </button>
        </div>
        <button 
          className={`nav-bar-url ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentView('home')}
        >
          Main
        </button>
        <button 
          className={`nav-bar-url ${currentView === 'extra' ? 'active' : ''}`}
          onClick={() => setCurrentView('extra')}
        >
          Extra Deck
        </button>
        <button 
          className={`nav-bar-url ${currentView === 'banished' ? 'active' : ''}`}
          onClick={() => setCurrentView('banished')}
        >
          Banished Monsters
        </button>
        <button 
          className={`nav-bar-url ${currentView === 'help' ? 'active' : ''}`}
          onClick={() => setCurrentView('help')}
        >
          Help
        </button>
        <button 
          className={`nav-bar-url ${currentView === 'about' ? 'active' : ''}`}
          onClick={() => setCurrentView('about')}
        >
          About
        </button>
      </nav>

      <main className="view-enter">
        {renderView()}
      </main>

      <footer className="footer" style={{ marginTop: 'auto', padding: '2rem 0', textAlign: 'center' }}>
        <label htmlFor="author">
          2025 Created by <a href="https://github.com/avogatro/" className="author" id="author" style={{ color: 'var(--color-6)', textDecoration: 'none', fontWeight: 'bold' }}>Avogatro</a>
        </label>
      </footer>
    </div>
  );
}

export default App;
