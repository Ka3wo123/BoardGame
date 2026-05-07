import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Shuffle, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as db from '../data/db';
import './TwoColPage.css';

export default function TournamentsPage() {
  const { user, addToast } = useApp();
  const [tournaments, setTournaments] = useState([]);
  const [selected, setSelected] = useState(null);

  // Form
  const [name, setName] = useState('');
  const [gameTitle, setGameTitle] = useState('');
  const [type, setType] = useState('Cup'); // 'Cup' | 'League'
  const [playersText, setPlayersText] = useState('');

  // Match scoring
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  const load = useCallback(async () => {
    const list = await db.getTournamentsAsync(user.id);
    setTournaments(list);
    if (selected) {
      const fresh = list.find(t => t.id === selected.id);
      setSelected(fresh || null);
    }
  }, [user.id, selected?.id]);

  useEffect(() => { load(); }, []);

  const create = async () => {
    const players = playersText.split(/[,\n\r]/).map(s => s.trim()).filter(Boolean);
    if (players.length < 2) { addToast('Potrzeba minimum 2 graczy!', 'error'); return; }
    const t = await db.createTournamentAsync(user.id, name, gameTitle, type, players, user.displayName);
    addToast(`Turniej "${t.name}" utworzony z ${players.length} graczami.`, 'success');
    setName(''); setGameTitle(''); setPlayersText('');
    setTournaments(prev => [...prev, t]);
    setSelected(t);
  };

  const generateBracket = async () => {
    if (!selected) return;
    await db.generateBracketAsync(selected.id);
    addToast('Drabinka wygenerowana.', 'info');
    load();
  };

  const deleteTournament = async () => {
    if (!selected) return;
    await db.deleteTournamentAsync(selected.id, user.id);
    setTournaments(prev => prev.filter(t => t.id !== selected.id));
    setSelected(null);
    addToast('Turniej usunięty.', 'success');
  };

  const completeMatch = async (match) => {
    if (!selected || !match) return;
    await db.completeMatchAsync(selected.id, match.id, score1, score2);
    addToast('Wynik meczu zapisany.', 'info');
    setSelectedMatch(null);
    load();
  };

  const sortedMatches = selected?.matches?.slice().sort((a, b) => a.round - b.round || a.matchNumber - b.matchNumber) || [];
  const sortedStandings = selected?.standings?.slice().sort((a, b) => (b.wins * 3 + b.draws) - (a.wins * 3 + a.draws)) || [];

  return (
    <div className="tcpage">
      {/* Header */}
      <h1><Trophy size={24} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--color6)' }} />
        <span style={{ color: 'var(--color6)' }}>Turnieje</span>
      </h1>

      <div className="tcpage-cols">
        {/* LEFT */}
        <div className="tcpage-left">
          {/* Create form */}
          <div className="card">
            <p className="section-title">Nowy turniej</p>

            <label className="form-label">Nazwa turnieju</label>
            <input value={name} onChange={e => setName(e.target.value)} />

            <label className="form-label">Gra</label>
            <input value={gameTitle} onChange={e => setGameTitle(e.target.value)} />

            <label className="form-label">Typ</label>
            <div className="radio-row">
              <label className="radio-label">
                <input type="radio" checked={type === 'Cup'} onChange={() => setType('Cup')} />
                Puchar
              </label>
              <label className="radio-label">
                <input type="radio" checked={type === 'League'} onChange={() => setType('League')} />
                Liga
              </label>
            </div>

            <label className="form-label">Gracze (po przecinku)</label>
            <textarea
              value={playersText}
              onChange={e => setPlayersText(e.target.value)}
              rows={3}
            />

            <button
              className="btn-primary"
              style={{ marginTop: 10, width: '100%' }}
              onClick={create}
              disabled={!name}
            >
              Utwórz turniej
            </button>
          </div>

          {/* Tournament list */}
          <p className="section-title" style={{ marginTop: 10 }}>Lista turniejów</p>
          {tournaments.length === 0 && (
            <p style={{ color: 'var(--text2)', fontSize: 13 }}>Brak turniejów.</p>
          )}
          {tournaments.map(t => (
            <div
              key={t.id}
              className={`card-inner list-item ${selected?.id === t.id ? 'list-item-active' : ''}`}
              onClick={() => setSelected(t)}
              style={{ cursor: 'pointer' }}
            >
              <p style={{ color: 'var(--color6)', fontWeight: 600, fontSize: 14 }}>{t.name}</p>
              <p style={{ color: 'var(--text1)', fontSize: 11 }}>
                {t.gameTitle} • {t.type} • {t.status}
              </p>
              <p style={{ color: 'var(--text2)', fontSize: 11 }}>
                Graczy: {t.players?.length || 0}
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="tcpage-right">
          {selected ? (
            <>
              {/* Actions */}
              <div className="action-row">
                <button className="btn-primary" onClick={generateBracket}>
                  <Shuffle size={14} style={{ marginRight: 6 }} />Generuj drabinkę
                </button>
                <button className="btn-danger" onClick={deleteTournament}>
                  <Trash2 size={14} style={{ marginRight: 6 }} />Usuń turniej
                </button>
              </div>

              {/* Matches */}
              <div className="card">
                <p className="section-title">Mecze</p>
                {sortedMatches.length === 0 && (
                  <p style={{ color: 'var(--text2)', fontSize: 13 }}>Brak meczów. Kliknij "Generuj drabinkę".</p>
                )}
                {sortedMatches.map(m => (
                  <div key={m.id} className="card-inner match-row">
                    <span style={{ color: 'var(--text2)', fontSize: 12, minWidth: 28 }}>#{m.matchNumber}</span>
                    <span style={{ flex: 1, fontSize: 13 }}>{m.player1}</span>
                    <span style={{ color: 'var(--color6)', margin: '0 10px', fontSize: 13, minWidth: 50, textAlign: 'center' }}>
                      {m.scorePlayer1} : {m.scorePlayer2}
                    </span>
                    <span style={{ flex: 1, fontSize: 13, textAlign: 'right' }}>{m.player2}</span>
                    {m.isCompleted ? (
                      <span style={{ color: 'var(--color3)', fontSize: 11, marginLeft: 10, minWidth: 60 }}>
                        {m.winner}
                      </span>
                    ) : (
                      <button
                        className="btn-secondary"
                        style={{ fontSize: 11, padding: '4px 8px', marginLeft: 10 }}
                        onClick={() => { setSelectedMatch(m); setScore1(0); setScore2(0); }}
                      >
                        Wynik
                      </button>
                    )}
                  </div>
                ))}

                {/* Inline score form */}
                {selectedMatch && (
                  <div className="score-form card-inner" style={{ marginTop: 10 }}>
                    <p style={{ color: 'var(--text1)', fontSize: 12, marginBottom: 8 }}>
                      Wynik: <strong style={{ color: 'white' }}>{selectedMatch.player1}</strong> vs <strong style={{ color: 'white' }}>{selectedMatch.player2}</strong>
                    </p>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        type="number" min={0} value={score1}
                        onChange={e => setScore1(Number(e.target.value))}
                        style={{ width: 60 }}
                      />
                      <span style={{ color: 'var(--text2)' }}>:</span>
                      <input
                        type="number" min={0} value={score2}
                        onChange={e => setScore2(Number(e.target.value))}
                        style={{ width: 60 }}
                      />
                      <button className="btn-primary" style={{ padding: '6px 12px' }} onClick={() => completeMatch(selectedMatch)}>Zapisz</button>
                      <button className="btn-secondary" style={{ padding: '6px 12px' }} onClick={() => setSelectedMatch(null)}>Anuluj</button>
                    </div>
                  </div>
                )}
              </div>

              {/* League standings */}
              {selected.type === 'League' && sortedStandings.length > 0 && (
                <div className="card">
                  <p className="section-title">Tabela ligowa</p>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Gracz</th><th>M</th><th>W</th><th>R</th><th>P</th><th>Pkt</th><th>+/-</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedStandings.map((s, i) => (
                        <tr key={s.playerName} className={i % 2 === 0 ? 'row-alt' : ''}>
                          <td>{s.playerName}</td>
                          <td>{s.played}</td>
                          <td>{s.wins}</td>
                          <td>{s.draws}</td>
                          <td>{s.losses}</td>
                          <td style={{ color: 'var(--color6)', fontWeight: 600 }}>{s.wins * 3 + s.draws}</td>
                          <td>{s.goalsFor - s.goalsAgainst}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <div className="card empty-state">
              <Trophy size={48} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--color6)' }} />
              <h3>Wybierz turniej z listy</h3>
              <p>lub utwórz nowy, aby zobaczyć szczegóły</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
