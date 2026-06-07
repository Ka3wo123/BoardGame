import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Shuffle, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as db from '../data/db';
import './TwoColPage.css';
import { useTranslation } from 'react-i18next';

export default function TournamentsPage() {
  const { user, addToast } = useApp();
  const { i18n } = useTranslation();
  const tr = (pl, en) => i18n.language === "en" ? en : pl;
  const [tournaments, setTournaments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("bracket");
  const [games, setGames] = useState([]);
  const [pooledGames, setPooledGames] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("Cup");
  const [selectedGames, setSelectedGames] = useState([]);
  const [customGame, setCustomGame] = useState("");
  const [playersList, setPlayersList] = useState([]);
  const [playerSearch, setPlayerSearch] = useState("");
  const [playerSearchResults, setPlayerSearchResults] = useState([]);
  const [manualPlayer, setManualPlayer] = useState("");
  const [scoringMatch, setScoringMatch] = useState(null);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [multiScores, setMultiScores] = useState({});
  const [submitP1, setSubmitP1] = useState("");
  const [submitP2, setSubmitP2] = useState("");
  const [submitS1, setSubmitS1] = useState(0);
  const [submitS2, setSubmitS2] = useState(0);

  // Rotational mode state
  const [rotScoring, setRotScoring] = useState(null); // { roundId, type:'main'|'mini', players[] }
  const [rotScores, setRotScores] = useState({});

  const load = useCallback(async () => {
    const list = await db.getTournamentsAsync(user.id);
    setTournaments(list);
    if (selected) {
      const fresh = list.find(x => x.id === selected.id);
      setSelected(fresh || null);
    }
  }, [user.id, selected && selected.id]);

  useEffect(() => { load(); db.getBoardGamesAsync(user.id).then(setGames); }, []);

  useEffect(() => {
    if (playerSearch.length < 2) { setPlayerSearchResults([]); return; }
    const timer = setTimeout(async () => {
      const res = await db.searchPlayersGlobalAsync(playerSearch);
      setPlayerSearchResults(res.filter(r => !playersList.find(p => p.name === (r.nickname || r.name))));
    }, 250);
    return () => clearTimeout(timer);
  }, [playerSearch, playersList]);

  useEffect(() => {
    if (playersList.length === 0) { setPooledGames([]); return; }
    db.getPooledGamesAsync(playersList).then(setPooledGames);
  }, [playersList]);

  const toggleGame = (title) => setSelectedGames(prev => prev.includes(title) ? prev.filter(g => g !== title) : [...prev, title]);

  const addPlayerFromSearch = (p) => {
    const pname = p.nickname || p.name;
    if (playersList.find(x => x.name === pname)) return;
    setPlayersList(prev => [...prev, { name: pname, id: p.id, ownedGames: p.ownedGames || [] }]);
    setPlayerSearch(""); setPlayerSearchResults([]);
  };

  const addManualPlayer = () => {
    const n = manualPlayer.trim();
    if (!n) return;
    if (playersList.find(x => x.name === n)) { addToast(tr("Gracz juz na liscie.", "Player already in list."), "warning"); return; }
    setPlayersList(prev => [...prev, { name: n }]);
    setManualPlayer("");
  };

  const addCustomGame = () => {
    const g = customGame.trim();
    if (!g) return;
    if (!selectedGames.includes(g)) setSelectedGames(prev => [...prev, g]);
    setCustomGame("");
  };

  const create = async () => {
    if (!name.trim()) { addToast(tr("Podaj nazwe turnieju.", "Enter tournament name."), "error"); return; }
    if (playersList.length < 2) { addToast(tr("Dodaj minimum 2 graczy.", "Add at least 2 players."), "error"); return; }
    const titles = selectedGames.length > 0 ? selectedGames : [tr("Nieznana gra", "Unknown game")];
    const trn = await db.createTournamentAsync(user.id, name.trim(), titles, type, playersList.map(p => ({ name: p.name, id: p.id, userId: p.userId, ownedGames: p.ownedGames || [] })), user.displayName, "bracket");
    addToast(tr("Turniej utworzony!", "Tournament created!"), "success");
    setName(""); setSelectedGames([]); setPlayersList([]); setCustomGame("");
    setTournaments(prev => [...prev, trn]);
    setSelected(trn);
    setActiveTab("bracket");
  };

  const generateBracket = async () => {
    if (!selected) return;
    await db.generateBracketAsync(selected.id);
    addToast(tr("Drabinka wygenerowana.", "Bracket generated."), "info");
    setActiveTab(isRotational ? "rounds" : "bracket");
    load();
  };

  const finishTournament = async () => {
    if (!selected) return;
    const result = await db.finishTournamentAsync(selected.id, user.id);
    addToast(result && result.winner ? tr("Turniej zakonczony! Zwyciezca: " + result.winner, "Tournament finished! Winner: " + result.winner) : tr("Turniej zakonczony.", "Tournament finished."), "success");
    load();
  };

  const deleteTournament = async () => {
    if (!selected) return;
    if (!window.confirm(tr("Usunac turniej?", "Delete this tournament?"))) return;
    await db.deleteTournamentAsync(selected.id, user.id);
    setTournaments(prev => prev.filter(x => x.id !== selected.id));
    setSelected(null);
    addToast(tr("Turniej usuniety.", "Tournament deleted."), "info");
  };

  const openScore = (match) => {
    const matchPlayers = match.players && match.players.length > 0 ? match.players : [match.player1, match.player2];
    const activePlayers = matchPlayers.filter(p => p !== 'TBD' && p !== 'BYE');
    if (activePlayers.length === 0 || matchPlayers.some(p => p === 'TBD')) {
      addToast(tr("Czekaj na wyniki poprzednich meczow.", "Waiting for previous round."), "warning"); return;
    }
    setScoringMatch(match);
    const initScores = {};
    activePlayers.forEach(p => { initScores[p] = match.scores?.[p] ?? 0; });
    setMultiScores(initScores);
    setScore1(match.scorePlayer1 || 0);
    setScore2(match.scorePlayer2 || 0);
  };

  const completeMatch = async () => {
    if (!selected || !scoringMatch) return;
    const matchPlayers = scoringMatch.players && scoringMatch.players.length > 0 ? scoringMatch.players : [scoringMatch.player1, scoringMatch.player2];
    const activePlayers = matchPlayers.filter(p => p !== 'TBD' && p !== 'BYE');
    if (activePlayers.length > 2) {
      await db.completeMatchAsync(selected.id, scoringMatch.id, 0, 0, multiScores);
    } else {
      await db.completeMatchAsync(selected.id, scoringMatch.id, score1, score2, null);
    }
    addToast(tr("Wynik zapisany!", "Score saved!"), "success");
    setScoringMatch(null);
    load();
  };

  // ── Rotational helpers ──────────────────────────────
  const openRotScoring = (round, type) => {
    const players = type === 'main' ? round.mainPlayers : round.waitingPlayers;
    const initScores = {};
    players.forEach(p => { initScores[p] = 0; });
    setRotScoring({ roundId: round.id, type, players, gameTitle: round.gameTitle, roundNumber: round.roundNumber });
    setRotScores(initScores);
  };

  const saveRotResult = async () => {
    if (!selected || !rotScoring) return;
    await db.saveRotationalResultAsync(selected.id, rotScoring.roundId, rotScoring.type, rotScores);
    addToast(tr("Wynik zapisany!", "Score saved!"), "success");
    setRotScoring(null);
    load();
  };

  const postLeagueResult = async () => {
    if (!selected || !submitP1 || !submitP2) return;
    const m = (selected.matches || []).find(x => !x.isCompleted && ((x.player1 === submitP1 && x.player2 === submitP2) || (x.player1 === submitP2 && x.player2 === submitP1)));
    if (!m) { addToast(tr("Mecz nie znaleziony.", "Match not found."), "error"); return; }
    const s1 = m.player1 === submitP1 ? submitS1 : submitS2;
    const s2 = m.player2 === submitP2 ? submitS2 : submitS1;
    await db.completeMatchAsync(selected.id, m.id, s1, s2);
    addToast(tr("Wynik zapisany.", "Result saved."), "success");
    setSubmitP1(""); setSubmitP2(""); setSubmitS1(0); setSubmitS2(0);
    load();
  };

  const playerNames = selected && selected.players ? selected.players.map(p => p.name) : [];
  const tournamentGames = selected && selected.gameTitles && selected.gameTitles.length > 0 ? selected.gameTitles : (selected && selected.gameTitle ? [selected.gameTitle] : []);
  const sortedStandings = selected && selected.standings ? [...selected.standings].sort((a, b) => (b.wins * 3 + b.draws) - (a.wins * 3 + a.draws)) : [];
  const completedMatches = selected && selected.matches ? selected.matches.filter(m => m.isCompleted).sort((a, b) => a.matchNumber - b.matchNumber) : [];
  const isRotational = selected && selected.mode === 'rotational';
  const tabs = isRotational
    ? ["rounds", "scores"]
    : selected && selected.type === "Cup"
      ? ["bracket", "results"]
      : ["bracket", "standings", "results"];
  const tabLabel = (tab) => {
    if (tab === "bracket") return tr(selected && selected.type === "Cup" ? "Drabinka" : "Mecze", selected && selected.type === "Cup" ? "Bracket" : "Matches");
    if (tab === "standings") return tr("Tabela", "Standings");
    if (tab === "rounds") return tr("Rundy", "Rounds");
    if (tab === "scores") return tr("Punkty", "Points");
    return tr("Dziennik", "Results");
  };
  const statusCls = s => s === "InProgress" ? "tp-status-live" : s === "Planned" ? "tp-status-open" : "tp-status-done";
  const statusLbl = s => s === "InProgress" ? tr("W TRAKCIE", "IN PROGRESS") : s === "Planned" ? tr("PLANOWANY", "PLANNED") : tr("ZAKONCZONY", "FINISHED");

  return (
    <div className="tp-root">
      <div className="tp-left">
        <div className="card tp-form-card">
          <p className="section-title"><Trophy size={13} color="var(--color6)" style={{ marginRight: 6 }} />{tr("Nowy turniej", "New tournament")}</p>
          <label className="form-label">{tr("NAZWA TURNIEJU", "TOURNAMENT NAME")}</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder={tr("np. Zimowe Grand Prix 2025", "e.g. Winter Grand Prix 2025")} />
          <label className="form-label" style={{ marginTop: 10 }}>{tr("TYP ROZGRYWEK", "TOURNAMENT TYPE")}</label>
          <div className="tp-type-row">
            <button className={"tp-type-btn" + (type === "Cup" ? " active" : "")} onClick={() => setType("Cup")}><Trophy size={12} style={{marginRight:4}} />{tr("Puchar", "Cup")}</button>
            <button className={"tp-type-btn" + (type === "League" ? " active" : "")} onClick={() => setType("League")}>🏅 {tr("Liga", "League")}</button>
          </div>
          <label className="form-label" style={{ marginTop: 12 }}>{tr("GRY DO TURNIEJU", "TOURNAMENT GAMES")}</label>
          {games.length > 0 && (
            <div className="tp-chips-wrap">
              {games.map(g => (
                <button key={g.id} className={"tp-game-chip" + (selectedGames.includes(g.title) ? " selected" : "")} onClick={() => toggleGame(g.title)}>
                  {g.title}
                </button>
              ))}
            </div>
          )}
          {pooledGames.filter(g => !games.find(x => x.title === g.title)).length > 0 && (
            <div style={{ marginTop: 6 }}>
              <p style={{ fontSize: 10, color: "var(--text2)", marginBottom: 4 }}>{tr("GRY GRACZY:", "PLAYERS GAMES:")}</p>
              <div className="tp-chips-wrap">
                {pooledGames.filter(g => !games.find(x => x.title === g.title)).map(g => (
                  <button key={g.title} className={"tp-game-chip" + (selectedGames.includes(g.title) ? " selected" : "")} onClick={() => toggleGame(g.title)}>
                    {g.title}{g.count > 1 && <span className="tp-count"> x{g.count}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            <input value={customGame} onChange={e => setCustomGame(e.target.value)} placeholder={tr("Wpisz wlasna gre...", "Add custom game...")} style={{ flex: 1 }} onKeyDown={e => e.key === "Enter" && addCustomGame()} />
            <button className="btn-secondary" style={{ padding: "6px 10px" }} onClick={addCustomGame}>+</button>
          </div>
          {selectedGames.length > 0 && (
            <div className="tp-chips-wrap" style={{ marginTop: 6 }}>
              {selectedGames.map(g => (
                <span key={g} className="tp-selected-game">{g}<X size={9} style={{ cursor: "pointer", marginLeft: 4 }} onClick={() => toggleGame(g)} /></span>
              ))}
            </div>
          )}
          <label className="form-label" style={{ marginTop: 12 }}>{tr("GRACZE", "PLAYERS")}</label>
          <div style={{ position: "relative", marginBottom: 6 }}>
            <input value={playerSearch} onChange={e => setPlayerSearch(e.target.value)} placeholder={tr("Szukaj gracza ze spolecznosci...", "Search community players...")} style={{ width: "100%" }} />
            {playerSearchResults.length > 0 && (
              <div className="tp-dropdown">
                {playerSearchResults.map(p => (
                  <div key={p.id} className="tp-dropdown-item" onClick={() => addPlayerFromSearch(p)}>
                    <div><strong>{p.nickname}</strong>{p.fullName && p.fullName !== p.nickname && <span style={{ color: "var(--text2)", fontSize: 10 }}> ({p.fullName})</span>}</div>
                    <UserPlus size={12} color="var(--purple)" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            <input value={manualPlayer} onChange={e => setManualPlayer(e.target.value)} placeholder={tr("Dodaj recznie (Enter)", "Add manually (Enter)")} style={{ flex: 1 }} onKeyDown={e => e.key === "Enter" && addManualPlayer()} />
            <button className="btn-secondary" style={{ padding: "6px 10px" }} onClick={addManualPlayer}>+</button>
          </div>
          {playersList.length > 0 && (
            <div className="tp-chips-wrap" style={{ marginTop: 4 }}>
              {playersList.map((p, i) => (
                <span key={i} className="tp-player-tag">{p.name}<X size={9} style={{ cursor: "pointer", marginLeft: 4 }} onClick={() => setPlayersList(prev => prev.filter((_, j) => j !== i))} /></span>
              ))}
            </div>
          )}
          <button className="btn-primary" style={{ width: "100%", marginTop: 14 }} onClick={create} disabled={!name.trim() || playersList.length < 2}>{tr("Utworz turniej", "Create tournament")}</button>
        </div>
        <div style={{ marginTop: 14 }}>
          <p className="section-title"><Trophy size={13} color="var(--color6)" style={{ marginRight: 6 }} />{tr("Aktywne turnieje", "Active tournaments")}</p>
          {tournaments.length === 0 && <p style={{ color: "var(--text2)", fontSize: 12 }}>{tr("Brak turniejow.", "No tournaments.")}</p>}
          {tournaments.map(trn => (
            <div key={trn.id} className={"tp-list-item" + (selected && selected.id === trn.id ? " active" : "")} onClick={() => { setSelected(trn); setActiveTab("bracket"); }}>
              <span className={"tp-badge " + statusCls(trn.status)}>{statusLbl(trn.status)}</span>
              <p className="tp-list-name">{trn.name}</p>
              <p className="tp-list-sub">{trn.type === "Cup" ? tr("Puchar", "Cup") : tr("Liga", "League")} - {trn.players ? trn.players.length : 0} {tr("graczy", "players")}{trn.gameTitles && trn.gameTitles.length > 0 ? " - " + trn.gameTitles.slice(0, 2).join(", ") + (trn.gameTitles.length > 2 ? "..." : "") : ""}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="tp-right">
        {selected ? (
          <div className="tp-detail">
            <div className="tp-detail-header">
              <div className="tp-detail-info">
                <h2 className="tp-detail-title">{selected.name}</h2>
                <p className="tp-detail-sub">{selected.type === "Cup" ? tr("Puchar", "Cup") : tr("Liga", "League")} - {selected.players ? selected.players.length : 0} {tr("graczy", "players")}{tournamentGames.length > 0 && <span style={{ color: "var(--color6)" }}> - {tournamentGames.join(", ")}</span>}</p>
              </div>
              <div className="tp-detail-actions">
                {selected.status !== "Completed" && (
                  <button className="tp-btn tp-btn-primary" onClick={generateBracket}><Shuffle size={13} />{tr(isRotational ? "Generuj rundy" : "Generuj drabinke", isRotational ? "Generate rounds" : "Generate bracket")}</button>
                )}
                {selected.status === "InProgress" && (
                  <button className="tp-btn tp-btn-finish" onClick={finishTournament}>{tr("Zakoncz turniej", "Finish tournament")}</button>
                )}
                <button className="tp-btn tp-btn-danger" onClick={deleteTournament}><Trash2 size={13} /></button>
              </div>
            </div>
            {selected.status === "Completed" && selected.winner && (
              <div className="tp-winner-banner">
                <Trophy size={36} color="var(--color6)" />
                <div>
                  <p className="tp-winner-label">{tr("ZWYCIEZCA TURNIEJU", "TOURNAMENT WINNER")}</p>
                  <p className="tp-winner-name">{selected.winner}</p>
                </div>
              </div>
            )}
            <div className="tp-tabs">
              {tabs.map(tab => (
                <button key={tab} className={"tp-tab" + (activeTab === tab ? " active" : "")} onClick={() => setActiveTab(tab)}>{tabLabel(tab)}</button>
              ))}
            </div>
            {activeTab === "bracket" && selected.type === "Cup" && (
              <div className="tp-tab-content"><BracketFlow tournament={selected} onScore={openScore} /></div>
            )}
            {activeTab === "bracket" && selected.type === "League" && (
              <div className="tp-tab-content tp-league-layout">
                <div className="card">
                  <p className="section-title">{tr("Wpisz wynik meczu", "Enter match result")}</p>
                  <div className="tp-vs-row">
                    <div style={{ flex: 1 }}>
                      <label className="form-label">{tr("GRACZ A", "PLAYER A")}</label>
                      <select value={submitP1} onChange={e => setSubmitP1(e.target.value)}>
                        <option value="">{tr("Wybierz...", "Choose...")}</option>
                        {playerNames.map(n => <option key={n}>{n}</option>)}
                      </select>
                    </div>
                    <div className="tp-vs-label">VS</div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">{tr("GRACZ B", "PLAYER B")}</label>
                      <select value={submitP2} onChange={e => setSubmitP2(e.target.value)}>
                        <option value="">{tr("Wybierz...", "Choose...")}</option>
                        {playerNames.filter(n => n !== submitP1).map(n => <option key={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                    <div><label className="form-label">{submitP1 || tr("WYNIK A", "SCORE A")}</label><input type="number" min={0} value={submitS1} onChange={e => setSubmitS1(Number(e.target.value))} /></div>
                    <div><label className="form-label">{submitP2 || tr("WYNIK B", "SCORE B")}</label><input type="number" min={0} value={submitS2} onChange={e => setSubmitS2(Number(e.target.value))} /></div>
                  </div>
                  <button className="btn-primary" style={{ width: "100%", marginTop: 10 }} onClick={postLeagueResult} disabled={!submitP1 || !submitP2 || submitP1 === submitP2}>{tr("Zapisz wynik", "Save result")}</button>
                </div>
                {sortedStandings.length > 0 && (
                  <div className="card">
                    <p className="section-title">{tr("Aktualna tabela", "Current standings")}</p>
                    <table className="data-table">
                      <thead><tr><th>#</th><th>{tr("Gracz", "Player")}</th><th>M</th><th>W</th><th>R</th><th>P</th><th>{tr("Pkt", "Pts")}</th></tr></thead>
                      <tbody>{sortedStandings.map((s, i) => (
                        <tr key={s.playerName} className={i % 2 === 0 ? "row-alt" : ""}>
                          <td style={{ color: "var(--color6)", fontWeight: 700 }}>{i + 1}</td>
                          <td style={{ fontWeight: 600 }}>{s.playerName}</td>
                          <td>{s.played}</td>
                          <td style={{ color: "#2ed573" }}>{s.wins}</td>
                          <td style={{ color: "#ffa502" }}>{s.draws}</td>
                          <td style={{ color: "#ff4757" }}>{s.losses}</td>
                          <td style={{ color: "var(--color6)", fontWeight: 700 }}>{s.wins * 3 + s.draws}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            {activeTab === "standings" && (
              <div className="tp-tab-content">
                <div className="card">
                  <p className="section-title">{tr("Tabela ligowa", "League standings")}</p>
                  {sortedStandings.length === 0 ? (
                    <p style={{ color: "var(--text2)", fontSize: 13 }}>{tr("Brak danych.", "No data.")}</p>
                  ) : (
                    <table className="data-table">
                      <thead><tr><th>#</th><th>{tr("Gracz", "Player")}</th><th>M</th><th>W</th><th>R</th><th>P</th><th>{tr("Pkt", "Pts")}</th><th>+/-</th></tr></thead>
                      <tbody>{sortedStandings.map((s, i) => (
                        <tr key={s.playerName} className={i % 2 === 0 ? "row-alt" : ""}>
                          <td style={{ color: "var(--color6)", fontWeight: 700 }}>{i + 1}</td>
                          <td style={{ fontWeight: 600 }}>{s.playerName}</td>
                          <td>{s.played}</td>
                          <td style={{ color: "#2ed573" }}>{s.wins}</td>
                          <td style={{ color: "#ffa502" }}>{s.draws}</td>
                          <td style={{ color: "#ff4757" }}>{s.losses}</td>
                          <td style={{ color: "var(--color6)", fontWeight: 700 }}>{s.wins * 3 + s.draws}</td>
                          <td style={{ color: s.goalsFor - s.goalsAgainst >= 0 ? "#2ed573" : "#ff4757" }}>{s.goalsFor - s.goalsAgainst >= 0 ? "+" : ""}{s.goalsFor - s.goalsAgainst}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
            {activeTab === "rounds" && isRotational && (
              <div className="tp-tab-content" style={{ overflow: 'hidden' }}>
                <RotationalFlow tournament={selected} onScore={openRotScoring} />
              </div>
            )}

            {activeTab === "scores" && (() => {
              const pointsMap = selected.points || {};
              const sortedPts = Object.entries(pointsMap).sort((a, b) => b[1] - a[1]);
              return (
                <div className="tp-tab-content">
                  <div className="card">
                    <p className="section-title">{tr("Tabela punktow", "Points table")}</p>
                    {sortedPts.length === 0 ? (
                      <p style={{ color: "var(--text2)", fontSize: 13 }}>{tr("Brak punktow.", "No points yet.")}</p>
                    ) : (
                      <table className="data-table">
                        <thead><tr><th>#</th><th>{tr("Gracz", "Player")}</th><th>{tr("Punkty", "Points")}</th></tr></thead>
                        <tbody>{sortedPts.map(([pname, ppts], i) => (
                          <tr key={pname} className={i % 2 === 0 ? "row-alt" : ""}>
                            <td style={{ color: "var(--color6)", fontWeight: 700 }}>{i + 1}</td>
                            <td style={{ fontWeight: 600 }}>{pname}</td>
                            <td style={{ color: "var(--color6)", fontWeight: 700 }}>{ppts}</td>
                          </tr>
                        ))}</tbody>
                      </table>
                    )}
                    <div style={{ marginTop: 12, fontSize: 11, color: "var(--text2)", lineHeight: 1.8 }}>
                      <p>🏆 {tr("Wygrana gry glownej: 3 pkt", "Main game win: 3 pts")}</p>
                      <p>🥈 {tr("2. miejsce: 2 pkt", "2nd place: 2 pts")}</p>
                      <p>🎮 {tr("Udział w grze: 1 pkt", "Participation: 1 pt")}</p>
                      <p>⏳ {tr("Oczekiwanie: 1 pkt", "Waiting: 1 pt")}</p>
                      <p>🥇 {tr("Wygrana mini-gry: 2 pkt", "Mini-game win: 2 pts")}</p>
                      <p>🃏 {tr("Udział w mini-grze: 1 pkt", "Mini-game participation: 1 pt")}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {activeTab === "results" && (
              <div className="tp-tab-content">
                <div className="card">
                  <p className="section-title">{tr("Dziennik wynikow", "Results log")}</p>
                  {completedMatches.length === 0 ? (
                    <p style={{ color: "var(--text2)", fontSize: 13 }}>{tr("Brak zakonczonych meczow.", "No completed matches.")}</p>
                  ) : (
                    completedMatches.map(m => (
                      <div key={m.id} className="tp-result-row">
                        <span className="tp-result-num">{"#" + m.matchNumber}</span>
                        <span className={"tp-result-player" + (m.winner === m.player1 ? " winner" : "")}>{m.player1}</span>
                        <span className="tp-result-score">{m.scorePlayer1} : {m.scorePlayer2}</span>
                        <span className={"tp-result-player right" + (m.winner === m.player2 ? " winner" : "")}>{m.player2}</span>
                        {m.winner !== "Remis" ? <span className="tp-result-winner">{m.winner}</span> : <span className="tp-result-draw">{tr("Remis", "Draw")}</span>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="tp-empty-state">
            <Trophy size={52} color="var(--color6)" style={{ opacity: 0.4 }} />
            <h3>{tr("Wybierz turniej z listy", "Select a tournament")}</h3>
            <p>{tr("lub utworz nowy po lewej stronie", "or create a new one on the left")}</p>
          </div>
        )}
      </div>

      {scoringMatch && (() => {
        const matchPlayers = scoringMatch.players && scoringMatch.players.length > 0 ? scoringMatch.players : [scoringMatch.player1, scoringMatch.player2];
        const activePlayers = matchPlayers.filter(p => p !== 'TBD' && p !== 'BYE');
        const isMulti = activePlayers.length > 2;
        return (
          <div className="tp-modal-overlay" onClick={() => setScoringMatch(null)}>
            <div className="tp-modal" onClick={e => e.stopPropagation()}>
              <div className="tp-modal-header">
                <h3>{tr("Wynik meczu", "Match score") + " #" + scoringMatch.matchNumber}</h3>
                <button className="btn-icon" onClick={() => setScoringMatch(null)}><X size={15} /></button>
              </div>
              {(() => {
                const matchGame = scoringMatch.gameTitle || (tournamentGames.length > 0 ? tournamentGames[0] : null);
                return matchGame ? (
                  <p style={{ fontSize: 11, color: "var(--text2)", marginBottom: 12 }}>
                    {tr('Gra', 'Game')}: <strong style={{ color: "var(--color6)" }}>{matchGame}</strong>
                    {selected?.matchSize > 2 && <span style={{ marginLeft: 8, color: 'var(--text2)' }}>({tr('maks.', 'max')} {selected.matchSize} {tr('graczy na mecz', 'players per match')})</span>}
                  </p>
                ) : null;
              })()}
              {isMulti ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {activePlayers.map(p => (
                    <div key={p} style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 10, alignItems: 'center' }}>
                      <label className="form-label" style={{ margin: 0 }}>{p}</label>
                      <input type="number" min={0} value={multiScores[p] ?? 0}
                        onChange={e => setMultiScores(prev => ({ ...prev, [p]: Number(e.target.value) }))}
                        style={{ textAlign: "center", fontSize: 18, fontWeight: 700 }} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 40px 1fr", gap: 10, alignItems: "center" }}>
                  <div>
                    <label className="form-label" style={{ textAlign: "center", display: "block" }}>{activePlayers[0]}</label>
                    <input type="number" min={0} value={score1} onChange={e => setScore1(Number(e.target.value))} style={{ textAlign: "center", fontSize: 24, fontWeight: 800 }} />
                  </div>
                  <span style={{ textAlign: "center", color: "var(--text2)", fontSize: 22, fontWeight: 700 }}>:</span>
                  <div>
                    <label className="form-label" style={{ textAlign: "center", display: "block" }}>{activePlayers[1]}</label>
                    <input type="number" min={0} value={score2} onChange={e => setScore2(Number(e.target.value))} style={{ textAlign: "center", fontSize: 24, fontWeight: 800 }} />
                  </div>
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
                <button className="btn-secondary" onClick={() => setScoringMatch(null)}>{tr("Anuluj", "Cancel")}</button>
                <button className="btn-primary" onClick={completeMatch}>{tr("Zapisz wynik", "Save score")}</button>
              </div>
            </div>
          </div>
        );
      })()}

      {rotScoring && (
        <div className="tp-modal-overlay" onClick={() => setRotScoring(null)}>
          <div className="tp-modal" onClick={e => e.stopPropagation()}>
            <div className="tp-modal-header">
              <h3>
                {rotScoring.type === 'main'
                  ? tr("Wyniki gry glownej", "Main game results")
                  : tr("Wyniki mini-gry", "Mini-game results")}
                {" — "}{tr("Runda", "Round")} {rotScoring.roundNumber}
              </h3>
              <button className="btn-icon" onClick={() => setRotScoring(null)}><X size={15} /></button>
            </div>
            <p style={{ fontSize: 11, color: "var(--text2)", marginBottom: 12 }}>
              {tr("Gra", "Game")}: <strong style={{ color: "var(--color6)" }}>{rotScoring.gameTitle}</strong>
              {rotScoring.type === 'mini' && <span style={{ marginLeft: 8 }}>⚡ {tr("Mini-gra dla oczekujacych", "Mini-game for waiting players")}</span>}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {rotScoring.players.map(p => (
                <div key={p} style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 10, alignItems: 'center' }}>
                  <label className="form-label" style={{ margin: 0 }}>{p}</label>
                  <input type="number" min={0} value={rotScores[p] ?? 0}
                    onChange={e => setRotScores(prev => ({ ...prev, [p]: Number(e.target.value) }))}
                    style={{ textAlign: "center", fontSize: 18, fontWeight: 700 }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
              <button className="btn-secondary" onClick={() => setRotScoring(null)}>{tr("Anuluj", "Cancel")}</button>
              <button className="btn-primary" onClick={saveRotResult}>{tr("Zapisz wyniki", "Save results")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
