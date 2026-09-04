import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TRANSFER_PLAYERS } from '../data/transferPlayers';
import { ArrowLeft, Coins, Trophy } from 'lucide-react';

export default function JustePrix({ onBack }) {
  const { t } = useTranslation();
  const [player, setPlayer] = useState(null);
  const [guess1, setGuess1] = useState('');
  const [guess2, setGuess2] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [winner, setWinner] = useState(null);
  const [playedIds, setPlayedIds] = useState([]);

  useEffect(() => {
    drawPlayer();
  }, []);

  const drawPlayer = () => {
    // Éviter de retomber sur les mêmes joueurs
    let available = TRANSFER_PLAYERS.filter((_, i) => !playedIds.includes(i));
    if (available.length === 0) {
      available = TRANSFER_PLAYERS; // Reset si on a tout fait
      setPlayedIds([]);
    }
    
    const randomIndex = Math.floor(Math.random() * available.length);
    const randomPlayer = available[randomIndex];
    const realIndex = TRANSFER_PLAYERS.indexOf(randomPlayer);
    
    setPlayedIds(prev => [...prev, realIndex]);
    setPlayer(randomPlayer);
    setGuess1('');
    setGuess2('');
    setIsRevealed(false);
    setWinner(null);
  };

  const handleReveal = () => {
    if (!guess1 || !guess2) {
      alert(t('justeprix.alert_enter_price'));
      return;
    }

    const g1 = parseInt(guess1);
    const g2 = parseInt(guess2);
    const actual = player.price;

    const diff1 = Math.abs(g1 - actual);
    const diff2 = Math.abs(g2 - actual);

    let roundWinner = null;
    if (diff1 < diff2) {
      setScore1(s => s + 1);
      roundWinner = 1;
    } else if (diff2 < diff1) {
      setScore2(s => s + 1);
      roundWinner = 2;
    } else {
      roundWinner = 0; // Égalité
    }

    setWinner(roundWinner);
    setIsRevealed(true);
  };

  if (!player) return null;

  return (
    <div className="glass-panel animate-fade-in" style={{ margin: 'auto', width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={onBack} style={{ padding: '0.5rem 1rem' }}>
          <ArrowLeft size={18} /> {t('justeprix.back')}
        </button>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 1rem', borderRadius: '12px' }}>
          <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{t('justeprix.p1')}: {score1}</span>
          <span>-</span>
          <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>{t('justeprix.p2')}: {score2}</span>
        </div>
      </div>

      <div style={{ marginBottom: '1rem', display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)' }}>
        <Coins size={32} color="var(--success)" />
      </div>
      <h2 className="title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('justeprix.title')}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center' }}>
        {t('justeprix.subtitle')}
      </p>

      <div className="animate-pop" style={{ 
        background: 'rgba(255,255,255,0.03)', 
        border: '2px solid var(--surface-border)',
        borderRadius: '16px',
        padding: '2rem',
        textAlign: 'center',
        width: '100%',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <h3 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>{player.name}</h3>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>
          {t('justeprix.transfer_to')} <strong style={{ color: 'var(--text-primary)' }}>{player.toClub}</strong> {t('justeprix.in_year')} {player.year}
        </div>

        {isRevealed ? (
          <div className="animate-pop" style={{ 
            marginTop: '2rem',
            background: 'var(--success)', 
            color: '#000',
            padding: '1.5rem 3rem', 
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            fontWeight: '900',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)'
          }}>
            {player.price} M€
          </div>
        ) : (
          <div style={{ 
            marginTop: '2rem',
            background: 'rgba(0,0,0,0.5)', 
            color: 'var(--text-secondary)',
            padding: '1.5rem 3rem', 
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            fontWeight: '900',
            border: '2px dashed var(--text-secondary)'
          }}>
            ? M€
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', width: '100%', marginBottom: '2rem' }}>
        
        {/* Joueur 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 'bold', color: 'var(--accent)', textAlign: 'center' }}>{t('justeprix.player1_guess')}</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="number" 
              min="1" 
              value={guess1}
              onChange={(e) => setGuess1(e.target.value)}
              disabled={isRevealed}
              placeholder="Ex: 80"
              style={{ 
                background: 'rgba(0,0,0,0.3)', 
                border: `2px solid ${winner === 1 ? 'var(--success)' : 'var(--accent)'}`, 
                color: 'white', 
                padding: '1rem', 
                paddingRight: '3rem',
                borderRadius: '12px', 
                fontSize: '1.5rem', 
                textAlign: 'center',
                outline: 'none',
                width: '100%'
              }}
            />
            <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 'bold' }}>M€</span>
          </div>
          {isRevealed && (
            <div style={{ textAlign: 'center', color: winner === 1 ? 'var(--success)' : 'var(--text-secondary)' }}>
              {winner === 1 ? t('justeprix.closest') : t('justeprix.lost')}
            </div>
          )}
        </div>

        {/* Joueur 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 'bold', color: 'var(--danger)', textAlign: 'center' }}>{t('justeprix.player2_guess')}</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="number" 
              min="1" 
              value={guess2}
              onChange={(e) => setGuess2(e.target.value)}
              disabled={isRevealed}
              placeholder="Ex: 105"
              style={{ 
                background: 'rgba(0,0,0,0.3)', 
                border: `2px solid ${winner === 2 ? 'var(--success)' : 'var(--danger)'}`, 
                color: 'white', 
                padding: '1rem', 
                paddingRight: '3rem',
                borderRadius: '12px', 
                fontSize: '1.5rem', 
                textAlign: 'center',
                outline: 'none',
                width: '100%'
              }}
            />
            <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 'bold' }}>M€</span>
          </div>
          {isRevealed && (
            <div style={{ textAlign: 'center', color: winner === 2 ? 'var(--success)' : 'var(--text-secondary)' }}>
              {winner === 2 ? t('justeprix.closest') : t('justeprix.lost')}
            </div>
          )}
        </div>

      </div>

      {!isRevealed ? (
        <button className="btn btn-primary" onClick={handleReveal} style={{ padding: '1.25rem 2rem', fontSize: '1.2rem', width: '100%' }}>
          <Trophy size={20} /> {t('justeprix.reveal_price')}
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: winner === 0 ? 'var(--warning)' : 'var(--success)' }}>
            {winner === 0 ? t('justeprix.tie') : t('justeprix.winner_point', { player: winner, winner })}
          </div>
          <button className="btn" onClick={drawPlayer} style={{ padding: '1rem 2rem', fontSize: '1.1rem', width: '100%' }}>
            {t('justeprix.next_transfer')} <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>
      )}

    </div>
  );
}
