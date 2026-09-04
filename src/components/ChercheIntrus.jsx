import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { INTRUS_DATA } from '../data/intrusData';
import { ArrowLeft, Target, RefreshCcw, CheckCircle2, XCircle } from 'lucide-react';

export default function ChercheIntrus({ onBack }) {
  const { t } = useTranslation();
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [playedIds, setPlayedIds] = useState([]);
  const [score, setScore] = useState(0);
  const [totalPlayed, setTotalPlayed] = useState(0);

  useEffect(() => {
    drawPuzzle();
  }, []);

  const drawPuzzle = () => {
    let available = INTRUS_DATA.filter((_, i) => !playedIds.includes(i));
    if (available.length === 0) {
      available = INTRUS_DATA;
      setPlayedIds([]);
      setScore(0);
      setTotalPlayed(0);
    }
    
    const randomIndex = Math.floor(Math.random() * available.length);
    const selected = available[randomIndex];
    const realIndex = INTRUS_DATA.indexOf(selected);
    
    setPlayedIds(prev => [...prev, realIndex]);
    setCurrentPuzzle(selected);
    setSelectedIndex(null);
    setIsRevealed(false);
  };

  const handleSelect = (index) => {
    if (isRevealed) return;
    setSelectedIndex(index);
    setIsRevealed(true);
    setTotalPlayed(t => t + 1);
    
    if (index === currentPuzzle.intrusIndex) {
      setScore(s => s + 1);
    }
  };

  if (!currentPuzzle) return null;

  return (
    <div className="glass-panel animate-fade-in" style={{ margin: 'auto', width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={onBack} style={{ padding: '0.5rem 1rem' }}>
          <ArrowLeft size={18} /> {t('chercheintrus.back')}
        </button>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 1rem', borderRadius: '12px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('chercheintrus.score')}</span>
          <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>{score} / {totalPlayed}</span>
        </div>
      </div>

      <div style={{ marginBottom: '1rem', display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)' }}>
        <Target size={32} color="var(--danger)" />
      </div>
      <h2 className="title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('chercheintrus.title')}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center' }}>
        {t('chercheintrus.subtitle')}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', marginBottom: '2rem' }}>
        {currentPuzzle.players.map((player, index) => {
          let bgColor = 'rgba(255,255,255,0.05)';
          let borderColor = 'var(--surface-border)';
          let icon = null;

          if (isRevealed) {
            if (index === currentPuzzle.intrusIndex) {
              bgColor = 'rgba(16, 185, 129, 0.2)';
              borderColor = 'var(--success)';
              icon = <CheckCircle2 color="var(--success)" />;
            } else if (index === selectedIndex) {
              bgColor = 'rgba(239, 68, 68, 0.2)';
              borderColor = 'var(--danger)';
              icon = <XCircle color="var(--danger)" />;
            } else {
              bgColor = 'rgba(255,255,255,0.02)';
              borderColor = 'transparent';
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={isRevealed}
              style={{
                background: bgColor,
                border: `2px solid ${borderColor}`,
                borderRadius: '16px',
                padding: '1.5rem',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: isRevealed && index !== currentPuzzle.intrusIndex && index !== selectedIndex ? 'var(--text-secondary)' : 'white',
                cursor: isRevealed ? 'default' : 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (!isRevealed) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'var(--danger)';
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isRevealed) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--surface-border)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }
              }}
            >
              <span>{player}</span>
              {icon && <span>{icon}</span>}
            </button>
          );
        })}
      </div>

      {isRevealed && (
        <div className="animate-pop" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ 
            background: selectedIndex === currentPuzzle.intrusIndex ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `2px solid ${selectedIndex === currentPuzzle.intrusIndex ? 'var(--success)' : 'var(--danger)'}`,
            padding: '1.5rem',
            borderRadius: '16px',
            textAlign: 'center',
            width: '100%'
          }}>
            <h3 style={{ 
              color: selectedIndex === currentPuzzle.intrusIndex ? 'var(--success)' : 'var(--danger)', 
              margin: '0 0 1rem 0',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              {selectedIndex === currentPuzzle.intrusIndex ? t('chercheintrus.correct') : t('chercheintrus.incorrect')}
            </h3>
            <p style={{ color: 'white', fontSize: '1.1rem', margin: 0, lineHeight: '1.5' }}>
              {currentPuzzle.explanation}
            </p>
          </div>
          
          <button className="btn btn-primary" onClick={drawPuzzle} style={{ padding: '1rem 2rem', fontSize: '1.1rem', width: '100%' }}>
            {t('chercheintrus.next_question')} <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>
      )}

    </div>
  );
}
