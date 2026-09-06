import { useState, useEffect } from 'react'
import { Heart, Globe } from 'lucide-react'
import { db } from './firebase'
import { ref, set, onValue, update } from 'firebase/database'
import { useTranslation } from 'react-i18next'
import Home from './components/Home'
import GameSetup from './components/GameSetup'
import GameBoard from './components/GameBoard'
import EndScreen from './components/EndScreen'
import BlindRanking from './components/BlindRanking'
import StartBenchSell from './components/StartBenchSell'
import MysteryPlayer from './components/MysteryPlayer'
import JustePrix from './components/JustePrix'
import ChercheIntrus from './components/ChercheIntrus'
import JoueAvec from './components/JoueAvec'
import PlusOuMoins from './components/PlusOuMoins'
import { PREDEFINED_THEMES } from './data/themes';

const normalizeGameState = (data) => {
  if (!data) return data;
  if (data.players) {
    data.players.forEach(p => {
      if (!p.drafted) p.drafted = [];
    });
  }
  if (data.biddingState) {
    if (!data.biddingState.passedPlayers) data.biddingState.passedPlayers = [];
    if (data.biddingState.highestBidderIndex === undefined) data.biddingState.highestBidderIndex = null;
  }
  if (data.itemsPool) {
    data.itemsPool.forEach(item => {
      if (item.draftedBy === undefined) item.draftedBy = null;
    });
  }
  if (data.currentItem && data.currentItem.draftedBy === undefined) {
    data.currentItem.draftedBy = null;
  }
  if (data.teamSetups) {
    data.teamSetups.forEach(setup => {
      if (!setup.bench) setup.bench = [];
      if (!setup.starters) {
        setup.starters = new Array(11).fill(null);
      } else {
        // Firebase might have converted sparse arrays to objects or shorter arrays
        const newStarters = new Array(11).fill(null);
        Object.keys(setup.starters).forEach(key => {
          if (!isNaN(key)) newStarters[parseInt(key)] = setup.starters[key];
        });
        setup.starters = newStarters;
      }
    });
  }
  return data;
};

