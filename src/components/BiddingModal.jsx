import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Gavel, X, Undo2 } from 'lucide-react';

export default function BiddingModal({ item, biddingState, players, onBid, onCustomBid, onPass, onUndo, canUndo, mode, myPlayerName }) {
  const { t } = useTranslation();
  const activePlayer = players[biddingState.currentPlayerTurnIndex];
  const [customVal, setCustomVal] = useState('');

  const highestBidderName = biddingState.highestBidderIndex !== null 
    ? players[biddingState.highestBidderIndex].name 
    : t('bidding.no_one');

  const isHighestBidder = biddingState.highestBidderIndex === biddingState.currentPlayerTurnIndex;

  const handleCustomSubmit = () => {
    const val = parseInt(customVal);
    if (!isNaN(val) && val > 0) {
      onCustomBid(val);
      setCustomVal('');
    }
  };

  return (
    <div className="bottom-sheet-overlay">
      <div className="bottom-sheet-content">
        
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.25rem', color: 'var(--accent)', textAlign: 'center', lineHeight: '1' }}>
          {item.name}
        </h2>
        {item.specificPosition && (
          <p style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: '800', textAlign: 'center', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {item.specificPosition}
          </p>
        )}
        {item.rating && <p style={{ color: 'var(--warning)', marginBottom: '1.5rem', textAlign: 'center', fontWeight: '800' }}>⭐ {item.rating}</p>}

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '600' }}>{t('bidding.current_bid')}</p>
          <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--success)', margin: '0.5rem 0', lineHeight: '1' }}>
            {biddingState.highestBid}M
          </div>
          <p style={{ fontSize: '1rem' }}>
            {t('bidding.held_by')} <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{highestBidderName}</span>
          </p>
        </div>

        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            {t('bidding.turn_of')} <span style={{ color: 'var(--accent)', fontSize: '1.5rem', fontWeight: '900' }}>{activePlayer.name}</span>
          </p>
          <p style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{t('bidding.available_budget')} {activePlayer.budget}M</p>
        </div>

        {mode === 'online' && activePlayer.name !== myPlayerName ? (
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{t('bidding.waiting_for_player', { name: activePlayer.name })}</p>
          </div>
        ) : isHighestBidder ? (
          <div style={{ padding: '1.5rem', background: 'rgba(59,130,246,0.1)', borderRadius: '16px', border: '2px solid var(--accent)', textAlign: 'center' }}>
            <p style={{ color: 'var(--accent)', fontWeight: '800', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{t('bidding.you_hold_bid')}</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('bidding.waiting_for_others')}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="bidding-actions">
              <button 
                className="btn btn-success" 
                onClick={() => onBid(10)}
                disabled={activePlayer.budget < biddingState.highestBid + 10}
              >
                <Gavel size={20} /> +10M
              </button>
              <button 
                className="btn btn-success" 
                onClick={() => onBid(50)}
                disabled={activePlayer.budget < biddingState.highestBid + 50}
              >
                <Gavel size={20} /> +50M
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="number" 
                placeholder={t('bidding.custom_amount_placeholder')} 
                value={customVal}
                onChange={(e) => setCustomVal(e.target.value)}
                style={{ margin: 0 }}
              />
              <button className="btn" onClick={handleCustomSubmit} style={{ whiteSpace: 'nowrap', width: 'auto' }}>{t('bidding.bid')}</button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button className="btn btn-danger" onClick={onPass} style={{ flex: canUndo ? 2 : 1 }}>
                <X size={20} /> {t('bidding.pass')}
              </button>
              {canUndo && (
                <button className="btn btn-secondary" onClick={onUndo} style={{ flex: 1, padding: '1rem 0' }}>
                  <Undo2 size={20} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
