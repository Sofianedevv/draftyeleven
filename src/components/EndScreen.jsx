import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, RefreshCcw, Bot } from 'lucide-react';

const FORMATIONS = {
  '4-3-3': [
    '7 / 3 / 8 / 4', // 0: GK
    '5 / 1 / 6 / 2', // 1: LB
    '6 / 2 / 7 / 3', // 2: LCB
    '6 / 4 / 7 / 5', // 3: RCB
    '5 / 5 / 6 / 6', // 4: RB
    '4 / 3 / 5 / 4', // 5: CDM
    '3 / 2 / 4 / 3', // 6: LCM
    '3 / 4 / 4 / 5', // 7: RCM
    '2 / 1 / 3 / 2', // 8: LW
    '1 / 3 / 2 / 4', // 9: ST
    '2 / 5 / 3 / 6'  // 10: RW
  ],
  '4-4-2': [
    '7 / 3 / 8 / 4', // GK
    '6 / 1 / 7 / 2', // LB
    '6 / 2 / 7 / 3', // LCB
    '6 / 4 / 7 / 5', // RCB
    '6 / 5 / 7 / 6', // RB
    '4 / 1 / 5 / 2', // LM
    '4 / 2 / 5 / 3', // LCM
    '4 / 4 / 5 / 5', // RCM
    '4 / 5 / 5 / 6', // RM
    '2 / 2 / 3 / 3', // LST
    '2 / 4 / 3 / 5'  // RST
  ],
  '4-2-3-1': [
    '7 / 3 / 8 / 4', // GK
    '6 / 1 / 7 / 2', // LB
    '6 / 2 / 7 / 3', // LCB
    '6 / 4 / 7 / 5', // RCB
    '6 / 5 / 7 / 6', // RB
    '4 / 2 / 5 / 3', // LDM
    '4 / 4 / 5 / 5', // RDM
    '2 / 1 / 3 / 2', // LAM
    '2 / 3 / 3 / 4', // CAM
    '2 / 5 / 3 / 6', // RAM
    '1 / 3 / 2 / 4'  // ST
  ],
  '3-5-2': [
    '7 / 3 / 8 / 4', // GK
    '6 / 2 / 7 / 3', // LCB
    '6 / 3 / 7 / 4', // CB
    '6 / 4 / 7 / 5', // RCB
    '4 / 1 / 5 / 2', // LWB
    '4 / 2 / 5 / 3', // LCM
    '4 / 3 / 5 / 4', // CDM
    '4 / 4 / 5 / 5', // RCM
    '4 / 5 / 5 / 6', // RWB
    '2 / 2 / 3 / 3', // LST
    '2 / 4 / 3 / 5'  // RST
  ]
};

const IDEAL_ROLES = {
  0: ['gardien'],
  1: ['latéral', 'défenseur', 'gauche', 'droit'],
  2: ['défenseur central', 'défenseur'],
  3: ['défenseur central', 'défenseur'],
  4: ['latéral', 'défenseur', 'gauche', 'droit'],
  5: ['milieu', 'défensif', 'récupérateur', 'central'],
  6: ['milieu', 'central', 'offensif'],
  7: ['milieu', 'central', 'offensif'],
  8: ['ailier', 'attaquant', 'milieu offensif', 'gauche', 'droit'],
  9: ['numéro 9', 'buteur', 'attaquant'],
  10: ['ailier', 'attaquant', 'milieu offensif', 'gauche', 'droit']
};

