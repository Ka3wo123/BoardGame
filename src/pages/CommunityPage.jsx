import React, { useState, useEffect, useCallback } from 'react';
import { Users, Target, Trash2, ArrowLeftRight, Search, UserPlus, UserCheck, Clock, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as db from '../data/db';
import './TwoColPage.css';
import './CommunityPage.css';

function StatBox({ value, label, color }) {
  return (
    <div className="card-inner" style={{ textAlign: 'center', padding: 12 }}>
      <p style={{ color, fontSize: 24, fontWeight: 700, margin: 0 }}>{value}</p>
      <p style={{ color: 'var(--text2)', fontSize: 11, margin: '2px 0 0' }}>{label}</p>
    </div>
  );
}

export default function CommunityPage() {
  const { user, addToast, language } = useApp();
  const tr = (pl, en) => language === 'en' ? en : pl;
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [allExchanges, setAllExchanges] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Global search
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [friendStatuses, setFriendStatuses] = useState({});

  // Friend requests
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [friends, setFriends] = useState([]);

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

  const loadFriends = useCallback(async () => {
    const reqs = await db.getFriendRequestsAsync(user.id);
    setIncomingRequests(reqs);
    const fr = await db.getFriendsAsync(user.id);
    setFriends(fr);
  }, [user.id]);

  useEffect(() => { loadFriends(); }, []);

  // Global search with debounce
  useEffect(() => {
    if (globalSearch.length < 2) { setSearchResults([]); setSearching(false); setFriendStatuses({}); return; }
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const res = await db.searchPlayersGlobalAsync(globalSearch);
        setSearchResults(res);
        // load friendship statuses for user results
        const statuses = {};
        await Promise.all(res.filter(p => p.isUser).map(async p => {
          const targetId = p.creatorId;
          statuses[targetId] = await db.getFriendshipStatusAsync(user.id, targetId);
        }));
        setFriendStatuses(statuses);
      } catch(e) {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [globalSearch]);

  const sendFriendRequest = async (targetUserId) => {
    const res = await db.sendFriendRequestAsync(user.id, targetUserId);
    if (res.error) { addToast(res.error, 'error'); return; }
    addToast(tr('Zaproszenie wysłane!', 'Friend request sent!'), 'success');
    setFriendStatuses(prev => ({ ...prev, [targetUserId]: 'pending_sent' }));
  };

  const acceptRequest = async (reqId) => {
    await db.acceptFriendRequestAsync(reqId, user.id);
    addToast(tr('Zaproszenie zaakceptowane!', 'Friend request accepted!'), 'success');
    loadFriends();
  };

  const rejectRequest = async (reqId) => {
    await db.rejectFriendRequestAsync(reqId, user.id);
    addToast(tr('Zaproszenie odrzucone.', 'Request declined.'), 'info');
    loadFriends();
  };

  const addFriendAsPlayer = async (targetUserId) => {
    const res = await db.addPlayerFromUserAsync(user.id, targetUserId);
    if (res.error && !res.player) { addToast(res.error, 'error'); return; }
    if (res.error && res.player) { addToast(res.error, 'info'); return; }
    addToast(tr('"', '"') + res.player.nickname + tr('" dodany do Twoich graczy!', '" added to your players!'), 'success');
    const list = await db.getPlayersAsync(user.id);
    setPlayers(list);
  };

  const addPlayer = async () => {
    if (!nickname.trim()) { addToast(tr('Nick jest wymagany.', 'Nickname is required.'), 'error'); return; }
    const p = await db.addPlayerAsync(user.id, nickname, fullName, ownedGames, favoriteGames);
    addToast(tr('Gracz "', 'Player "') + p.nickname + tr('" dodany.', '" added.'), 'success');
    setNickname(''); setFullName(''); setOwnedGames(''); setFavoriteGames('');
    setPlayers(prev => [...prev, p]);
    setSelected(p);
    setRecommendations([]);
  };

  const deletePlayer = async () => {
    if (!selected) return;
    await db.deletePlayerAsync(selected.id, user.id);
    setPlayers(prev => prev.filter(p => p.id !== selected.id));
    setSelected(null);
    addToast(tr('Gracz usunięty.', 'Player removed.'), 'info');
  };

  const createExchange = async () => {
    if (!selected) return;
    await db.createExchangeAsync(user.id, selected.id, gameOffered, gameWanted);
    setGameOffered(''); setGameWanted('');
    addToast(tr('Oferta wymiany dodana.', 'Exchange offer added.'), 'success');
    load();
  };

  const generateRecommendations = () => {
    if (!selected) return;
    const favs = selected.favoriteGames || [];
    const recs = favs.length > 0
      ? favs.map(g => tr('Na podstawie "' + g + '" polecamy: ', 'Based on "' + g + '" we recommend: ') + g + tr(' II, ', ' II, ') + g + tr(' – Rozszerzenie, inne gry w stylu ', ' – Expansion, similar games to ') + g + '.')
      : [tr('Dodaj ulubione gry gracza, aby wygenerować rekomendacje.', "Add the player's favourite games to generate recommendations.")];
    setRecommendations(recs);
  };

  const playerExchanges = allExchanges.filter(e => e.playerId === selected?.id);
  const myPlayers = players; // already filtered by user.id in db

  return (
    <div className="tcpage">
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 4px' }}>
          <Users size={22} color="#9B59B6" />
          <span style={{ color: '#9B59B6' }}>{tr('Społeczność', 'Community')}</span>
        </h1>

        {/* Global search bar */}
        <div className="community-search-bar">
          <Search size={15} color="var(--text2)" />
          <input
            value={globalSearch}
            onChange={e => setGlobalSearch(e.target.value)}
            placeholder={tr('Szukaj gracza po nicku lub imieniu i nazwisku...', 'Search player by nickname or name...')}
            className="community-search-input"
          />
          {searching && <span style={{ fontSize: 11, color: 'var(--text2)' }}>...</span>}
        </div>

        {/* Search results */}
        {globalSearch.length >= 2 && (
          <div className="community-search-results">
            {searchResults.length === 0 && !searching && (
              <p style={{ color: 'var(--text2)', fontSize: 12, padding: '8px 0' }}>{tr('Brak wyników dla', 'No results for')} "{globalSearch}"</p>
            )}
            {searchResults.map(p => {
              const status = p.isUser ? (friendStatuses[p.creatorId] || 'none') : null;
              return (
                <div key={p.id} className={"community-search-result-item " + (selected?.id === p.id ? 'active' : '')} onClick={() => { setSelected(p); setRecommendations([]); setGlobalSearch(''); setSearchResults([]); }}>
                  <div className="player-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{p.avatarInitials}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--title1)', margin: 0 }}>{p.nickname}</p>
                    <p style={{ color: 'var(--text2)', fontSize: 11, margin: 0 }}>{p.fullName} • {tr('Gier', 'Games')}: {p.ownedGames?.length || 0}</p>
                  </div>
                  {p.isUser && p.creatorId !== user.id && (
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                      {status === 'friends' ? (
                        <>
                          <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'var(--color3)' }}><UserCheck size={13}/>{tr('Znajomy', 'Friend')}</span>
                          <button className="btn-primary" style={{ padding:'2px 8px', fontSize:10 }} onClick={e => { e.stopPropagation(); addFriendAsPlayer(p.creatorId); }}>
                            <UserPlus size={11} style={{ marginRight:3 }}/>{tr('Dodaj do graczy', 'Add as player')}
                          </button>
                        </>
                      ) : status === 'pending_sent' ? (
                        <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'var(--text2)' }}><Clock size={13}/>{tr('Wysłano', 'Sent')}</span>
                      ) : status === 'pending_received' ? (
                        <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'var(--color4)' }}><Clock size={13}/>{tr('Czeka na Ciebie', 'Awaiting you')}</span>
                      ) : (
                        <button className="btn-primary" style={{ padding:'3px 10px', fontSize:11 }} onClick={e => { e.stopPropagation(); sendFriendRequest(p.creatorId); }}>
                          <UserPlus size={12} style={{ marginRight:4 }}/>{tr('Dodaj do znajomych', 'Add friend')}
                        </button>
                      )}
                    </div>
                  )}
                  {!p.isUser && p.creatorId !== user.id && <span style={{ fontSize: 10, color: 'var(--purple)', background: 'var(--panel-active)', padding: '2px 6px', borderRadius: 4 }}>{tr('profil', 'profile')}</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="tcpage-cols">
        {/* LEFT */}
        <div className="tcpage-left" style={{ width: 280 }}>
          <div className="card">
            <p className="section-title">{tr('Nowy gracz', 'New player')}</p>

            <label className="form-label">{tr('NICK', 'NICKNAME')} *</label>
            <input value={nickname} onChange={e => setNickname(e.target.value)} placeholder={tr('np. KingPawn99', 'e.g. KingPawn99')} />

            <label className="form-label">{tr('Imię i nazwisko', 'Full name')}</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder={tr('np. Jan Kowalski', 'e.g. John Doe')} />

            <label className="form-label">{tr('Posiadane gry (po przecinku)', 'Owned games (comma separated)')}</label>
            <textarea value={ownedGames} onChange={e => setOwnedGames(e.target.value)} rows={2} placeholder="Catan, Dominion, ..." />

            <label className="form-label">{tr('Ulubione gry (po przecinku)', 'Favourite games (comma separated)')}</label>
            <textarea value={favoriteGames} onChange={e => setFavoriteGames(e.target.value)} rows={2} placeholder="Catan, ..." />

            <button className="btn-primary" style={{ marginTop: 10, width: '100%' }} onClick={addPlayer} disabled={!nickname.trim()}>
              {tr('Dodaj gracza', 'Add player')}
            </button>
          </div>

          <p className="section-title" style={{ marginTop: 10 }}>{tr('Moi gracze', 'My players')} ({myPlayers.length})</p>
          {myPlayers.length === 0 && <p style={{ color: 'var(--text2)', fontSize: 12 }}>{tr('Brak graczy. Dodaj pierwszego!', 'No players yet. Add the first one!')}</p>}

          {/* Incoming friend requests */}
          {incomingRequests.length > 0 && (
            <div className="card" style={{ marginBottom: 10, padding: 10 }}>
              <p className="section-title" style={{ marginBottom: 6 }}>{tr('Zaproszenia', 'Requests')} ({incomingRequests.length})</p>
              {incomingRequests.map(req => (
                <div key={req.id} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                  <div className="player-avatar" style={{ width:28, height:28, fontSize:11 }}>{(req.fromDisplayName[0]||'?').toUpperCase()}</div>
                  <span style={{ flex:1, fontSize:12, color:'var(--title1)' }}>{req.fromDisplayName}</span>
                  <button className="btn-primary" style={{ padding:'2px 8px', fontSize:11 }} onClick={() => acceptRequest(req.id)}><Check size={11}/></button>
                  <button className="btn-danger" style={{ padding:'2px 8px', fontSize:11 }} onClick={() => rejectRequest(req.id)}><X size={11}/></button>
                </div>
              ))}
            </div>
          )}

          {/* Friends list */}
          {friends.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <p className="section-title" style={{ marginBottom: 4 }}>{tr('Znajomi', 'Friends')} ({friends.length})</p>
              {friends.map(f => {
                const alreadyPlayer = players.find(p => p.linkedUserId === f.userId);
                return (
                  <div key={f.friendshipId} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, padding:'6px 8px', background:'var(--panel)', borderRadius:8 }}>
                    <div className="player-avatar" style={{ width:28, height:28, fontSize:11 }}>{(f.displayName[0]||'?').toUpperCase()}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:12, color:'var(--title1)', margin:0, fontWeight:600 }}>{f.displayName}</p>
                      {alreadyPlayer && <p style={{ fontSize:10, color:'var(--color3)', margin:0 }}>✓ {tr('gracz na liście', 'in player list')}</p>}
                    </div>
                    {!alreadyPlayer ? (
                      <button className="btn-primary" style={{ padding:'2px 8px', fontSize:10, whiteSpace:'nowrap' }} onClick={() => addFriendAsPlayer(f.userId)}>
                        <UserPlus size={11} style={{ marginRight:3 }}/>{tr('Dodaj', 'Add')}
                      </button>
                    ) : (
                      <UserCheck size={13} color="var(--color3)" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {myPlayers.map(p => (
            <div key={p.id} className={"card-inner list-item " + (selected?.id === p.id ? 'list-item-active' : '')} onClick={() => { setSelected(p); setRecommendations([]); }} style={{ cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
              <div className="player-avatar">{p.avatarInitials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--title1)', margin: 0 }}>{p.nickname}</p>
                <p style={{ color: 'var(--text1)', fontSize: 11, margin: 0 }}>{p.fullName}</p>
                <p style={{ color: 'var(--text2)', fontSize: 10, margin: 0 }}>{tr('Gier', 'Games')}: {p.ownedGames?.length || 0}</p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="tcpage-right">
          {selected ? (
            <>
              {/* Profile header */}
              <div className="card" style={{ display:'flex', alignItems:'center', gap:16, marginBottom:10 }}>
                <div className="player-avatar" style={{ width:56, height:56, fontSize:22, flexShrink:0 }}>{selected.avatarInitials}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:20, fontWeight:700, color:'var(--title1)', margin:0 }}>{selected.nickname}</p>
                  {selected.fullName && selected.fullName !== selected.nickname && (
                    <p style={{ fontSize:13, color:'var(--text2)', margin:'2px 0 0' }}>{selected.fullName}</p>
                  )}
                  {selected.isUser && (
                    <span style={{ display:'inline-block', marginTop:4, fontSize:11, color:'var(--purple)', background:'var(--panel-active)', padding:'2px 8px', borderRadius:12 }}>
                      👤 {tr('Użytkownik platformy', 'Platform user')}
                    </span>
                  )}
                  {!selected.isUser && selected.creatorId !== user.id && (
                    <span style={{ display:'inline-block', marginTop:4, fontSize:11, color:'var(--text2)', background:'var(--panel)', padding:'2px 8px', borderRadius:12 }}>
                      {tr('Profil społeczności', 'Community profile')}
                    </span>
                  )}
                  {selected.creatorId === user.id && !selected.isUser && (
                    <span style={{ display:'inline-block', marginTop:4, fontSize:11, color:'var(--color3)', background:'var(--panel)', padding:'2px 8px', borderRadius:12 }}>
                      {tr('Twój gracz', 'Your player')}
                    </span>
                  )}
                </div>
                {selected.isUser && selected.creatorId !== user.id && (
                  <button className="btn-primary" style={{ padding:'6px 12px', fontSize:12, flexShrink:0 }}
                    onClick={() => addFriendAsPlayer(selected.creatorId)}>
                    <UserPlus size={13} style={{ marginRight:4 }}/>{tr('Dodaj do graczy', 'Add as player')}
                  </button>
                )}
              </div>

              <div className="action-row">
                <button className="btn-primary" onClick={generateRecommendations}><Target size={14} style={{ marginRight: 6 }} />{tr('Rekomendacje', 'Recommendations')}</button>
                {selected.creatorId === user.id && (
                  <button className="btn-danger" onClick={deletePlayer}><Trash2 size={14} style={{ marginRight: 6 }} />{tr('Usuń gracza', 'Remove player')}</button>
                )}
              </div>

              <div className="card">
                <p className="section-title">{tr('Statystyki', 'Statistics')}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <StatBox value={selected.stats?.gamesPlayed || 0} label={tr('Rozegranych', 'Played')} color="var(--color6)" />
                  <StatBox value={selected.stats?.tournamentsWon || 0} label={tr('Wygranych', 'Won')} color="var(--color3)" />
                  <StatBox value={selected.stats?.eventsAttended || 0} label={tr('Wydarzeń', 'Events')} color="var(--color4)" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div className="card" style={{ margin: 0 }}>
                  <p className="section-title">{tr('Posiadane gry', 'Owned games')}</p>
                  {(selected.ownedGames || []).length === 0 && <p style={{ color: 'var(--text2)', fontSize: 12 }}>{tr('Brak.', 'None.')}</p>}
                  {(selected.ownedGames || []).map((g, i) => <p key={i} style={{ fontSize: 12, color: 'var(--title1)', marginBottom: 2 }}>{g}</p>)}
                </div>
                <div className="card" style={{ margin: 0 }}>
                  <p className="section-title">{tr('Ulubione gry', 'Favourite games')}</p>
                  {(selected.favoriteGames || []).length === 0 && <p style={{ color: 'var(--text2)', fontSize: 12 }}>{tr('Brak.', 'None.')}</p>}
                  {(selected.favoriteGames || []).map((g, i) => <p key={i} style={{ fontSize: 12, color: 'var(--color6)', marginBottom: 2 }}>⭐ {g}</p>)}
                </div>
              </div>

              {selected.creatorId === user.id && (
                <div className="card">
                  <p className="section-title">{tr('Wymiana gier', 'Game exchange')}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'flex-end' }}>
                    <div><label className="form-label">{tr('Oferuję', 'Offering')}</label><input value={gameOffered} onChange={e => setGameOffered(e.target.value)} placeholder={tr('Gra do oddania', 'Game to give')} /></div>
                    <div><label className="form-label">{tr('Szukam', 'Looking for')}</label><input value={gameWanted} onChange={e => setGameWanted(e.target.value)} placeholder={tr('Gra poszukiwana', 'Wanted game')} /></div>
                    <button className="btn-primary" style={{ padding: '8px 14px' }} onClick={createExchange} disabled={!gameOffered || !gameWanted}>+ {tr('Dodaj', 'Add')}</button>
                  </div>
                  <p style={{ color: 'var(--text1)', fontSize: 12, margin: '10px 0 5px' }}>{tr('Aktywne oferty', 'Active offers')}</p>
                  {playerExchanges.length === 0 && <p style={{ color: 'var(--text2)', fontSize: 12 }}>{tr('Brak ofert.', 'No offers.')}</p>}
                  {playerExchanges.map(ex => (
                    <div key={ex.id} className="card-inner" style={{ marginBottom: 4, fontSize: 12 }}>
                      <span style={{ color: 'var(--color4)' }}>{ex.gameOffered}</span>
                      <ArrowLeftRight size={12} color="var(--text2)" style={{ margin: '0 8px' }} />
                      <span style={{ color: 'var(--color3)' }}>{ex.gameWanted}</span>
                    </div>
                  ))}
                </div>
              )}

              {recommendations.length > 0 && (
                <div className="card">
                  <p className="section-title">{tr('Rekomendacje', 'Recommendations')}</p>
                  {recommendations.map((r, i) => <div key={i} className="card-inner" style={{ marginBottom: 4, fontSize: 12 }}>{r}</div>)}
                </div>
              )}
            </>
          ) : (
            <div className="card empty-state">
              <Users size={48} color="#9B59B6" />
              <h3>{tr('Wybierz gracza z listy', 'Select a player')}</h3>
              <p>{tr('lub skorzystaj z wyszukiwarki powyżej', 'or use the search bar above')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
