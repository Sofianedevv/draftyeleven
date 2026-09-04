import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MYSTERY_PLAYERS } from '../data/mysteryPlayers';
import { ArrowLeft, Search, Eye, ChevronRight, RefreshCcw, Layers } from 'lucide-react';

export default function MysteryPlayer({ onBack }) {
  const { t } = useTranslation();
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [players, setPlayers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [clueIndex, setClueIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const startGameWithDifficulty = (diff) => {
    let filteredPlayers = MYSTERY_PLAYERS;
    if (diff !== 'tous') {
      filteredPlayers = MYSTERY_PLAYERS.filter(p => p.difficulty === diff);
    }
    const shuffled = [...filteredPlayers].sort(() => Math.random() - 0.5);
    setSelectedDifficulty(diff);
    setPlayers(shuffled);
    setCurrentIndex(0);
    setClueIndex(0);
    setIsRevealed(false);
  };

  const nextClue = () => {
    if (clueIndex < 3) {
      setClueIndex(clueIndex + 1);
    }
  };

  const revealPlayer = () => {
    setClueIndex(3);
    setIsRevealed(true);
  };

  const nextPlayer = () => {
    if (currentIndex < players.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setClueIndex(0);
      setIsRevealed(false);
    }
  };

  if (!selectedDifficulty) {
    return (
      <div className="glass-panel animate-fade-in" style={{ margin: 'auto', width: '100%', maxWidth: '600px', textAlign: 'center' }}>
        <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '2rem', padding: '0.5rem 1rem' }}>
          <ArrowLeft size={18} /> {t('mysteryplayer.back')}
        </button>
        <div style={{ marginBottom: '1rem', display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(234, 179, 8, 0.1)' }}>
          <Layers size={48} color="var(--warning)" />
        </div>
        <h2 className="title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('mysteryplayer.difficulty_title')}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{t('mysteryplayer.difficulty_desc')}</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button className="btn" onClick={() => startGameWithDifficulty('facile')} style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', border: '1px solid var(--success)' }}>
            🟢 {t('mysteryplayer.diff_easy')}
          </button>
          <button className="btn" onClick={() => startGameWithDifficulty('normal')} style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
            🔵 {t('mysteryplayer.diff_normal')}
          </button>
          <button className="btn" onClick={() => startGameWithDifficulty('difficile')} style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', border: '1px solid var(--warning)' }}>
            🟠 {t('mysteryplayer.diff_hard')}
          </button>
          <button className="btn" onClick={() => startGameWithDifficulty('expert')} style={{ background: 'rgba(244,63,94,0.1)', color: 'var(--danger)', border: '1px solid var(--danger)' }}>
            🔴 {t('mysteryplayer.diff_expert')}
          </button>
          <button className="btn" onClick={() => startGameWithDifficulty('fada')} style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid #a855f7' }}>
            👽 {t('mysteryplayer.diff_fada')}
          </button>
          <button className="btn btn-secondary" onClick={() => startGameWithDifficulty('tous')} style={{ marginTop: '1rem' }}>
            🎲 {t('mysteryplayer.diff_all')}
          </button>
        </div>
      </div>
    );
  }

  if (players.length === 0) return null;

  const currentPlayer = players[currentIndex];
  const isGameOver = currentIndex >= players.length - 1 && isRevealed;

  return (
    <div className="glass-panel animate-fade-in" style={{ margin: 'auto', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={() => setSelectedDifficulty(null)} style={{ padding: '0.5rem 1rem' }}>
          <ArrowLeft size={18} /> {t('mysteryplayer.menu')}
        </button>
        <button className="btn btn-secondary" onClick={() => startGameWithDifficulty(selectedDifficulty)} style={{ padding: '0.5rem 1rem' }}>
          <RefreshCcw size={18} /> {t('mysteryplayer.restart')}
        </button>
      </div>

      <div style={{ marginBottom: '1rem', display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(234, 179, 8, 0.1)' }}>
        <Search size={32} color="var(--warning)" />
      </div>
      <h2 className="title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('mysteryplayer.title')}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center' }}>
        {t('mysteryplayer.player')} {currentIndex + 1} / {players.length} <br />
        <span style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase' }}>{t('mysteryplayer.difficulty')} : {selectedDifficulty}</span>
      </p>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {[0, 1, 2, 3].map((index) => (
          <div 
            key={index}
            className={clueIndex >= index ? "animate-fade-in" : ""}
            style={{ 
              padding: '1.5rem', 
              background: clueIndex >= index ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.3)', 
              borderRadius: '12px',
              border: '1px solid',
              borderColor: clueIndex >= index ? 'var(--surface-border)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              transition: 'all 0.3s'
            }}
          >
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: clueIndex >= index ? 'var(--warning)' : 'rgba(255,255,255,0.1)', 
              color: clueIndex >= index ? '#000' : 'var(--text-secondary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {index + 1}
            </div>
            <div style={{ flex: 1, fontSize: '1.1rem', color: clueIndex >= index ? 'var(--text-primary)' : 'rgba(255,255,255,0.2)' }}>
              {clueIndex >= index ? currentPlayer.clues[index] : t('mysteryplayer.hidden_clue')}
            </div>
          </div>
        ))}
      </div>

      {isRevealed ? (
        <div className="animate-pop" style={{ width: '100%', textAlign: 'center' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(234, 179, 8, 0.05) 100%)',
            border: '2px solid var(--warning)',
            padding: '2rem',
            borderRadius: '16px',
            marginBottom: '1.5rem',
            boxShadow: '0 10px 30px rgba(234, 179, 8, 0.2)'
          }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--warning)', margin: 0 }}>
              {currentPlayer.name}
            </h3>
          </div>
          
          {!isGameOver ? (
            <button className="btn btn-primary" onClick={nextPlayer} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              {t('mysteryplayer.next_player')} <ChevronRight size={20} />
            </button>
          ) : (
            <div style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1.2rem' }}>
              {t('mysteryplayer.game_over')}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          <button 
            className="btn btn-secondary" 
            onClick={nextClue} 
            disabled={clueIndex >= 3}
            style={{ flex: 1, padding: '1rem' }}
          >
            <Search size={20} /> {t('mysteryplayer.next_clue')}
          </button>
          
          <button 
            className="btn" 
            onClick={revealPlayer}
            style={{ flex: 1, padding: '1rem', background: 'var(--warning)', color: '#000' }}
          >
            <Eye size={20} /> {t('mysteryplayer.reveal')}
          </button>
        </div>
      )}

    </div>
  );
}