export default function EndScreen({ gameState, setGameState, mode, myPlayerName, onHome }) {
  const { t } = useTranslation();
  const { players } = gameState;
  
  const computeInitialSetups = () => {
    return players.map(p => {
      const starters = new Array(11).fill(null);
      const bench = [];
      
      (p.drafted || []).forEach(item => {
        const pos = item.specificPosition || item.position || '';
        const posLower = pos.toLowerCase();
        let placed = false;
        
        const tryPlace = (indices) => {
          for(let i of indices) {
            if(!starters[i]) {
              starters[i] = item;
              placed = true;
              return true;
            }
          }
          return false;
        };
        
        if (posLower.includes('gardien')) { tryPlace([0]); }
        else if (posLower.includes('latéral gauche')) { tryPlace([1]); }
        else if (posLower.includes('latéral droit')) { tryPlace([4]); }
        else if (posLower.includes('défenseur central')) { tryPlace([2, 3]); }
        else if (posLower.includes('défensif') || posLower.includes('récupérateur')) { tryPlace([5, 6, 7]); }
        else if (posLower.includes('milieu')) { tryPlace([6, 7, 5]); }
        else if (posLower.includes('ailier gauche')) { tryPlace([8]); }
        else if (posLower.includes('ailier droit')) { tryPlace([10]); }
        else { tryPlace([9, 8, 10]); }
        
        if (!placed) {
          bench.push(item);
        }
      });
      
      for (let i = 0; i < 11; i++) {
        if (!starters[i] && bench.length > 0) {
          starters[i] = bench.shift();
        }
      }
      
      return { starters, bench, formation: '4-3-3' };
    });
  };

  const teamSetups = gameState.teamSetups || computeInitialSetups();

  React.useEffect(() => {
    if (!gameState.teamSetups) {
      setGameState({ ...gameState, teamSetups });
    }
  }, []);
  const [selectedSwap, setSelectedSwap] = React.useState(null);
  const [aiAnalysis, setAiAnalysis] = React.useState(null);

  const calculateTeamScore = (starters) => {
    let score = 0;
    let trolls = 0;
    let comments = [];

    starters.forEach((player, i) => {
      if (!player) {
        score -= 10;
        comments.push(t('endscreen.missing_player', { poste: i }));
        return;
      }
      
      score += player.rating || 0;
      
      if (player.isTroll) {
        trolls += 1;
        score -= 15;
        comments.push(t('endscreen.troll_comment', { name: player.name }));
      }

      if (gameState.mode === 'football_xi') {
        const pos = (player.specificPosition || player.position || '').toLowerCase();
        const ideal = IDEAL_ROLES[i] || [];
        const match = ideal.some(role => pos.includes(role));

        if (!match) {
          if (i === 0) {
            score -= 30;
            comments.push(t('endscreen.wrong_gk', { name: player.name }));
          } else if (pos.includes('gardien') && i !== 0) {
            score -= 30;
            comments.push(t('endscreen.gk_outfield', { name: player.name }));
          } else {
            score -= 5;
          }
        }
      }
    });

    return { score, trolls, comments: [...new Set(comments)] }; // Unique comments
  };

  const handleAIAnalysis = () => {
    setAiAnalysis('loading');
    
    setTimeout(() => {
      const stats = teamSetups.map((setup, idx) => ({
        name: players[idx].name,
        ...calculateTeamScore(setup.starters)
      }));

      let p1 = stats[0];
      let p2 = stats[1];

      const scoreType = gameState.mode !== 'football_xi' 
        ? t('endscreen.score_type_global') 
        : t('endscreen.score_type_tactical');
      const goodTeamComment = gameState.mode !== 'football_xi' 
        ? t('endscreen.good_team_global') 
        : t('endscreen.good_team_tactical');

      let verdict = t('endscreen.ai_analysis_done');
      
      verdict += t('endscreen.score', { name: p1.name, scoreType, score: p1.score });
      if (p1.comments.length > 0) verdict += t('endscreen.remarks', { comments: p1.comments.slice(0, 2).join(' ') });
      else verdict += goodTeamComment;

      if (p2) {
        verdict += t('endscreen.score', { name: p2.name, scoreType, score: p2.score });
        if (p2.comments.length > 0) verdict += t('endscreen.remarks', { comments: p2.comments.slice(0, 2).join(' ') });
        else verdict += goodTeamComment;

        if (p1.score > p2.score + 10) verdict += t('endscreen.verdict_crushing_victory', { name: p1.name });
        else if (p2.score > p1.score + 10) verdict += t('endscreen.verdict_crushing_victory', { name: p2.name });
        else if (p1.score > p2.score) verdict += t('endscreen.verdict_narrow_victory', { name: p1.name });
        else if (p2.score > p1.score) verdict += t('endscreen.verdict_narrow_victory', { name: p2.name });
        else verdict += t('endscreen.verdict_draw');
      }

      setAiAnalysis(verdict);
    }, 1500);
  };

  const playersStats = players.map((p, idx) => {
    const totalSpent = p.drafted.reduce((acc, item) => acc + item.price, 0);
    return { ...p, totalSpent, originalIndex: idx };
  });

  const handlePlayerClick = (pIndex, type, itemIndex) => {
    if (mode === 'online' && players[pIndex].name !== myPlayerName) {
      alert(t('endscreen.alert_own_composition'));
      return;
    }

    if (!selectedSwap) {
      setSelectedSwap({ pIndex, type, itemIndex });
    } else {
      if (selectedSwap.pIndex !== pIndex) {
         setSelectedSwap({ pIndex, type, itemIndex });
         return;
      }
      if (selectedSwap.type === type && selectedSwap.itemIndex === itemIndex) {
         setSelectedSwap(null);
         return;
      }
      
      const newSetups = [...teamSetups];
      const setup = { ...newSetups[pIndex] };
      setup.starters = [...setup.starters];
      setup.bench = [...setup.bench];

      const item1 = selectedSwap.type === 'starter' ? setup.starters[selectedSwap.itemIndex] : setup.bench[selectedSwap.itemIndex];
      const item2 = type === 'starter' ? setup.starters[itemIndex] : setup.bench[itemIndex];

      if (selectedSwap.type === 'starter') setup.starters[selectedSwap.itemIndex] = item2;
      else setup.bench[selectedSwap.itemIndex] = item2;

      if (type === 'starter') setup.starters[itemIndex] = item1;
      else setup.bench[itemIndex] = item1;

      newSetups[pIndex] = setup;
      setGameState({ ...gameState, teamSetups: newSetups });
      setSelectedSwap(null);
    }
  };

  const isSelected = (pIdx, type, i) => {
    return selectedSwap && selectedSwap.pIndex === pIdx && selectedSwap.type === type && selectedSwap.itemIndex === i;
  };

  const handleFormationChange = (teamIdx, newFormation) => {
    if (mode === 'online' && players[teamIdx].name !== myPlayerName) {
      alert(t('endscreen.alert_own_formation'));
      return;
    }

    const newSetups = [...teamSetups];
    newSetups[teamIdx] = { ...newSetups[teamIdx], formation: newFormation };
    setGameState({ ...gameState, teamSetups: newSetups });
    setSelectedSwap(null);
  };

  const renderCard = (item, pIdx, type, i) => {
    const selected = isSelected(pIdx, type, i);
    return (
      <div 
        key={item ? `${item.id}-${i}` : i} 
        onClick={() => handlePlayerClick(pIdx, type, i)}
        className={`animate-swap ${selected ? 'selected' : ''}`}
        style={{ 
          background: selected ? 'rgba(59,130,246,0.8)' : 'rgba(0,0,0,0.6)', 
          padding: '0.25rem 0.5rem', 
          borderRadius: '4px', 
          fontSize: '0.75rem', 
          color: 'white', 
          textAlign: 'center', 
          border: selected ? '2px solid #60a5fa' : '1px solid var(--accent)',
          cursor: 'pointer',
          transform: selected ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.2s',
          boxShadow: selected ? '0 0 10px rgba(59,130,246,0.5)' : 'none'
        }}
      >
        <div style={{ fontWeight: 'bold' }}>{item.name}</div>
        <div style={{ fontSize: '0.65rem', color: '#ccc', textTransform: 'uppercase' }}>{item.specificPosition || item.position}</div>
        <div style={{ color: 'var(--warning)' }}>⭐ {item.rating} ({item.price}M)</div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ margin: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Trophy size={48} color="var(--warning)" style={{ margin: '0 auto 1rem' }} />
        <h2 className="title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{t('endscreen.title')}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{t('endscreen.subtitle')}</p>
        {selectedSwap && (
          <div style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa', padding: '0.5rem', borderRadius: '8px', marginTop: '1rem', fontWeight: 'bold' }}>
            {t('endscreen.swap_instruction')}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
        {playersStats.map((p, idx) => {
          const starters = teamSetups[idx].starters;
          const bench = teamSetups[idx].bench;
          
          return (
            <div key={idx} className="glass-panel" style={{ padding: '1rem 0.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent)' }}>{p.name}</h3>
                
                {gameState.gameType === 'football_xi' && p.drafted.length > 0 && (
                  <div>
                    <select 
                      value={teamSetups[idx].formation} 
                      onChange={(e) => handleFormationChange(idx, e.target.value)}
                      style={{ 
                        padding: '0.3rem 0.6rem', 
                        borderRadius: '6px', 
                        background: 'rgba(0,0,0,0.5)', 
                        color: 'white', 
                        border: '1px solid var(--glass-border)', 
                        fontWeight: '600',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {Object.keys(FORMATIONS).map(form => (
                        <option key={form} value={form}>{form}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '600' }}>{t('endscreen.remaining')} <span style={{ color: 'var(--success)' }}>{p.budget}M</span></div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('endscreen.spent')} {p.totalSpent}M</div>
                </div>
              </div>
              
              {p.drafted.length > 0 ? (
                gameState.gameType === 'football_xi' ? (
                  <>
                    <div className="fm-pitch-container" style={{ marginTop: '1rem' }}>
                      <div className="fm-pitch-markings">
                        <div className="fm-center-circle"></div>
                        <div className="fm-center-line"></div>
                        <div className="fm-penalty-box-top"></div>
                        <div className="fm-penalty-box-bottom"></div>
                      </div>
                      
                      <div className="fm-tactical-grid">
                        {(() => {
                          const currentFormation = FORMATIONS[teamSetups[idx].formation] || FORMATIONS['4-3-3'];

                          return starters.map((item, i) => {
                            const area = currentFormation[i] || '1 / 1 / 2 / 2';
                            const selected = isSelected(idx, 'starter', i);
                            
                            return (
                              <div key={i} className={`fm-grid-cell ${selected ? 'selected' : ''}`} style={{ gridArea: area }}>
                                {item && (
                                  <div 
                                    key={`${item.id}-${i}`}
                                    className={`fm-player-card animate-swap ${selected ? 'selected' : ''}`}
                                    onClick={() => handlePlayerClick(idx, 'starter', i)}
                                  >
                                    <div className="fm-player-top" style={{ background: idx === 0 ? '#3b82f6' : '#ef4444' }}>
                                      {item.name.split(' ').pop()}
                                    </div>
                                    <div className="fm-player-body">
                                      <div className="fm-player-circle"></div>
                                      <div className="fm-player-info">
                                        <span className="fm-player-role">{(item.specificPosition || item.position).substring(0, 3)}</span>
                                        <span style={{ fontSize: '0.65rem' }}>{item.rating}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {!item && (
                                  <div 
                                    style={{ width: '100%', maxWidth: '80px', height: '100%', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '6px', cursor: 'pointer' }}
                                    onClick={() => handlePlayerClick(idx, 'starter', i)}
                                  />
                                )}
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {bench.length > 0 && (
                      <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{t('endscreen.bench')}</h4>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {bench.map((item, i) => renderCard(item, idx, 'bench', i))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {p.drafted.map((item, i) => (
                    <div key={i} className="drafted-item">
                      <div style={{ fontWeight: '600' }}>
                        {item.name} 
                        {item.rating && <span style={{ fontSize: '0.8rem', color: 'var(--warning)', marginLeft: '0.5rem' }}>⭐ {item.rating}</span>}
                      </div>
                      <div style={{ color: 'var(--accent)', fontWeight: '800' }}>{item.price}M</div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center', padding: '1rem 0' }}>
                {t('endscreen.no_drafted_players')}
              </div>
            )}
          </div>
          );
        })}
      </div>

      <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: '16px', border: '1px solid rgba(59,130,246,0.3)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', marginBottom: '1rem', color: '#60a5fa' }}>
          <Bot size={24} /> {t('endscreen.ai_opinion')}
        </h3>
        
        {!aiAnalysis ? (
          <button className="btn btn-primary" onClick={handleAIAnalysis} style={{ width: '100%', padding: '1rem' }}>
            {gameState.mode !== 'football_xi' ? t('endscreen.request_analysis_global') : t('endscreen.request_analysis_tactical')}
          </button>
        ) : aiAnalysis === 'loading' ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            {gameState.mode !== 'football_xi' ? t('endscreen.ai_loading') : t('endscreen.ai_loading_xi')}
          </div>
        ) : (
          <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.5)', borderRadius: '12px', color: 'var(--text-primary)', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
            {aiAnalysis}
          </div>
        )}
      </div>

      <button className="btn" onClick={onHome} style={{ width: '100%', padding: '1rem' }}>
        <RefreshCcw size={20} /> {t('endscreen.play_again')}
      </button>
    </div>
  );
}
