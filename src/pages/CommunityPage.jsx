import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { user, addToast } = useApp();
  const { t } = useTranslation();
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
    addToast(t('community.toasts2.requestSent'), 'success');
    setFriendStatuses(prev => ({ ...prev, [targetUserId]: 'pending_sent' }));
  };

  const acceptRequest = async (reqId) => {
    await db.acceptFriendRequestAsync(reqId, user.id);
    addToast(t('community.toasts2.requestAccepted'), 'success');
    loadFriends();
  };

  const rejectRequest = async (reqId) => {
    await db.rejectFriendRequestAsync(reqId, user.id);
    addToast(t('community.toasts2.requestDeclined'), 'info');
    loadFriends();
  };

  const addFriendAsPlayer = async (targetUserId) => {
    const res = await db.addPlayerFromUserAsync(user.id, targetUserId);
    if (res.error && !res.player) { addToast(res.error, 'error'); return; }
    if (res.error && res.player) { addToast(res.error, 'info'); return; }
    addToast(t('community.toasts2.addedToPlayers', { nickname: res.player.nickname }), 'success');
    const list = await db.getPlayersAsync(user.id);
    setPlayers(list);
  };

  const addPlayer = async () => {
    if (!nickname.trim()) { addToast(t('community.toasts2.nicknameRequired'), 'error'); return; }
    const p = await db.addPlayerAsync(user.id, nickname, fullName, ownedGames, favoriteGames);
    addToast(t('community.toasts.playerAdded', { nickname: p.nickname }), 'success');
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
    addToast(t('community.toasts2.playerRemoved'), 'info');
  };

  const createExchange = async () => {
    if (!selected) return;
    await db.createExchangeAsync(user.id, selected.id, gameOffered, gameWanted);
    setGameOffered(''); setGameWanted('');
    addToast(t('community.toasts.offerAdded'), 'success');
    load();
  };

  const generateRecommendations = () => {
    if (!selected) return;
    const favs = selected.favoriteGames || [];
    const recs = favs.length > 0
      ? favs.map(g => t('community.recommendations.basedOn', { game: g }))
      : [t('community.recommendations.empty')];
    setRecommendations(recs);
  };

  const playerExchanges = allExchanges.filter(e => e.playerId === selected?.id);
  const myPlayers = players; // already filtered by user.id in db

  return (
    <div className="tcpage">
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 4px' }}>
          <Users size={22} color="#9B59B6" />
          <span style={{ color: '#9B59B6' }}>{t('community.title')}</span>
        </h1>

        {/* Global search bar */}
        <div className="community-search-bar">
          <Search size={20} color="var(--text2)" />
          <input
            value={globalSearch}
            onChange={e => setGlobalSearch(e.target.value)}
            placeholder={t('community.search.placeholder')}
            className="community-search-input"
          />
          {searching && <span style={{ fontSize: 11, color: 'var(--text2)' }}>...</span>}
        </div>

        {/* Search results */}
        {globalSearch.length >= 2 && (
          <div className="community-search-results">
            {searchResults.length === 0 && !searching && (
              <p style={{ color: 'var(--text2)', fontSize: 12, padding: '8px 0' }}>{t('community.search.noResults')} "{globalSearch}"</p>
            )}
            {searchResults.map(p => {
              const status = p.isUser ? (friendStatuses[p.creatorId] || 'none') : null;
              return (
                <div key={p.id} className={"community-search-result-item " + (selected?.id === p.id ? 'active' : '')} onClick={() => { setSelected(p); setRecommendations([]); setGlobalSearch(''); setSearchResults([]); }}>
                  <div className="player-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{p.avatarInitials}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--title1)', margin: 0 }}>{p.nickname}</p>
                    <p style={{ color: 'var(--text2)', fontSize: 11, margin: 0 }}>{p.fullName} &middot; {t('community.search.games')}: {p.ownedGames?.length || 0}</p>
                  </div>
                  {p.isUser && p.creatorId !== user.id && (
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                      {status === 'friends' ? (
                        <>
                          <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'var(--color3)' }}><UserCheck size={13}/>{t('community.search.friend')}</span>
                          <button className="btn-primary" style={{ padding:'2px 8px', fontSize:10 }} onClick={e => { e.stopPropagation(); addFriendAsPlayer(p.creatorId); }}>
                            <UserPlus size={11} style={{ marginRight:3 }}/>{t('community.search.addAsPlayer')}
                          </button>
                        </>
                      ) : status === 'pending_sent' ? (
                        <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'var(--text2)' }}><Clock size={13}/>{t('community.search.sent')}</span>
                      ) : status === 'pending_received' ? (
                        <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'var(--color4)' }}><Clock size={13}/>{t('community.search.awaitingYou')}</span>
                      ) : (
                        <button className="btn-primary" style={{ padding:'3px 10px', fontSize:11 }} onClick={e => { e.stopPropagation(); sendFriendRequest(p.creatorId); }}>
                          <UserPlus size={12} style={{ marginRight:4 }}/>{t('community.search.addFriend')}
                        </button>
                      )}
                    </div>
                  )}
                  {!p.isUser && p.creatorId !== user.id && <span style={{ fontSize: 10, color: 'var(--purple)', background: 'var(--panel-active)', padding: '2px 6px', borderRadius: 4 }}>{t('community.search.profile')}</span>}
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
            <p className="section-title">{t('community.newPlayer')}</p>

            <label className="form-label">{t('community.form.nicknameLabel')} *</label>
            <input value={nickname} onChange={e => setNickname(e.target.value)} placeholder={t('community.form.nicknamePlaceholder')} />

            <label className="form-label">{t('community.fullName')}</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder={t('community.form.fullNamePlaceholder')} />

            <label className="form-label">{t('community.form.ownedGamesLabel')}</label>
            <textarea value={ownedGames} onChange={e => setOwnedGames(e.target.value)} rows={2} placeholder="Catan, Dominion, ..." />

            <label className="form-label">{t('community.form.favoriteGamesLabel')}</label>
            <textarea value={favoriteGames} onChange={e => setFavoriteGames(e.target.value)} rows={2} placeholder="Catan, ..." />

            <button className="btn-primary" style={{ marginTop: 10, width: '100%' }} onClick={addPlayer} disabled={!nickname.trim()}>
              {t('community.btnAddPlayer')}
            </button>
          </div>

          <p className="section-title" style={{ marginTop: 10 }}>{t('community.myPlayers')} ({myPlayers.length})</p>
          {myPlayers.length === 0 && <p style={{ color: 'var(--text2)', fontSize: 12 }}>{t('community.noPlayersAddFirst')}</p>}

          {/* Incoming friend requests */}
          {incomingRequests.length > 0 && (
            <div className="card" style={{ marginBottom: 10, padding: 10 }}>
              <p className="section-title" style={{ marginBottom: 6 }}>{t('community.requests')} ({incomingRequests.length})</p>
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
              <p className="section-title" style={{ marginBottom: 4 }}>{t('community.friends')} ({friends.length})</p>
              {friends.map(f => {
                const alreadyPlayer = players.find(p => p.linkedUserId === f.userId);
                return (
                  <div key={f.friendshipId} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, padding:'6px 8px', background:'var(--panel)', borderRadius:8 }}>
                    <div className="player-avatar" style={{ width:28, height:28, fontSize:11 }}>{(f.displayName[0]||'?').toUpperCase()}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:12, color:'var(--title1)', margin:0, fontWeight:600 }}>{f.displayName}</p>
                      {alreadyPlayer && <p style={{ fontSize:10, color:'var(--color3)', margin:0 }}><Check size={10} style={{verticalAlign:'middle',marginRight:2}}/> {t('community.inPlayerList')}</p>}
                    </div>
                    {!alreadyPlayer ? (
                      <button className="btn-primary" style={{ padding:'2px 8px', fontSize:10, whiteSpace:'nowrap' }} onClick={() => addFriendAsPlayer(f.userId)}>
                        <UserPlus size={11} style={{ marginRight:3 }}/>{t('community.btnAdd')}
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
                <p style={{ color: 'var(--text2)', fontSize: 10, margin: 0 }}>{t('community.gamesShort')}: {p.ownedGames?.length || 0}</p>
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
                      <Users size={11} style={{verticalAlign:'middle',marginRight:3}}/> {t('community.profile.platformUser')}
                    </span>
                  )}
                  {!selected.isUser && selected.creatorId !== user.id && (
                    <span style={{ display:'inline-block', marginTop:4, fontSize:11, color:'var(--text2)', background:'var(--panel)', padding:'2px 8px', borderRadius:12 }}>
                      {t('community.profile.communityProfile')}
                    </span>
                  )}
                  {selected.creatorId === user.id && !selected.isUser && (
                    <span style={{ display:'inline-block', marginTop:4, fontSize:11, color:'var(--color3)', background:'var(--panel)', padding:'2px 8px', borderRadius:12 }}>
                      {t('community.profile.yourPlayer')}
                    </span>
                  )}
                </div>
                {selected.isUser && selected.creatorId !== user.id && (
                  <button className="btn-primary" style={{ padding:'6px 12px', fontSize:12, flexShrink:0 }}
                    onClick={() => addFriendAsPlayer(selected.creatorId)}>
                    <UserPlus size={13} style={{ marginRight:4 }}/>{t('community.profile.addAsPlayer')}
                  </button>
                )}
              </div>

              <div className="action-row">
                <button className="btn-primary" onClick={generateRecommendations}><Target size={14} style={{ marginRight: 6 }} />{t('community.actions.recommendations')}</button>
                {selected.creatorId === user.id && (
                  <button className="btn-danger" onClick={deletePlayer}><Trash2 size={14} style={{ marginRight: 6 }} />{t('community.actions.deletePlayer')}</button>
                )}
              </div>

              <div className="card">
                <p className="section-title">{t('community.stats.title')}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <StatBox value={selected.stats?.gamesPlayed || 0} label={t('community.stats.played')} color="var(--color6)" />
                  <StatBox value={selected.stats?.tournamentsWon || 0} label={t('community.stats.won')} color="var(--color3)" />
                  <StatBox value={selected.stats?.eventsAttended || 0} label={t('community.stats.attended')} color="var(--color4)" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div className="card" style={{ margin: 0 }}>
                  <p className="section-title">{t('community.ownedGames')}</p>
                  {(selected.ownedGames || []).length === 0 && <p style={{ color: 'var(--text2)', fontSize: 12 }}>{t('community.none')}</p>}
                  {(selected.ownedGames || []).map((g, i) => <p key={i} style={{ fontSize: 12, color: 'var(--title1)', marginBottom: 2 }}>{g}</p>)}
                </div>
                <div className="card" style={{ margin: 0 }}>
                  <p className="section-title">{t('community.favoriteGames')}</p>
                  {(selected.favoriteGames || []).length === 0 && <p style={{ color: 'var(--text2)', fontSize: 12 }}>{t('community.none')}</p>}
                  {(selected.favoriteGames || []).map((g, i) => <p key={i} style={{ fontSize: 12, color: 'var(--color6)', marginBottom: 2 }}>★ {g}</p>)}
                </div>
              </div>

              {selected.creatorId === user.id && (
                <div className="card">
                  <p className="section-title">{t('community.exchange.title')}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'flex-end' }}>
                    <div><label className="form-label">{t('community.exchange.offered')}</label><input value={gameOffered} onChange={e => setGameOffered(e.target.value)} placeholder={t('community.exchangeOfferGive')} /></div>
                    <div><label className="form-label">{t('community.exchange.wanted')}</label><input value={gameWanted} onChange={e => setGameWanted(e.target.value)} placeholder={t('community.exchangeWantGame')} /></div>
                    <button className="btn-primary" style={{ padding: '8px 14px' }} onClick={createExchange} disabled={!gameOffered || !gameWanted}>+ {t('community.btnAdd')}</button>
                  </div>
                  <p style={{ color: 'var(--text1)', fontSize: 12, margin: '10px 0 5px' }}>{t('community.exchange.activeOffers')}</p>
                  {playerExchanges.length === 0 && <p style={{ color: 'var(--text2)', fontSize: 12 }}>{t('community.exchange.noOffers')}</p>}
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
                  <p className="section-title">{t('community.recommendations.title')}</p>
                  {recommendations.map((r, i) => <div key={i} className="card-inner" style={{ marginBottom: 4, fontSize: 12 }}>{r}</div>)}
                </div>
              )}
            </>
          ) : (
            <div className="card empty-state">
              <Users size={48} color="#9B59B6" />
              <h3>{t('community.emptyStateTitle')}</h3>
              <p>{t('community.emptyStateDesc')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
