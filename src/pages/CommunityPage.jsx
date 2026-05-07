import React, { useState, useEffect, useCallback } from 'react';
import { Users, Target, Trash2, ArrowLeftRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as db from '../data/db';
import './TwoColPage.css';

export default function CommunityPage() {
  const { user, addToast } = useApp();
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [allExchanges, setAllExchanges] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Add player form
  const [nickname, setNickname] = useState('');
  const [fullName, setFullName] = useState('');
  const [ownedGames, setOwnedGames] = useState('');
  const [favoriteGames, setFavoriteGames] = useState('');

  // Exchange form
  const [gameOffered, setGameOffered] = useState('');
  const [gameWanted, setGameWanted] = useState('');

  const load = useCallback(async () => {
    const list = await db.getPlayersAsync(user.id);
    setPlayers(list);
    if (selected) {
      const fresh = list.find(p => p.id === selected.id);
      setSelected(fresh || null);
    }
    const ex = await db.getAllExchangeOffersAsync(user.id);
    setAllExchanges(ex);
  }, [user.id, selected?.id]);

  useEffect(() => { load(); }, []);

  const addPlayer = async () => {
    const p = await db.addPlayerAsync(user.id, nickname, fullName, ownedGames, favoriteGames);
    addToast(`Gracz "${p.nickname}" dodany.`, 'success');
    setNickname(''); setFullName(''); setOwnedGames(''); setFavoriteGames('');
    setPlayers(prev => [...prev, p]);
    setSelected(p);
  };

  const deletePlayer = async () => {
    if (!selected) return;
    await db.deletePlayerAsync(selected.id, user.id);
    setPlayers(prev => prev.filter(p => p.id !== selected.id));
    setSelected(null);
    addToast('Gracz usunięty.', 'info');
  };

  const createExchange = async () => {
    if (!selected) return;
    await db.createExchangeAsync(user.id, selected.id, gameOffered, gameWanted);
    setGameOffered(''); setGameWanted('');
    addToast('Oferta wymiany dodana.', 'success');
    load();
  };

  const generateRecommendations = () => {
    if (!selected) return;
    const favs = selected.favoriteGames || [];
    const recs = favs.length > 0
      ? favs.map(g => `Na podstawie "${g}" polecamy: ${g} II, ${g} – Rozszerzenie, Inne gry w stylu ${g}.`)
      : ['Dodaj ulubione gry gracza, aby wygenerować rekomendacje.'];
    setRecommendations(recs);
  };

  const playerExchanges = allExchanges.filter(e => e.playerId === selected?.id);

  return (
    <div className="tcpage">
      <div className="page-header">
        <h1><Users size={24} style={{ verticalAlign: 'middle', marginRight: 8, color: '#9B59B6' }} />
          <span style={{ color: '#9B59B6' }}>Społeczność</span>
        </h1>
      </div>

      <div className="tcpage-cols">
        {/* LEFT */}
        <div className="tcpage-left" style={{ width: 280 }}>
          <div className="card">
            <p className="section-title">Nowy gracz</p>

            <label className="form-label">Nick</label>
            <input value={nickname} onChange={e => setNickname(e.target.value)} />

            <label className="form-label">Imię i nazwisko</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)} />

            <label className="form-label">Posiadane gry (po przecinku)</label>
            <textarea value={ownedGames} onChange={e => setOwnedGames(e.target.value)} rows={2}/>

            <label className="form-label">Ulubione gry (po przecinku)</label>
            <textarea value={favoriteGames} onChange={e => setFavoriteGames(e.target.value)} rows={2} />

            <button
              className="btn-primary"
              style={{ marginTop: 10, width: '100%' }}
              onClick={addPlayer}
              disabled={!nickname}
            >
              Dodaj gracza
            </button>
          </div>

          <p className="section-title">Gracze</p>
          {players.length === 0 && <p style={{ color: 'var(--text2)', fontSize: 13 }}>Brak graczy.</p>}
          {players.map(p => (
            <div
              key={p.id}
              className={`card-inner list-item ${selected?.id === p.id ? 'list-item-active' : ''}`}
              onClick={() => { setSelected(p); setRecommendations([]); }}
              style={{ cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}
            >
              <div className="player-avatar">{p.avatarInitials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--title1)' }}>{p.nickname}</p>
                <p style={{ color: 'var(--text1)', fontSize: 11 }}>{p.fullName}</p>
                <p style={{ color: 'var(--text2)', fontSize: 10 }}>Gier: {p.ownedGames?.length || 0}</p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="tcpage-right">
          {selected ? (
            <>
              {/* Actions */}
              <div className="action-row">
                <button className="btn-primary" onClick={generateRecommendations}>
                  <Target size={14} style={{ marginRight: 6 }} />Rekomendacje
                </button>
                <button className="btn-danger" onClick={deletePlayer}>
                  <Trash2 size={14} style={{ marginRight: 6 }} />Usuń gracza
                </button>
              </div>

              {/* Stats */}
              <div className="card">
                <p className="section-title">Statystyki</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <StatBox value={selected.stats?.gamesPlayed || 0} label="Rozegranych" color="var(--color6)" />
                  <StatBox value={selected.stats?.tournamentsWon || 0} label="Wygranych" color="var(--color3)" />
                  <StatBox value={selected.stats?.eventsAttended || 0} label="Wydarzeń" color="var(--color4)" />
                </div>
              </div>

              {/* Games */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div className="card" style={{ margin: 0 }}>
                  <p className="section-title">Posiadane gry</p>
                  {(selected.ownedGames || []).length === 0 && <p style={{ color: 'var(--text2)', fontSize: 12 }}>Brak.</p>}
                  {(selected.ownedGames || []).map((g, i) => (
                    <p key={i} style={{ fontSize: 12, color: 'var(--title1)', marginBottom: 2 }}>{g}</p>
                  ))}
                </div>
                <div className="card" style={{ margin: 0 }}>
                  <p className="section-title">Ulubione gry</p>
                  {(selected.favoriteGames || []).length === 0 && <p style={{ color: 'var(--text2)', fontSize: 12 }}>Brak.</p>}
                  {(selected.favoriteGames || []).map((g, i) => (
                    <p key={i} style={{ fontSize: 12, color: 'var(--color6)', marginBottom: 2 }}>⭐ {g}</p>
                  ))}
                </div>
              </div>

              {/* Exchange */}
              <div className="card">
                <p className="section-title">Wymiana gier</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'flex-end' }}>
                  <div>
                    <label className="form-label">Oferuję</label>
                    <input value={gameOffered} onChange={e => setGameOffered(e.target.value)} placeholder="Gra do oddania" />
                  </div>
                  <div>
                    <label className="form-label">Szukam</label>
                    <input value={gameWanted} onChange={e => setGameWanted(e.target.value)} placeholder="Gra poszukiwana" />
                  </div>
                  <button
                    className="btn-primary"
                    style={{ padding: '8px 14px', whiteSpace: 'nowrap' }}
                    onClick={createExchange}
                    disabled={!gameOffered || !gameWanted}
                  >
                    + Dodaj
                  </button>
                </div>

                <p style={{ color: 'var(--text1)', fontSize: 12, margin: '10px 0 5px' }}>Aktywne oferty</p>
                {playerExchanges.length === 0 && <p style={{ color: 'var(--text2)', fontSize: 12 }}>Brak ofert.</p>}
                {playerExchanges.map(ex => (
                  <div key={ex.id} className="card-inner" style={{ marginBottom: 4, fontSize: 12 }}>
                    <span style={{ color: 'var(--color4)' }}>{ex.gameOffered}</span>
                    <ArrowLeftRight size={12} color="var(--text2)" style={{ margin: '0 8px', flexShrink: 0 }} />
                    <span style={{ color: 'var(--color3)' }}>{ex.gameWanted}</span>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="card">
                  <p className="section-title">Rekomendacje</p>
                  {recommendations.map((r, i) => (
                    <div key={i} className="card-inner" style={{ marginBottom: 4, fontSize: 12 }}>
                      {r}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="card empty-state">
              <Users size={48} style={{ verticalAlign: 'middle', marginRight: 8, color: '#9B59B6' }} />
              <h3>Wybierz gracza z listy</h3>
              <p>lub dodaj nowego, aby zobaczyć profil</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatBox({ value, label, color }) {
  return (
    <div className="card-inner" style={{ textAlign: 'center', padding: 12 }}>
      <p style={{ color, fontSize: 24, fontWeight: 700 }}>{value}</p>
      <p style={{ color: 'var(--text1)', fontSize: 11 }}>{label}</p>
    </div>
  );
}
