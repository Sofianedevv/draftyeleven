import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PREDEFINED_THEMES } from '../data/themes';
import { ArrowLeft, RefreshCcw, Trophy } from 'lucide-react';

export default function BlindRanking({ onBack }) {
  const { t } = useTranslation();
  const [pool, setPool] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slots, setSlots] = useState(Array(10).fill(null));

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    // Récupérer tous les joueurs de football (légendes et trolls)
    const allItems = PREDEFINED_THEMES
      .filter(theme => theme.category === 'Football')
      .flatMap(theme => theme.items);
    
    // Mélanger et prendre 10 joueurs au hasard
    const shuffled = [...allItems].sort(() => Math.random() - 0.5).slice(0, 10);
    setPool(shuffled);
    setCurrentIndex(0);
    setSlots(Array(10).fill(null));
  };

  const handlePlace = (index) => {
    if (slots[index] !== null) return;
    
    const newSlots = [...slots];
    newSlots[index] = pool[currentIndex];
    setSlots(newSlots);
    setCurrentIndex(currentIndex + 1);
  };

  const isGameOver = currentIndex >= 10;
  const currentPlayer = pool[currentIndex];

  return (
    <div className="glass-panel animate-fade-in" style={{ margin: 'auto', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={onBack} style={{ padding: '0.5rem 1rem' }}>
          <ArrowLeft size={18} /> {t('blindranking.back')}
        </button>
        <button className="btn btn-secondary" onClick={startNewGame} style={{ padding: '0.5rem 1rem' }}>
          <RefreshCcw size={18} /> {t('blindranking.restart')}
        </button>
      </div>

      <div style={{ marginBottom: '1rem', display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)' }}>
        <Trophy size={32} color="var(--success)" />
      </div>
      <h2 className="title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('blindranking.title')}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center' }}>
        {t('blindranking.description')}
      </p>

      {!isGameOver && currentPlayer ? (
        <div className="animate-pop" style={{ 
          background: currentPlayer.isTroll ? 'rgba(244,63,94,0.1)' : 'rgba(59,130,246,0.1)', 
          border: `2px solid ${currentPlayer.isTroll ? 'var(--danger)' : 'var(--accent)'}`,
          padding: '2rem', 
          borderRadius: '16px',
          width: '100%',
          textAlign: 'center',
          marginBottom: '2rem',
          boxShadow: `0 10px 30px ${currentPlayer.isTroll ? 'rgba(244,63,94,0.2)' : 'rgba(59,130,246,0.2)'}`
        }}>
          <h3 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem' }}>{currentPlayer.name}</h3>
          <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>
            {currentPlayer.specificPosition || currentPlayer.position}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--warning)' }}>
            ⭐ {currentPlayer.rating}
          </div>
        </div>
      ) : (
        <div className="animate-pop" style={{ 
          background: 'rgba(16,185,129,0.1)', 
          border: '2px solid var(--success)',
          padding: '2rem', 
          borderRadius: '16px',
          width: '100%',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--success)' }}>{t('blindranking.game_over')}</h3>
          <p style={{ color: 'var(--text-secondary)' }}>{t('blindranking.final_ranking')}</p>
        </div>
      )}

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {slots.map((player, index) => (
          <div 
            key={index} 
            onClick={() => !isGameOver && handlePlace(index)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: player ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.05)',
              border: player ? '1px solid var(--surface-border)' : '1px dashed var(--text-secondary)',
              borderRadius: '12px',
              padding: '1rem',
              cursor: (!player && !isGameOver) ? 'pointer' : 'default',
              transition: 'all 0.2s',
              opacity: (!player && !isGameOver) ? 0.8 : 1
            }}
            onMouseEnter={(e) => {
              if (!player && !isGameOver) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              if (!player && !isGameOver) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
          >
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '8px', 
              background: 'var(--accent)', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '1.2rem',
              marginRight: '1rem'
            }}>
              {index + 1}
            </div>
            
            {player ? (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{player.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{player.specificPosition || player.position}</div>
                </div>
                <div style={{ fontWeight: 'bold', color: 'var(--warning)' }}>⭐ {player.rating}</div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                {isGameOver ? t('blindranking.empty') : t('blindranking.click_to_place')}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
