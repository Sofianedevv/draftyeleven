import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, Swords, LayoutGrid, Users, Search, Coins, Target, TrendingUp, Heart } from 'lucide-react';

export default function Home({ onSelectMode }) {
  const { t } = useTranslation();
  return (
    <div className="animate-fade-in" style={{ margin: 'auto', textAlign: 'center', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '800px' }}>
      
      <div style={{ marginBottom: '1rem', display: 'inline-flex', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)', border: '2px solid rgba(255,255,255,0.1)' }}>
        <img src="/logo.jpg" alt="Logo" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
      </div>

      <h1 className="title" style={{ fontSize: '3rem', marginBottom: '0.5rem', letterSpacing: '-1px' }}>
        DRAFTY <span className="title-accent">ELEVEN</span>
      </h1>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2.5rem', fontWeight: '500' }}>
        {t('home.subtitle')}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%', marginBottom: '2rem' }}>
        
        {/* Mode XI de Légende */}
        <div 
          onClick={() => onSelectMode('football_xi')}
          className="mode-card"
          style={{
            background: 'linear-gradient(to bottom, rgba(11,15,25,0.75), rgba(11,15,25,0.95)), url(/pitch_card_bg.jpg) center/cover no-repeat',
            border: '2px solid rgba(209, 214, 211, 0.3)',
            borderRadius: '24px',
            padding: '2rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(157, 163, 161, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(169, 181, 177, 0.3), rgba(11,15,25,0.95)), url(/pitch_card_bg.jpg) center/cover no-repeat';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(167, 187, 181, 0.3)';
            e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(11,15,25,0.75), rgba(11,15,25,0.95)), url(/pitch_card_bg.jpg) center/cover no-repeat';
          }}
        >
          <div style={{ background: 'rgba(16,185,129,0.2)', padding: '1rem', borderRadius: '50%' }}>
            <LayoutGrid size={40} color="var(--success)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>{t('home.mode_xi.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            {t('home.mode_xi.desc')}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <span style={{ background: 'rgba(16,185,129,0.2)', color: 'var(--success)', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>{t('home.mode_xi.tag1')}</span>
            <span style={{ background: 'rgba(16,185,129,0.2)', color: 'var(--success)', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>{t('home.mode_xi.tag2')}</span>
          </div>
        </div>

        {/* Mode Classique */}
        <div 
          onClick={() => onSelectMode('classic')}
          className="mode-card"
          style={{
            background: 'linear-gradient(to bottom, rgba(11,15,25,0.75), rgba(11,15,25,0.95)), url(/street_card_bg.jpg) center/cover no-repeat',
            border: '2px solid rgba(245,158,11,0.3)',
            borderRadius: '24px',
            padding: '2rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(245,158,11,0.2)';
            e.currentTarget.style.borderColor = 'rgba(245,158,11,0.8)';
            e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(245,158,11,0.3), rgba(11,15,25,0.95)), url(/street_card_bg.jpg) center/cover no-repeat';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)';
            e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(11,15,25,0.75), rgba(11,15,25,0.95)), url(/street_card_bg.jpg) center/cover no-repeat';
          }}
        >
          <div style={{ background: 'rgba(245,158,11,0.2)', padding: '1rem', borderRadius: '50%' }}>
            <Swords size={40} color="var(--warning)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>{t('home.mode_5v5.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            {t('home.mode_5v5.desc')}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <span style={{ background: 'rgba(245,158,11,0.2)', color: 'var(--warning)', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>{t('home.mode_5v5.tag1')}</span>
            <span style={{ background: 'rgba(245,158,11,0.2)', color: 'var(--warning)', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>{t('home.mode_5v5.tag2')}</span>
          </div>
        </div>

        {/* Mini-Jeu: Blind Ranking */}
        <div 
          onClick={() => onSelectMode('blind_ranking')}
          className="mode-card"
          style={{
            background: 'linear-gradient(to bottom, rgba(11,15,25,0.75), rgba(11,15,25,0.95)), url(/blind_card_bg.png) center/cover no-repeat',
            border: '2px solid rgba(252, 133, 14, 0.3)',
            borderRadius: '24px',
            padding: '2rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(247, 182, 85, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(247, 166, 85, 0.8)';
            e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(247, 166, 85, 0.3), rgba(11,15,25,0.95)), url(/blind_card_bg.png) center/cover no-repeat';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(247, 169, 85, 0.3)';
            e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(11,15,25,0.75), rgba(11,15,25,0.95)), url(/blind_card_bg.png) center/cover no-repeat';
          }}
        >
          <div style={{ background: 'rgba(247, 161, 85, 0.2)', padding: '1rem', borderRadius: '50%' }}>
            <Trophy size={40} color="#a855f7" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>{t('home.mode_blind.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            {t('home.mode_blind.desc')}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <span style={{ background: 'rgba(247, 171, 85, 0.2)', color: '#a855f7', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>{t('home.mode_blind.tag1')}</span>
            <span style={{ background: 'rgba(247, 161, 85, 0.2)', color: '#a855f7', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>{t('home.mode_blind.tag2')}</span>
          </div>
        </div>

        {/* Mini-Jeu: Start, Bench, Sell */}
        <div 
          onClick={() => onSelectMode('start_bench_sell')}
          className="mode-card"
          style={{
            background: 'linear-gradient(to bottom, rgba(11,15,25,0.75), rgba(11,15,25,0.95)), url(/bench_card_bg.png) center/cover no-repeat',
            border: '2px solid rgba(236,72,153,0.3)',
            borderRadius: '24px',
            padding: '2rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(236,72,153,0.2)';
            e.currentTarget.style.borderColor = 'rgba(236,72,153,0.8)';
            e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(236,72,153,0.3), rgba(11,15,25,0.95)), url(/bench_card_bg.png) center/cover no-repeat';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(236,72,153,0.3)';
            e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(11,15,25,0.75), rgba(11,15,25,0.95)), url(/bench_card_bg.png) center/cover no-repeat';
          }}
        >
          <div style={{ background: 'rgba(236,72,153,0.2)', padding: '1rem', borderRadius: '50%' }}>
            <Users size={40} color="#ec4899" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>{t('home.mode_sbs.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            {t('home.mode_sbs.desc')}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <span style={{ background: 'rgba(236,72,153,0.2)', color: '#ec4899', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>{t('home.mode_blind.tag1')}</span>
            <span style={{ background: 'rgba(236,72,153,0.2)', color: '#ec4899', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>{t('home.mode_sbs.tag2')}</span>
          </div>
        </div>

        {/* Mini-Jeu: Devine le Joueur */}
        <div 
          onClick={() => onSelectMode('mystery_player')}
          className="mode-card"
          style={{
            background: 'linear-gradient(to bottom, rgba(11,15,25,0.75), rgba(11,15,25,0.95)), url(/mystery_card_bg.png) center/cover no-repeat',
            border: '2px solid rgba(234,179,8,0.3)',
            borderRadius: '24px',
            padding: '2rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(234,179,8,0.2)';
            e.currentTarget.style.borderColor = 'rgba(234,179,8,0.8)';
            e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(234,179,8,0.3), rgba(11,15,25,0.95)), url(/mystery_card_bg.png) center/cover no-repeat';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(234,179,8,0.3)';
            e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(11,15,25,0.75), rgba(11,15,25,0.95)), url(/mystery_card_bg.png) center/cover no-repeat';
          }}
        >
          <div style={{ background: 'rgba(234,179,8,0.2)', padding: '1rem', borderRadius: '50%' }}>
            <Search size={40} color="#eab308" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>{t('home.mode_mystery.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            Des indices apparaissent un par un. Sois le premier à crier le nom du joueur !
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <span style={{ background: 'rgba(234,179,8,0.2)', color: '#eab308', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>{t('home.mode_blind.tag1')}</span>
            <span style={{ background: 'rgba(234,179,8,0.2)', color: '#eab308', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>{t('home.mode_prix.tag2')}</span>
          </div>
        </div>

        {/* Mini-Jeu: Le Juste Prix */}
        <div 
          onClick={() => onSelectMode('juste_prix')}
          className="mode-card"
          style={{
            background: 'linear-gradient(to bottom, rgba(11,15,25,0.75), rgba(11,15,25,0.95)), url(/prix_card_bg.png) center/cover no-repeat',
            border: '2px solid rgba(16,185,129,0.3)',
            borderRadius: '24px',
            padding: '2rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(16,185,129,0.2)';
            e.currentTarget.style.borderColor = 'rgba(16,185,129,0.8)';
            e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(16,185,129,0.3), rgba(11,15,25,0.95)), url(/prix_card_bg.png) center/cover no-repeat';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)';
            e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(11,15,25,0.75), rgba(11,15,25,0.95)), url(/prix_card_bg.png) center/cover no-repeat';
          }}
        >
          <div style={{ background: 'rgba(16,185,129,0.2)', padding: '1rem', borderRadius: '50%' }}>
            <Coins size={40} color="var(--success)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>{t('home.mode_prix.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            Devinez le montant d'un transfert historique ! Celui qui est le plus proche gagne.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <span style={{ background: 'rgba(16,185,129,0.2)', color: 'var(--success)', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>{t('home.mode_blind.tag1')}</span>
            <span style={{ background: 'rgba(16,185,129,0.2)', color: 'var(--success)', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>Connaissance</span>
          </div>
        </div>

        {/* Mini-Jeu: Cherche l'Intrus */}
        <div 
          onClick={() => onSelectMode('cherche_intrus')}
          className="mode-card"
          style={{
            background: 'linear-gradient(to bottom, rgba(11,15,25,0.75), rgba(11,15,25,0.95)), url(/intrus_card_bg.png) center/cover no-repeat',
            border: '2px solid rgba(239,68,68,0.3)',
            borderRadius: '24px',
            padding: '2rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(239,68,68,0.2)';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.8)';
            e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(239,68,68,0.3), rgba(11,15,25,0.95)), url(/intrus_card_bg.png) center/cover no-repeat';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
            e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(11,15,25,0.75), rgba(11,15,25,0.95)), url(/intrus_card_bg.png) center/cover no-repeat';
          }}
        >
          <div style={{ background: 'rgba(239,68,68,0.2)', padding: '1rem', borderRadius: '50%' }}>
            <Target size={40} color="var(--danger)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>{t('home.mode_intrus.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            Trouvez l'intrus parmi 4 joueurs qui partagent un point commun.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <span style={{ background: 'rgba(239,68,68,0.2)', color: 'var(--danger)', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>{t('home.mode_blind.tag1')}</span>
            <span style={{ background: 'rgba(239,68,68,0.2)', color: 'var(--danger)', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>{t('home.mode_prix.tag2')}</span>
          </div>
        </div>

        {/* Mini-Jeu: Il a joué avec... */}
        <div 
          onClick={() => onSelectMode('joue_avec')}
          className="mode-card"
          style={{
            background: 'linear-gradient(to bottom, rgba(11,15,25,0.75), rgba(11,15,25,0.95)), url(/joue_avec_card_bg.png) center/cover no-repeat',
            border: '2px solid rgba(59,130,246,0.3)',
            borderRadius: '24px',
            padding: '2rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(59,130,246,0.2)';
            e.currentTarget.style.borderColor = 'rgba(59,130,246,0.8)';
            e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(59,130,246,0.3), rgba(11,15,25,0.95)), url(/joue_avec_card_bg.png) center/cover no-repeat';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)';
            e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(11,15,25,0.75), rgba(11,15,25,0.95)), url(/joue_avec_card_bg.png) center/cover no-repeat';
          }}
        >
          <div style={{ background: 'rgba(59,130,246,0.2)', padding: '1rem', borderRadius: '50%' }}>
            <Users size={40} color="var(--accent)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>{t('home.mode_joue_avec.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            Trouvez le seul joueur qui a joué avec les 4 légendes affichées.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <span style={{ background: 'rgba(59,130,246,0.2)', color: 'var(--accent)', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>{t('home.mode_blind.tag1')}</span>
            <span style={{ background: 'rgba(59,130,246,0.2)', color: 'var(--accent)', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>Mémoire</span>
          </div>
        </div>

        {/* Mini-Jeu: Plus ou Moins */}
        <div 
          onClick={() => onSelectMode('plus_ou_moins')}
          className="mode-card"
          style={{
            background: 'linear-gradient(to bottom, rgba(11,15,25,0.75), rgba(11,15,25,0.95)), url(/plus_moins_card_bg.png) center/cover no-repeat',
            border: '2px solid rgba(168,85,247,0.3)',
            borderRadius: '24px',
            padding: '2rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(168,85,247,0.2)';
            e.currentTarget.style.borderColor = 'rgba(168,85,247,0.8)';
            e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(168,85,247,0.3), rgba(11,15,25,0.95)), url(/plus_moins_card_bg.png) center/cover no-repeat';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)';
            e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(11,15,25,0.75), rgba(11,15,25,0.95)), url(/plus_moins_card_bg.png) center/cover no-repeat';
          }}
        >
          <div style={{ background: 'rgba(168,85,247,0.2)', padding: '1rem', borderRadius: '50%' }}>
            <TrendingUp size={40} color="#a855f7" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>{t('home.mode_plus_ou_moins.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            Higher or Lower : Devinez qui a marqué le plus de buts en Ligue des Champions !
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <span style={{ background: 'rgba(168,85,247,0.2)', color: '#a855f7', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>{t('home.mode_blind.tag1')}</span>
            <span style={{ background: 'rgba(168,85,247,0.2)', color: '#a855f7', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>Survie</span>
          </div>
        </div>

      </div>



    </div>
  );
}
