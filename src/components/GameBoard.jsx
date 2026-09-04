import React from 'react';
import { createPortal } from 'react-dom';
import { Undo2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BiddingModal from './BiddingModal';

export default function GameBoard({ gameState, setGameState, onEnd, mode, myPlayerName, onUndo, canUndo }) {
  const { t } = useTranslation();
  const { players, itemsPool, currentItem, biddingState, phase, turnIndex } = gameState;

  const maxCards = gameState.gameType === 'football_xi' ? 999 : 5;

  const handleCardClick = (itemIndex) => {
    if (phase !== 'board') return;
    
    if (mode === 'online' && players[turnIndex].name !== myPlayerName) {
      alert(t('gameboard.turn_alert', { name: players[turnIndex].name }));
      return;
    }

    const item = itemsPool[itemIndex];
    if (item.revealed) return;

    // Vérifier si c'est la bonne carte dans l'ordre séquentiel (seulement pour football_xi)
    if (gameState.gameType === 'football_xi') {
      const firstUnrevealedIndex = itemsPool.findIndex(i => !i.revealed);
      if (itemIndex !== firstUnrevealedIndex) {
        alert(t('gameboard.legendary_xi_order_alert'));
        return;
      }
    }

    const initialPassed = players
      .map((p, i) => {
        if (p.drafted.length >= maxCards) return i;
        return -1;
      })
      .filter(i => i !== -1);

    const newPlayers = [...players];
    const newPool = [...itemsPool];
    newPool[itemIndex].revealed = true;

    // Si tout le monde passe (équipes pleines ou budget 0)
    if (initialPassed.length === players.length) {
       const unrevealedLeft = newPool.filter(i => !i.revealed).length;
       
       if (unrevealedLeft === 0 || newPlayers.every(p => p.drafted.length >= maxCards)) {
         setGameState({ ...gameState, players: newPlayers, itemsPool: newPool, phase: 'end' });
         onEnd();
       } else {
         let nextTurn = (turnIndex + 1) % players.length;
         setGameState({ ...gameState, players: newPlayers, itemsPool: newPool, turnIndex: nextTurn });
       }
       return;
    }

    // Sinon, on cherche le premier joueur éligible (le tireur ou le suivant)
    let nextTurn = turnIndex;
    if (initialPassed.includes(nextTurn)) {
      nextTurn = (nextTurn + 1) % players.length;
      while (initialPassed.includes(nextTurn)) {
        nextTurn = (nextTurn + 1) % players.length;
      }
    }

    // S'il ne reste qu'un seul joueur éligible, il gagne la carte automatiquement pour 0M
    if (initialPassed.length === players.length - 1) {
       newPlayers[nextTurn].drafted.push({ ...newPool[itemIndex], price: 0 });
       newPool[itemIndex].draftedBy = nextTurn;
       
       const unrevealedLeft = newPool.filter(i => !i.revealed).length;
       if (unrevealedLeft === 0 || newPlayers.every(p => p.drafted.length >= maxCards)) {
         setGameState({ ...gameState, players: newPlayers, itemsPool: newPool, phase: 'end' });
         onEnd();
       } else {
         let nextDrawTurn = (turnIndex + 1) % players.length;
         setGameState({ ...gameState, players: newPlayers, itemsPool: newPool, turnIndex: nextDrawTurn });
       }
       return;
    }

    // Sinon, au moins 2 joueurs éligibles. nextTurn prend automatiquement l'enchère à 0M.
    let biddingPlayer = (nextTurn + 1) % players.length;
    while (initialPassed.includes(biddingPlayer)) {
      biddingPlayer = (biddingPlayer + 1) % players.length;
    }

    setGameState({
      ...gameState,
      itemsPool: newPool,
      currentItem: { ...newPool[itemIndex], poolIndex: itemIndex },
      phase: 'bidding',
      biddingState: {
        highestBid: 0,
        highestBidderIndex: nextTurn,
        currentPlayerTurnIndex: biddingPlayer,
        passedPlayers: initialPassed
      }
    });
  };

  const handleBid = (amount) => {
    const activePlayerIndex = biddingState.currentPlayerTurnIndex;
    const playerBudget = players[activePlayerIndex].budget;
    
    const newBid = biddingState.highestBid + amount;
    
    if (newBid > playerBudget) {
      alert(t('gameboard.insufficient_funds'));
      return;
    }

    if (biddingState.passedPlayers.length >= players.length - 1) {
      resolveBidding(newBid, activePlayerIndex);
    } else {
      advanceTurn(newBid, activePlayerIndex, biddingState.passedPlayers);
    }
  };

  const handleCustomBid = (amount) => {
    const activePlayerIndex = biddingState.currentPlayerTurnIndex;
    const playerBudget = players[activePlayerIndex].budget;
    
    if (amount <= biddingState.highestBid) {
      alert(t('gameboard.higher_bid_alert'));
      return;
    }

    if (amount > playerBudget) {
      alert(t('gameboard.insufficient_funds'));
      return;
    }

    if (biddingState.passedPlayers.length >= players.length - 1) {
      resolveBidding(amount, activePlayerIndex);
    } else {
      advanceTurn(amount, activePlayerIndex, biddingState.passedPlayers);
    }
  };

  const handlePass = () => {
    const activePlayerIndex = biddingState.currentPlayerTurnIndex;
    const newPassed = [...biddingState.passedPlayers, activePlayerIndex];
    
    if (newPassed.length >= players.length - 1 && biddingState.highestBidderIndex !== null) {
      // Bidding ends
      resolveBidding(biddingState.highestBid, biddingState.highestBidderIndex);
    } else if (newPassed.length === players.length) {
      // Everyone passed
      resolveBidding(0, null);
    } else {
      advanceTurn(biddingState.highestBid, biddingState.highestBidderIndex, newPassed);
    }
  };

  const advanceTurn = (newBid, highestBidderIndex, passedPlayers) => {
    let nextTurn = (biddingState.currentPlayerTurnIndex + 1) % players.length;
    while (passedPlayers.includes(nextTurn)) {
      nextTurn = (nextTurn + 1) % players.length;
    }

    setGameState({
      ...gameState,
      biddingState: {
        highestBid: newBid,
        highestBidderIndex,
        currentPlayerTurnIndex: nextTurn,
        passedPlayers
      }
    });
  };

  const resolveBidding = (winningBid, winnerIndex) => {
    const newPlayers = [...players];
    const newPool = [...itemsPool];
    
    if (winnerIndex !== null) {
      newPlayers[winnerIndex].budget -= winningBid;
      newPlayers[winnerIndex].drafted.push({ ...currentItem, price: winningBid });
      newPool[currentItem.poolIndex].draftedBy = winnerIndex;
    }

    const unrevealedLeft = newPool.filter(i => !i.revealed).length;
    
    if (unrevealedLeft === 0 || newPlayers.every(p => p.drafted.length >= maxCards)) {
      // Game over
      setGameState({
        ...gameState,
        players: newPlayers,
        itemsPool: newPool,
        phase: 'end'
      });
      onEnd();
    } else {
      // Next turn
      setGameState({
        ...gameState,
        players: newPlayers,
        itemsPool: newPool,
        currentItem: null,
        biddingState: null,
        phase: 'board',
        turnIndex: (turnIndex + 1) % players.length
      });
    }
  };

  const firstUnrevealed = itemsPool.find(i => !i.revealed);
  const currentPosition = firstUnrevealed ? firstUnrevealed.position : '';

  return (
    <div className="animate-fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div>
           <h2 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0, lineHeight: 1 }}>{t('gameboard.draft_in_progress')}</h2>
           {gameState.gameType === 'football_xi' && currentPosition && (
             <div style={{ color: '#10b981', fontWeight: '800', fontSize: '1.1rem', marginTop: '0.25rem' }}>
               {t('gameboard.position_to_draft')}: {currentPosition}
             </div>
           )}
           {phase === 'board' && (
             <div style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.9rem', marginTop: '0.25rem' }}>
               {t('gameboard.drawer')}: {players[turnIndex].name}
             </div>
           )}
         </div>
         {canUndo && (
           <button onClick={onUndo} className="btn btn-secondary" style={{ padding: '0.75rem', width: 'auto', borderRadius: '50%' }}>
             <Undo2 size={20} />
           </button>
         )}
      </div>

      <div className="card-grid">
        {itemsPool.map((item, idx) => {
          let cardClass = "game-card";
          if (item.revealed) cardClass += " revealed";
          if (item.draftedBy !== null) cardClass += " drafted";

          return (
            <div 
              key={idx} 
              className={cardClass}
              onClick={() => handleCardClick(idx)}
            >
              {!item.revealed ? (
                <span className="card-number">{idx + 1}</span>
              ) : (
                <div className="card-content animate-flip">
                  <div className="card-name">{item.name}</div>
                  {item.rating && <div style={{ fontSize: '0.8rem', color: 'var(--warning)', fontWeight: '800' }}>⭐ {item.rating}</div>}
                  {item.specificPosition && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '700', marginTop: '0.25rem', backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      {item.specificPosition}
                    </div>
                  )}
                  {item.draftedBy !== null && (
                    <div className="card-owner" style={{ marginTop: '0.5rem', color: '#10b981' }}>
                      {players[item.draftedBy].name}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>{t('gameboard.budgets_teams')}</h3>
        <div className="player-stats-list">
          {players.map((p, idx) => (
            <div key={idx} className={`player-stat-row ${phase === 'board' && turnIndex === idx ? 'active' : ''}`}>
              <div style={{ fontWeight: '600' }}>{p.name}</div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{p.drafted.length} {t('gameboard.drafts')}</span>
                <span style={{ color: 'var(--accent)', fontWeight: '800', fontSize: '1.1rem' }}>{p.budget}M</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {phase === 'bidding' && currentItem && biddingState && createPortal(
        <BiddingModal 
          item={currentItem}
          biddingState={biddingState}
          players={players}
          onBid={handleBid}
          onCustomBid={handleCustomBid}
          onPass={handlePass}
          onUndo={onUndo}
          canUndo={canUndo}
          mode={mode}
          myPlayerName={myPlayerName}
        />,
        document.body
      )}
    </div>
  );
}
