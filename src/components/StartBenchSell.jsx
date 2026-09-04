import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PREDEFINED_THEMES } from '../data/themes';
import { ArrowLeft, RefreshCcw, Play, CheckCircle2 } from 'lucide-react';

export default function StartBenchSell({ onBack }) {
  const { t } = useTranslation();
  const [players, setPlayers] = useState([]);
  const [assignments, setAssignments] = useState({ start: null, bench: null, sell: null });

  useEffect(() => {
    drawPlayers();
  }, []);

  const drawPlayers = () => {
    const allItems = PREDEFINED_THEMES
      .filter(theme => theme.category === 'Football')
      .flatMap(theme => theme.items);
    
    // Pick 3 random
    const shuffled = [...allItems].sort(() => Math.random() - 0.5).slice(0, 3);
    setPlayers(shuffled);
    setAssignments({ start: null, bench: null, sell: null });
  };

  const handleAssign = (player, role) => {
    setAssignments(prev => {
      const newAssignments = { ...prev };
      
      // If the player is already assigned to another role, remove them from that role
      Object.keys(newAssignments).forEach(key => {
        if (newAssignments[key] && newAssignments[key].name === player.name) {
          newAssignments[key] = null;
        }
      });
      
      // If clicking the same role they already have, just unassign
      if (prev[role] && prev[role].name === player.name) {
        newAssignments[role] = null;
      } else {
        // Assign to new role
        newAssignments[role] = player;
      }
      
      return newAssignments;
    });
  };

  const getRoleColor = (role) => {
    if (role === 'start') return 'var(--success)';
    if (role === 'bench') return 'var(--warning)';
    if (role === 'sell') return 'var(--danger)';
    return 'var(--text-secondary)';
  };
  
  const getRoleLabel = (role) => {
    if (role === 'start') return t('startbenchsell.role_start');
    if (role === 'bench') return t('startbenchsell.role_bench');
    if (role === 'sell') return t('startbenchsell.role_sell');
    return '';
  };

  const isAllAssigned = assignments.start && assignments.bench && assignments.sell;

  return (
    <div className="glass-panel animate-fade-in" style={{ margin: 'auto', width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={onBack} style={{ padding: '0.5rem 1rem' }}>
          <ArrowLeft size={18} /> {t('startbenchsell.back')}
        </button>
        <button className="btn btn-secondary" onClick={drawPlayers} style={{ padding: '0.5rem 1rem' }}>
          <RefreshCcw size={18} /> {t('startbenchsell.new_draw')}
        </button>
      </div>

      <div style={{ marginBottom: '1rem', display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)' }}>
        <Play size={32} color="var(--accent)" />
      </div>
      <h2 className="title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('startbenchsell.title')}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center' }}>
        {t('startbenchsell.subtitle')}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', width: '100%', marginBottom: '2rem' }}>
        {players.map((player, idx) => {
          // Check what role this player currently has
          let currentRole = null;
          if (assignments.start && assignments.start.name === player.name) currentRole = 'start';
          if (assignments.bench && assignments.bench.name === player.name) currentRole = 'bench';
          if (assignments.sell && assignments.sell.name === player.name) currentRole = 'sell';

          return (
            <div key={idx} className="animate-pop" style={{ 
              background: 'rgba(255,255,255,0.03)', 
              border: `2px solid ${currentRole ? getRoleColor(currentRole) : 'var(--surface-border)'}`,
              borderRadius: '16px',
              padding: '1.5rem 1rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s',
              boxShadow: currentRole ? `0 0 20px ${getRoleColor(currentRole)}33` : 'none'
            }}>
              
              <div style={{ flex: 1, marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '0.5rem' }}>{player.name}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  {player.specificPosition || player.position}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--warning)' }}>
                  ⭐ {player.rating}
                </div>
              </div>

              {currentRole && (
                <div style={{ marginBottom: '1rem', fontWeight: '900', color: getRoleColor(currentRole), fontSize: '1.2rem', textShadow: `0 0 10px ${getRoleColor(currentRole)}55` }}>
                  {getRoleLabel(currentRole)}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button 
                  className={`btn ${currentRole === 'start' ? '' : 'btn-secondary'}`} 
                  onClick={() => handleAssign(player, 'start')}
                  style={{ padding: '0.5rem', fontSize: '0.9rem', background: currentRole === 'start' ? 'var(--success)' : '' }}
                >
                  🟢 {t('startbenchsell.start')}
                </button>
                <button 
                  className={`btn ${currentRole === 'bench' ? '' : 'btn-secondary'}`} 
                  onClick={() => handleAssign(player, 'bench')}
                  style={{ padding: '0.5rem', fontSize: '0.9rem', background: currentRole === 'bench' ? 'var(--warning)' : '' }}
                >
                  🟡 {t('startbenchsell.bench')}
                </button>
                <button 
                  className={`btn ${currentRole === 'sell' ? '' : 'btn-secondary'}`} 
                  onClick={() => handleAssign(player, 'sell')}
                  style={{ padding: '0.5rem', fontSize: '0.9rem', background: currentRole === 'sell' ? 'var(--danger)' : '' }}
                >
                  🔴 {t('startbenchsell.sell')}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {isAllAssigned && (
        <div className="animate-pop" style={{ width: '100%', textAlign: 'center' }}>
          <div style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={24} /> {t('startbenchsell.choices_validated')}
          </div>
          <button className="btn btn-primary" onClick={drawPlayers} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            {t('startbenchsell.next_round')} <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>
      )}

    </div>
  );
}