function App() {
  const { t, i18n } = useTranslation();
  const [screen, setScreen] = useState('home');
  // Game State
  const [selectedGameType, setSelectedGameType] = useState('football_xi');
  const [gameMode, setGameMode] = useState('local'); // 'local' or 'online'
  
  // Online state
  const [roomCode, setRoomCode] = useState(null);
  const [myPlayerName, setMyPlayerName] = useState('');
  const [myRole, setMyRole] = useState(''); // 'host' or 'join'

  // Game session state
  const [gameState, setGameState] = useState(null);
  const [history, setHistory] = useState([]);

  // Initialization from sessionStorage on first load
  useEffect(() => {
    const saved = sessionStorage.getItem('drafty_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setScreen(parsed.screen);
        setGameMode(parsed.gameMode);
        setRoomCode(parsed.roomCode);
        setMyPlayerName(parsed.myPlayerName);
        setMyRole(parsed.myRole);
        setGameState(parsed.gameState);
        
        // Re-attach Firebase listener if we were online
        if (parsed.gameMode === 'online' && parsed.roomCode) {
          const gameRef = ref(db, `rooms/${parsed.roomCode}/gameState`);
          onValue(gameRef, (snapshot) => {
            const data = normalizeGameState(snapshot.val());
            if (data) {
              setGameState(data);
              if (data.phase === 'end') {
                setScreen('end');
              } else if (data.status === 'playing') {
                setScreen('game');
              } else if (data.status === 'waiting') {
                setScreen('lobby');
              }
            }
          });
        }
      } catch(e) {
        console.error("Failed to restore session", e);
      }
    }
  }, []);

  // Save to sessionStorage whenever important state changes
  useEffect(() => {
    if (screen === 'home') {
      sessionStorage.removeItem('drafty_state');
    } else {
      sessionStorage.setItem('drafty_state', JSON.stringify({
        screen,
        gameMode,
        roomCode,
        myPlayerName,
        myRole,
        gameState
      }));
    }
  }, [screen, gameMode, roomCode, myPlayerName, myRole, gameState]);

  const handleSetGameState = (newState) => {
    if (gameState && gameState.phase === 'board') {
      setHistory([]);
    } else if (gameState) {
      setHistory(prev => [...prev, gameState]);
    }
    
    if (gameMode === 'online' && roomCode) {
      set(ref(db, `rooms/${roomCode}/gameState`), newState);
    } else {
      setGameState(newState);
    }
  };

  const handleUndo = () => {
    if (gameMode === 'online') return; // Disable undo in online mode
    if (history.length > 0) {
      const newHistory = [...history];
      const prevState = newHistory.pop();
      setGameState(prevState);
      setHistory(newHistory);
    }
  };

  const handleSelectMode = (type) => {
    if (type === 'blind_ranking') {
      setScreen('blind_ranking');
    } else if (type === 'start_bench_sell') {
      setScreen('start_bench_sell');
    } else if (type === 'mystery_player') {
      setScreen('mystery_player');
    } else if (type === 'juste_prix') {
      setScreen('juste_prix');
    } else if (type === 'cherche_intrus') {
      setScreen('cherche_intrus');
    } else if (type === 'joue_avec') {
      setScreen('joue_avec');
    } else if (type === 'plus_ou_moins') {
      setScreen('plus_ou_moins');
    } else {
      setSelectedGameType(type);
      setGameMode('local'); // Default, will change in setup
      setScreen('setup');
    }
  };

  const generateItemsPool = (setupData) => {
    if (setupData.gameType === 'football_xi') {
      const P = setupData.targetNumPlayers || setupData.players.length;
      const phases = [
        { themeId: 'football_goalkeepers', count: 1 * P, pos: 'Gardien' },
        { themeId: 'football_fullbacks', count: 1 * P, pos: 'Latéral Gauche', specificPosFilter: 'Latéral Gauche' },
        { themeId: 'football_centerbacks', count: 2 * P, pos: 'Défenseur Central' },
        { themeId: 'football_fullbacks', count: 1 * P, pos: 'Latéral Droit', specificPosFilter: 'Latéral Droit' },
        { themeId: 'football_midfielders', count: 2 * P, pos: 'Milieu Défensif', specificPosFilter: ['Milieu Défensif', 'Milieu Récupérateur'] },
        { themeId: 'football_midfielders', count: 2 * P, pos: 'Milieu Offensif', specificPosFilter: ['Milieu Offensif', 'Milieu Central'] },
        { themeId: 'football_attackers', count: Math.ceil(1.5 * P), pos: 'Ailier Gauche', specificPosFilter: 'Ailier Gauche' },
        { themeId: 'football_strikers_9', count: 2 * P, pos: 'Numéro 9' },
        { themeId: 'football_attackers', count: Math.ceil(1.5 * P), pos: 'Ailier Droit', specificPosFilter: 'Ailier Droit' }
      ];

      let pool = [];
      let currentId = 0;

      phases.forEach(phase => {
        const theme = PREDEFINED_THEMES.find(t => t.id === phase.themeId);
        let itemsToChooseFrom = theme.items;
        
        if (phase.specificPosFilter) {
          if (Array.isArray(phase.specificPosFilter)) {
            itemsToChooseFrom = itemsToChooseFrom.filter(i => phase.specificPosFilter.includes(i.specificPosition));
          } else {
            itemsToChooseFrom = itemsToChooseFrom.filter(i => i.specificPosition === phase.specificPosFilter);
          }
        }

        const trolls = itemsToChooseFrom.filter(i => i.isTroll);
        const legends = itemsToChooseFrom.filter(i => !i.isTroll);
        
        const trollCount = Math.floor(phase.count / 3);
        const legendCount = phase.count - trollCount;
        
        const shuffledTrolls = trolls.sort(() => Math.random() - 0.5).slice(0, trollCount);
        const shuffledLegends = legends.sort(() => Math.random() - 0.5).slice(0, legendCount);
        
        const phaseItems = [...shuffledTrolls, ...shuffledLegends]
          .sort(() => Math.random() - 0.5)
          .map(item => ({
            ...item,
            id: currentId++,
            revealed: false,
            draftedBy: null,
            position: phase.pos
          }));
        pool = [...pool, ...phaseItems];
      });
      return pool;
    }

    const trolls = setupData.items.filter(i => i.isTroll);
    const legends = setupData.items.filter(i => !i.isTroll);
    
    let selectedItems = [];
    if (trolls.length > 0) {
      const trollCount = Math.floor(setupData.requiredItems / 3);
      const legendCount = setupData.requiredItems - trollCount;
      
      const shuffledTrolls = trolls.sort(() => Math.random() - 0.5).slice(0, trollCount);
      const shuffledLegends = legends.sort(() => Math.random() - 0.5).slice(0, legendCount);
      
      selectedItems = [...shuffledTrolls, ...shuffledLegends].sort(() => Math.random() - 0.5);
    } else {
      selectedItems = [...setupData.items].sort(() => Math.random() - 0.5).slice(0, setupData.requiredItems);
    }
    
    return selectedItems.map((item, index) => ({
      ...item,
      id: index,
      revealed: false,
      draftedBy: null,
      position: 'Libre'
    }));
  };

  const handleStartGame = (setupData) => {    
    if (setupData.mode === 'local') {
      setGameMode('local');
      const initialGameState = {
        gameType: setupData.gameType,
        players: setupData.players.map(p => ({
          name: p.name,
          budget: setupData.budget,
          drafted: []
        })),
        itemsPool: generateItemsPool(setupData),
        currentItem: null,
        biddingState: null,
        phase: 'board',
        turnIndex: 0
      };
      setHistory([]);
      setGameState(initialGameState);
      setScreen('game');
    } else if (setupData.mode === 'host') {
      setGameMode('online');
      const code = Math.random().toString(36).substring(2, 6).toUpperCase();
      setRoomCode(code);
      setMyRole('host');
      setMyPlayerName(setupData.players[0].name);

      const initialGameState = {
        status: 'waiting',
        targetNumPlayers: setupData.targetNumPlayers,
        gameType: setupData.gameType,
        players: [{
          name: setupData.players[0].name,
          budget: setupData.budget,
          drafted: []
        }],
        itemsPool: generateItemsPool(setupData),
        currentItem: null,
        biddingState: null,
        phase: 'board',
        turnIndex: 0
      };
      
      const gameRef = ref(db, `rooms/${code}/gameState`);
      set(gameRef, initialGameState);
      
      onValue(gameRef, (snapshot) => {
        const data = normalizeGameState(snapshot.val());
        if (data) {
          setGameState(data);
          if (data.phase === 'end') {
            setScreen('end');
          } else if (data.status === 'playing') {
            setScreen('game');
          }
        }
      });
      setScreen('lobby');
    } else if (setupData.mode === 'join') {
      setGameMode('online');
      setRoomCode(setupData.roomCode);
      setMyRole('join');
      setMyPlayerName(setupData.playerName);

      const gameRef = ref(db, `rooms/${setupData.roomCode}/gameState`);
      let hasJoined = false;
      
      onValue(gameRef, (snapshot) => {
        const data = normalizeGameState(snapshot.val());
        if (data) {
          if (!hasJoined) {
            hasJoined = true;
            const newPlayers = [...(data.players || [])];
            const alreadyIn = newPlayers.find(p => p.name === setupData.playerName);
            if (!alreadyIn && newPlayers.length < data.targetNumPlayers) {
              newPlayers.push({
                name: setupData.playerName,
                budget: data.players[0] ? data.players[0].budget : 500,
                drafted: []
              });
              
              update(gameRef, { players: newPlayers }).catch(err => {
                console.error("Update failed", err);
                alert("Impossible de rejoindre la partie. Vérifiez que les règles Firebase sont bien configurées.");
              });
            }
          }
          setGameState(data);
          if (data.phase === 'end') {
            setScreen('end');
          } else if (data.status === 'playing') {
            setScreen('game');
          } else {
            setScreen('lobby');
          }
        } else {
          // Si le salon n'existe pas
          if (!hasJoined) {
            alert("Code de salon introuvable ou partie terminée.");
            setGameMode('local');
            setRoomCode(null);
            setScreen('setup');
          }
        }
      }, (error) => {
        console.error("Firebase permission error:", error);
        alert("Erreur de connexion Firebase. Avez-vous bien mis les règles .read et .write à true ?");
      });
    }
  };

  const handleEndGame = () => {
    setScreen('end');
  };

  const handleGoHome = () => {
    sessionStorage.removeItem('drafty_state');
    setRoomCode(null);
    setGameMode('local');
    setScreen('home');
    setGameState(null);
    setHistory([]);
  };

  return (
    <>
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 50 }}>
        <button
          className="btn"
          style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '12px' }}
          onClick={() => i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')}
        >
          <Globe size={18} />
          {i18n.language === 'fr' ? 'EN' : 'FR'}
        </button>
      </div>

      {screen !== 'home' && (
        <div 
          onClick={handleGoHome}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            padding: '10px 0 20px 0',
            justifyContent: 'flex-start',
            opacity: 0.8,
            transition: 'opacity 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.opacity = 1}
          onMouseOut={e => e.currentTarget.style.opacity = 0.8}
        >
          <img src="/logo.jpg" alt="DraftyEleven Logo" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0 }}>DRAFTY<span style={{ color: 'var(--accent)' }}>ELEVEN</span></h1>
        </div>
      )}
      {screen === 'home' && <Home onSelectMode={handleSelectMode} />}
      {screen === 'setup' && (
        <GameSetup 
          initialGameType={selectedGameType}
          onStart={handleStartGame} 
          onBack={() => setScreen('home')} 
        />
      )}
      {screen === 'game' && <GameBoard 
          gameState={gameState} 
          setGameState={handleSetGameState} 
          onEnd={handleEndGame} 
          mode={gameMode} 
          myPlayerName={myPlayerName}
          onUndo={handleUndo}
          canUndo={gameMode === 'local' && history.length > 0}
      />}
      {screen === 'end' && <EndScreen 
          gameState={gameState}
          setGameState={handleSetGameState}
          mode={gameMode}
          myPlayerName={myPlayerName}
          onHome={handleGoHome} 
        />
      }
      {screen === 'lobby' && (
        <div className="glass-panel animate-fade-in" style={{ margin: 'auto', textAlign: 'center', width: '100%' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t('lobby.room')}: {roomCode}</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>{t('lobby.waiting')}</p>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '16px', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>{t('lobby.players')} ({gameState?.players?.length} / {gameState?.targetNumPlayers})</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {gameState?.players?.map((p, i) => (
                <li key={i} style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  {p.name}
                </li>
              ))}
            </ul>
          </div>
          {myRole === 'host' && gameState?.players?.length === gameState?.targetNumPlayers && (
            <button className="btn" onClick={() => {
              update(ref(db, `rooms/${roomCode}/gameState`), { status: 'playing' });
              setScreen('game');
            }}>{t('lobby.start')}</button>
          )}
          
          <button className="btn btn-secondary" style={{ marginTop: '1rem', width: 'auto', padding: '0.5rem 1rem' }} onClick={() => {
            sessionStorage.removeItem('drafty_state');
            setRoomCode(null);
            setGameMode('local');
            setGameState(null);
            setScreen('home');
          }}>
            {t('lobby.leave')}
          </button>
        </div>
      )}
      {screen === 'blind_ranking' && <BlindRanking onBack={handleGoHome} />}
      {screen === 'start_bench_sell' && <StartBenchSell onBack={handleGoHome} />}
      {screen === 'mystery_player' && <MysteryPlayer onBack={handleGoHome} />}
      {screen === 'juste_prix' && <JustePrix onBack={handleGoHome} />}
      {screen === 'cherche_intrus' && <ChercheIntrus onBack={handleGoHome} />}
      {screen === 'joue_avec' && <JoueAvec onBack={handleGoHome} />}
      {screen === 'plus_ou_moins' && <PlusOuMoins onBack={handleGoHome} />}

      <div style={{ marginTop: 'auto', paddingTop: '4rem', width: '100%' }}>
        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '100%', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f43f5e', fontWeight: '800', fontSize: '1rem' }}>
            <Heart size={18} fill="#f43f5e" /> {t('donation.title')}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: '1.4', maxWidth: '500px' }}>
            {t('donation.desc')}
          </p>
          <button 
            className="btn"
            style={{ background: '#f43f5e', marginTop: '0.25rem', width: 'auto', padding: '0.5rem 1.25rem', borderRadius: '10px', fontSize: '0.9rem' }}
            onClick={() => window.open('https://www.paypal.com/paypalme/Schadili', '_blank')}
          >
            {t('donation.btn')} ❤️
          </button>
        </div>
      </div>
    </>
  )
}

export default App
