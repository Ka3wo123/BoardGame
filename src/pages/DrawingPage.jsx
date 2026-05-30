import React, { useState } from 'react';
import { RefreshCw, CheckCircle, Clock, Users, Settings2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as db from '../data/db';
import './DrawingPage.css';

const WEIGHTING_OPTIONS = ['Losowo', 'Preferuj krótkie', 'Preferuj długie', 'Preferuj trudne'];

const COMPLEXITY_LABEL = {
  'Łatwa': 'Łatwa',
  'Średnia': 'Średnia',
  'Trudna': 'Trudna',
  'Ekspercka': 'Ekspercka',
  Easy: 'Łatwa',
  Medium: 'Średnia',
  Hard: 'Trudna',
  Expert: 'Ekspercka',
};

const COMPLEXITY_COLOR = {
  Easy:   '#2ed573',
  Medium: '#ffa502',
  Hard:   '#ff6b81',
  Expert: '#ff4757',
};

export default function DrawingPage() {
  const { user, addToast, language } = useApp();
  const tr = (pl, en) => language === 'en' ? en : pl;
  const WEIGHTING_TR = {
    'Losowo': tr('Losowo', 'Random'),
    'Preferuj krótkie': tr('Preferuj krótkie', 'Prefer short'),
    'Preferuj długie': tr('Preferuj długie', 'Prefer long'),
    'Preferuj trudne': tr('Preferuj trudne', 'Prefer hard'),
  };
  const COMPLEXITY_LABEL_TR = {
    'Łatwa': tr('Łatwa', 'Easy'), 'Średniat': tr('Średnia', 'Medium'), 'Trudna': tr('Trudna', 'Hard'), 'Ekspercka': tr('Ekspercka', 'Expert'),
    Easy: tr('Łatwa', 'Easy'), Medium: tr('Średnia', 'Medium'), Hard: tr('Trudna', 'Hard'), Expert: tr('Ekspercka', 'Expert'),
  };
  const [minPlayers, setMinPlayers] = useState(4);
  const [weighting, setWeighting] = useState('Preferuj krótkie');
  const [sessions, setSessions] = useState([]);
  const [totalMins, setTotalMins] = useState(0);
  const [drawn, setDrawn] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleDraw = async () => {
    setConfirmed(false);
    const result = await db.createDrawingAsync(user.id, Number(minPlayers), weighting);
    if (result.length === 0) {
      addToast(tr('Brak dostępnych gier dla podanej liczby graczy.', 'No games available for this player count.'), 'warning');
      setSessions([]);
      setDrawn(true);
      return;
    }
    setSessions(result);
    setTotalMins(result.reduce((sum, s) => sum + Number(s.duration), 0));
    setDrawn(true);
    addToast(tr('Wylosowano ', 'Drew ') + result.length + tr(' gier.', ' games.'), 'success');
  };

  const handleReroll = () => { handleDraw(); };

  const handleConfirm = () => {
    setConfirmed(true);
    addToast(tr('Sesja potwierdzona!', 'Session confirmed!'), 'success');
  };

  const totalHoursDisplay = totalMins >= 60
    ? '~' + (totalMins / 60).toFixed(1) + (tr(' godz.', 'h'))
    : totalMins + ' min';

  return (
    <div className="drawing-page">
      <div className="drawing-header">
        <h1 className="drawing-title">{tr('Losowanie gry', 'Game drawing')}</h1>
        <p className="drawing-subtitle">
          {tr('Nie wiesz w co zagrać? Algorytm dobierze optymalne gry na podstawie liczby graczy i Twojej biblioteki.',
              "Not sure what to play? The algorithm will pick optimal games based on player count and your library.")}
        </p>
      </div>

      <div className="drawing-body">
        {/* LEFT — Configuration */}
        <div className="drawing-left">
          <div className="config-card">
            <div className="config-card-title">
              <Settings2 size={15} />
              <span>{tr('Konfiguracja', 'Configuration')}</span>
            </div>

            <label className="cfg-label">{tr('MINIMALNA LICZBA GRACZY', 'MINIMUM PLAYERS')}</label>
            <div className="player-stepper">
              <button className="stepper-btn" onClick={() => setMinPlayers(p => Math.max(1, p - 1))}>&#8722;</button>
              <span className="stepper-value">{minPlayers}</span>
              <button className="stepper-btn" onClick={() => setMinPlayers(p => p + 1)}>+</button>
            </div>

            <label className="cfg-label" style={{ marginTop: 16 }}>{tr('PREFERENCJE DOBORU', 'SELECTION PREFERENCE')}</label>
            <select className="cfg-select" value={weighting} onChange={e => setWeighting(e.target.value)}>
              {WEIGHTING_OPTIONS.map(o => <option key={o} value={o}>{WEIGHTING_TR[o] || o}</option>)}
            </select>

            <button className="btn-draw" onClick={handleDraw}>
              <RefreshCw size={16} />
              {tr('LOSUJ GRY', 'DRAW GAMES')}
            </button>
          </div>

          {drawn && sessions.length > 0 && (
            <div className="playtime-card">
              <div className="playtime-icon"><Clock size={22} color="var(--purple)" /></div>
              <div>
                <p className="playtime-label">{tr('CZAS SESJI', 'SESSION TIME')}</p>
                <p className="playtime-value">{totalHoursDisplay}</p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Results */}
        <div className="drawing-right">
          {drawn && sessions.length > 0 ? (
            <>
              <div className="results-header">
                <h2 className="results-title">{tr('Wylosowane gry', 'Drawn games')}</h2>
                <span className="results-badge">{sessions.length} {tr('ZNALEZIONYCH', 'FOUND')}</span>
              </div>

              <div className="session-list">
                {sessions.map(s => (
                  <div key={s.number} className="session-card-new">
                    <div className="session-cover" style={{ background: s.coverColor }}>
                      <span className="session-cover-letter">{s.title[0]}</span>
                    </div>
                    <div className="session-info">
                      <div className="session-top-row">
                        <div>
                          <p className="session-name">{s.title}</p>
                          <p className="session-desc">{s.description || tr('Gra planszowa', 'Board game')}</p>
                        </div>
                        <span className="session-mins">{s.duration} MIN</span>
                      </div>
                      <div className="session-meta-row">
                        <span className="session-meta-item">
                          <Users size={12} /> {s.minPlayers}-{s.maxPlayers} {tr('graczy', 'players')}
                        </span>
                        <span className="session-meta-item">
                          <span className="complexity-dot" style={{ background: COMPLEXITY_COLOR[s.complexity] || '#aaa' }} />
                          {COMPLEXITY_LABEL_TR[s.complexity] || s.complexity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {!confirmed ? (
                <div className="session-actions">
                  <button className="btn-reroll" onClick={handleReroll}>{tr('LOSUJ PONOWNIE', 'REDRAW')}</button>
                  <button className="btn-confirm" onClick={handleConfirm}>{tr('POTWIERDŻ SESJĘ', 'CONFIRM SESSION')}</button>
                </div>
              ) : (
                <div className="session-confirmed">
                  <CheckCircle size={18} color="#2ed573" />
                  <span>{tr('Sesja potwierdzona!', 'Session confirmed!')}</span>
                </div>
              )}
            </>
          ) : drawn ? (
            <div className="drawing-empty">
              <p>{tr('Brak dostępnych gier dla ', 'No games available for ')}{minPlayers}+ {tr('graczy.', 'players.')}</p>
              <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{tr('Dodaj gry do kolekcji lub zmień filtry.', 'Add games to your collection or change filters.')}</p>
            </div>
          ) : (
            <div className="drawing-placeholder">
              <RefreshCw size={40} color="var(--border-color)" />
              <p>{tr('Skonfiguruj ustawienia i kliknij', 'Configure settings and click')}<br /><strong>{tr('LOSUJ GRY', 'DRAW GAMES')}</strong></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
