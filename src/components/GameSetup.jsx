import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PREDEFINED_THEMES } from '../data/themes';
import { ArrowLeft, Play, Users, Banknote, LayoutGrid } from 'lucide-react';

export default function GameSetup({ initialGameType, onStart, onBack }) {
  const { t } = useTranslation();
  const [gameType, setGameType] = useState(initialGameType || 'football_xi'); // 'classic' ou 'football_xi'
  const [numPlayers, setNumPlayers] = useState(2);
  const [players, setPlayers] = useState([{ name: `${t('gamesetup.player')} 1` }, { name: `${t('gamesetup.player')} 2` }]);
  const [budget, setBudget] = useState(initialGameType === 'football_xi' ? 1000 : 500);

  // The rest of the state
  const categories = [...new Set(PREDEFINED_THEMES.map(theme => theme.category)), 'Personnalisé'];
  const [selectedCategory, setSelectedCategory] = useState(PREDEFINED_THEMES[0].category);
  const [themeId, setThemeId] = useState(PREDEFINED_THEMES[0].id);
  const [customItems, setCustomItems] = useState(Array(25).fill('')); // Permet jusqu'à 25 items pour 5 joueurs

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'Personnalisé') {
      setThemeId('custom');
    } else {
      const firstThemeInCat = PREDEFINED_THEMES.find(theme => theme.category === cat);
      if (firstThemeInCat) setThemeId(firstThemeInCat.id);
    }
  };

  const handleNumPlayersChange = (e) => {
    const val = parseInt(e.target.value);
    setNumPlayers(val);
    const newPlayers = [...players];
    while (newPlayers.length < val) {
      newPlayers.push({ name: `${t('gamesetup.player')} ${newPlayers.length + 1}` });
    }
    while (newPlayers.length > val) {
      newPlayers.pop();
    }
    setPlayers(newPlayers);
  };

  const handlePlayerNameChange = (index, name) => {
    const newPlayers = [...players];
    newPlayers[index].name = name;
    setPlayers(newPlayers);
  };

  const handleCustomItemChange = (index, value) => {
    const newItems = [...customItems];
    newItems[index] = value;
    setCustomItems(newItems);
  };

  const [setupMode, setSetupMode] = useState('local'); // 'local', 'host', 'join'
  const [joinCode, setJoinCode] = useState('');
  const [joinName, setJoinName] = useState('');

  // ... (category selection logic remains the same, we'll just redefine it inside)
  const handleStart = () => {
    if (setupMode === 'join') {
      if (!joinCode || !joinName) {
        alert(t('gamesetup.alert_join_required'));
        return;
      }
      onStart({ mode: 'join', roomCode: joinCode.toUpperCase(), playerName: joinName });
      return;
    }

    const requiredItems = gameType === 'football_xi' ? players.length * 11 : players.length * 5;
    let itemsToPlay = [];

    if (gameType === 'classic') {
      if (themeId === 'custom') {
        itemsToPlay = customItems.filter(i => i.trim() !== '').map(name => ({ name }));
        if (itemsToPlay.length < requiredItems) {
          alert(t('gamesetup.alert_custom_items', { players: players.length, required: requiredItems }));
          return;
        }
      } else {
        const selectedTheme = PREDEFINED_THEMES.find(theme => theme.id === themeId);
        itemsToPlay = selectedTheme.items;
      }
    }

    onStart({
      mode: setupMode, // 'local' or 'host'
      gameType,
      players: setupMode === 'host' ? [{ name: players[0].name }] : players, // If host, only first player is set here
      budget: parseInt(budget),
      items: itemsToPlay,
      requiredItems,
      targetNumPlayers: numPlayers // For host to know when room is full
    });
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ margin: 'auto', width: '100%' }}>
      <button className="btn btn-secondary" style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem' }} onClick={onBack}>
        <ArrowLeft size={18} /> {t('gamesetup.back')}
      </button>
      
      <h2 className="title" style={{ fontSize: '2rem' }}>
        {gameType === 'football_xi' ? t('gamesetup.title_xi') : t('gamesetup.title_5v5')}
      </h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '16px' }}>
        <button className={`btn ${setupMode === 'local' ? '' : 'btn-secondary'}`} style={{ flex: 1, padding: '0.5rem' }} onClick={() => setSetupMode('local')}>
          📱 {t('gamesetup.mode_local')}
        </button>
        <button className={`btn ${setupMode === 'host' ? '' : 'btn-secondary'}`} style={{ flex: 1, padding: '0.5rem' }} onClick={() => setSetupMode('host')}>
          🌐 {t('gamesetup.mode_host')}
        </button>
        <button className={`btn ${setupMode === 'join' ? '' : 'btn-secondary'}`} style={{ flex: 1, padding: '0.5rem' }} onClick={() => setSetupMode('join')}>
          🚪 {t('gamesetup.mode_join')}
        </button>
      </div>

      {setupMode === 'join' ? (
        <div className="setup-section">
          <h3 className="setup-section-title">{t('gamesetup.join_title')}</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label className="label">{t('gamesetup.your_pseudo')}</label>
            <input type="text" value={joinName} onChange={(e) => setJoinName(e.target.value)} placeholder={t('gamesetup.placeholder_pseudo')} />
          </div>
          <div>
            <label className="label">{t('gamesetup.room_code')}</label>
            <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} placeholder={t('gamesetup.placeholder_code')} style={{ textTransform: 'uppercase' }} />
          </div>
        </div>
      ) : (
        <>
          <div className="setup-section">
            <h3 className="setup-section-title">
              <Users size={20} /> {t('gamesetup.players_settings')}
            </h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="label">{t('gamesetup.num_players')}</label>
              <select value={numPlayers} onChange={handleNumPlayersChange}>
                {[2,3,4,5].map(n => <option key={n} value={n}>{n} {t('gamesetup.players')}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {setupMode === 'local' ? (
                players.map((p, i) => (
                  <div key={i}>
                    <label className="label">{t('gamesetup.player')} {i + 1}</label>
                    <input type="text" value={p.name} onChange={(e) => handlePlayerNameChange(i, e.target.value)} placeholder={`${t('gamesetup.pseudo')} ${i + 1}`} />
                  </div>
                ))
              ) : (
                <div>
                  <label className="label">{t('gamesetup.host_pseudo')}</label>
                  <input type="text" value={players[0].name} onChange={(e) => handlePlayerNameChange(0, e.target.value)} placeholder={t('gamesetup.placeholder_host')} />
                </div>
              )}
            </div>
          </div>

          <div className="setup-section">
            <h3 className="setup-section-title">
              <Banknote size={20} /> {t('gamesetup.budget_settings')}
            </h3>
            <div>
              <label className="label">{t('gamesetup.starting_budget')}</label>
              <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} min="100" step="50" />
            </div>
          </div>

          {gameType === 'classic' ? (
            <div className="setup-section">
              <h3 className="setup-section-title">
                <LayoutGrid size={20} /> {t('gamesetup.theme_choice')}
              </h3>
            
            <div style={{ marginBottom: '0.5rem' }}>
              <label className="label">{t('gamesetup.category')}</label>
              <div className="category-scroller">
                {categories.map(cat => (
                  <div 
                    key={cat} 
                    className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(cat)}
                  >
                    {cat === 'Personnalisé' ? t('gamesetup.category_custom') : cat}
                  </div>
                ))}
              </div>
            </div>

            {selectedCategory !== 'Personnalisé' && (
              <div className="theme-grid">
                {PREDEFINED_THEMES.filter(theme => theme.category === selectedCategory).map(theme => (
                  <div 
                    key={theme.id} 
                    className={`theme-card ${themeId === theme.id ? 'active' : ''}`}
                    onClick={() => setThemeId(theme.id)}
                  >
                    <div className="icon">{theme.icon}</div>
                    <div className="name">{theme.name}</div>
                  </div>
                ))}
              </div>
            )}

            {themeId === 'custom' && (
              <div style={{ marginTop: '1rem' }}>
                <label className="label">{t('gamesetup.custom_items_label')}</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {customItems.map((item, i) => (
                    <input 
                      key={i}
                      type="text" 
                      value={item} 
                      onChange={(e) => handleCustomItemChange(i, e.target.value)}
                      placeholder={`${t('gamesetup.item')} ${i + 1}`}
                      style={{ marginBottom: 0 }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          ) : (
            <div className="setup-section">
              <h3 className="setup-section-title" style={{ color: '#10b981' }}>
                <LayoutGrid size={20} /> {t('gamesetup.position_draft')}
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                {t('gamesetup.position_draft_desc')}
              </p>
            </div>
          )}
        </>
      )}

      <button className="btn" onClick={handleStart} style={{ width: '100%', padding: '1rem' }}>
        <Play size={20} />
        {setupMode === 'join' ? t('gamesetup.btn_join') : (setupMode === 'host' ? t('gamesetup.btn_create') : t('gamesetup.btn_start'))}
      </button>
    </div>
  );
}
