import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HIGHER_LOWER_DATA } from '../data/higherLowerData';
import { ArrowLeft, ArrowUpCircle, ArrowDownCircle, Trophy, RefreshCcw } from 'lucide-react';

export default function PlusOuMoins({ onBack }) {
  const { t } = useTranslation();
  const [playerA, setPlayerA] = useState(null);
  const [playerB, setPlayerB] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState('playing'); // playing, revealed, gameover
  const [guess, setGuess] = useState(null); // 'higher' or 'lower'
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    startGame();
  }, []);

  const getRandomPlayer = (exclude = []) => {
    const available = HIGHER_LOWER_DATA.filter(p => !exclude.includes(p.name));
    return available[Math.floor(Math.random() * available.length)];
  };

  const startGame = () => {
    const a = getRandomPlayer();
    const b = getRandomPlayer([a.name]);
    setPlayerA(a);
    setPlayerB(b);
    setScore(0);
    setGameState('playing');
    setGuess(null);
    setIsCorrect(null);
  };

  const handleGuess = (direction) => {
    if (gameState !== 'playing') return;

    setGuess(direction);
    setGameState('revealed');

    const bVal = playerB.stat;
    const aVal = playerA.stat;
    
    let correct = false;
    if (direction === 'higher' && bVal >= aVal) correct = true;
    if (direction === 'lower' && bVal <= aVal) correct = true;

    setIsCorrect(correct);

    setTimeout(() => {
      if (correct) {
        setScore(s => {
          const newScore = s + 1;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        
        // Next round
        setPlayerA(playerB);
        setPlayerB(getRandomPlayer([playerB.name]));
        setGameState('playing');
        setGuess(null);
        setIsCorrect(null);
      } else {
        setGameState('gameover');
      }
    }, 2000);
  };

  if (!playerA || !playerB) return null;

  return (
    <div className="glass-panel animate-fade-in" style={{ margin: 'auto', width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={onBack} style={{ padding: '0.5rem 1rem' }}>
          <ArrowLeft size={18} /> {t('plusoumoins.back')}
        </button>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem 1rem', borderRadius: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginRight: '0.5rem' }}>{t('plusoumoins.score')}</span>
            <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1.2rem' }}>{score}</span>
          </div>
          <div style={{ background: 'rgba(234,179,8,0.1)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(234,179,8,0.3)' }}>
            <span style={{ color: 'var(--warning)', fontSize: '0.9rem', marginRight: '0.5rem' }}>{t('plusoumoins.max')}</span>
            <span style={{ color: 'var(--warning)', fontWeight: 'bold', fontSize: '1.2rem' }}>{highScore}</span>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('plusoumoins.title')}</h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          {t('plusoumoins.stat_label')} <strong style={{ color: 'var(--accent)' }}>{t('plusoumoins.stat_value')}</strong>
        </p>
      </div>

      {gameState === 'gameover' ? (
        <div className="animate-pop" style={{ width: '100%', textAlign: 'center', padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '24px', border: '2px solid var(--danger)' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--danger)', margin: '0 0 1rem 0', fontWeight: '900' }}>{t('plusoumoins.game_over')}</h2>
          <p style={{ fontSize: '1.1rem', color: 'white', marginBottom: '1.5rem' }}>
            <strong>{playerB.name}</strong> {t('plusoumoins.has_scored')} <strong>{playerB.stat}</strong> {t('plusoumoins.goals')}.<br/>
            ({t('plusoumoins.you_said')} {guess === 'higher' ? t('plusoumoins.higher') : t('plusoumoins.lower')} {t('plusoumoins.than')} {playerA.stat})
          </p>
          <div style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>
            {t('plusoumoins.final_score')} <strong style={{ color: 'var(--success)' }}>{score}</strong>
          </div>
          <button className="btn btn-primary" onClick={startGame} style={{ padding: '0.8rem 1.5rem', fontSize: '1.1rem' }}>
            <RefreshCcw size={20} /> {t('plusoumoins.play_again')}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', alignItems: 'center' }}>
          
          {/* PLAYER A */}
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: '2px solid var(--surface-border)',
            borderRadius: '24px',
            padding: '1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', margin: '0 0 0.5rem 0' }}>{playerA.name}</h3>
            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{t('plusoumoins.has_scored')}</div>
            <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--accent)', textShadow: '0 0 20px rgba(59, 130, 246, 0.5)', margin: '0.5rem 0' }}>
              {playerA.stat}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t('plusoumoins.goals')}</div>
          </div>

          <div style={{ 
            background: 'rgba(0,0,0,0.5)', 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: '900',
            fontSize: '1.2rem',
            border: '2px solid var(--surface-border)',
            zIndex: 10,
            margin: '-1rem 0'
          }}>
            VS
          </div>

          {/* PLAYER B */}
          <div style={{ 
            background: gameState === 'revealed' ? (isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)') : 'rgba(255,255,255,0.05)', 
            border: `2px solid ${gameState === 'revealed' ? (isCorrect ? 'var(--success)' : 'var(--danger)') : 'var(--surface-border)'}`,
            borderRadius: '24px',
            padding: '1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
            transition: 'all 0.3s'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', margin: '0 0 0.5rem 0' }}>{playerB.name}</h3>
            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{t('plusoumoins.has_scored')}</div>
            
            {gameState === 'revealed' ? (
              <div className="animate-pop" style={{ fontSize: '3rem', fontWeight: '900', color: isCorrect ? 'var(--success)' : 'var(--danger)', margin: '0.5rem 0' }}>
                {playerB.stat}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                <button 
                  className="btn" 
                  onClick={() => handleGuess('higher')}
                  style={{ 
                    background: 'rgba(16, 185, 129, 0.1)', 
                    color: 'var(--success)', 
                    border: '2px solid var(--success)',
                    padding: '0.8rem',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    flex: 1
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}
                >
                  <ArrowUpCircle size={20} /> {t('plusoumoins.higher')}
                </button>
                <button 
                  className="btn" 
                  onClick={() => handleGuess('lower')}
                  style={{ 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    color: 'var(--danger)', 
                    border: '2px solid var(--danger)',
                    padding: '0.8rem',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    flex: 1
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                >
                  <ArrowDownCircle size={20} /> {t('plusoumoins.lower')}
                </button>
              </div>
            )}
            
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textTransform: 'uppercase' }}>
              {gameState === 'revealed' ? t('plusoumoins.goals') : `${t('plusoumoins.than')} ${playerA.stat}`}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
