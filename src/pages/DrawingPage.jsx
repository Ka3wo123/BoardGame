import React, { useState } from 'react';
import { RefreshCw, CheckCircle, Clock, Users, Settings2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import * as db from '../data/db';
import './DrawingPage.css';

const WEIGHTING_OPTIONS = ['Losowo', 'Preferuj krótkie', 'Preferuj długie', 'Preferuj trudne'];

const WEIGHTING_KEY = {
  'Losowo': 'drawing.weighting.random',
  'Preferuj krótkie': 'drawing.weighting.preferShort',
  'Preferuj długie': 'drawing.weighting.preferLong',
  'Preferuj trudne': 'drawing.weighting.preferHard',
};

const COMPLEXITY_KEY = {
  'Łatwa': 'drawing.complexity.easy',
  'Średnia': 'drawing.complexity.medium',
  'Trudna': 'drawing.complexity.hard',
  'Ekspercka': 'drawing.complexity.expert',
  Easy: 'drawing.complexity.easy',
  Medium: 'drawing.complexity.medium',
  Hard: 'drawing.complexity.hard',
  Expert: 'drawing.complexity.expert',
};

const COMPLEXITY_COLOR = {
  Easy:   '#2ed573',
  Medium: '#ffa502',
  Hard:   '#ff6b81',
  Expert: '#ff4757',
};

export default function DrawingPage() {
  const { user, addToast } = useApp();
  const { t, i18n } = useTranslation();
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
      addToast(t('drawing.toasts.noGames'), 'warning');
      setSessions([]);
      setDrawn(true);
      return;
    }
    setSessions(result);
    setTotalMins(result.reduce((sum, s) => sum + Number(s.duration), 0));
    setDrawn(true);
    addToast(t('drawing.toasts.success', { count: result.length }), 'success');
  };

  const handleReroll = () => { handleDraw(); };

  const handleConfirm = () => {
    setConfirmed(true);
    addToast(t('drawing.toasts.confirmed'), 'success');
  };

  const totalHoursDisplay = totalMins >= 60
    ? '~' + (totalMins / 60).toFixed(1) + t('drawing.hoursShort')
    : totalMins + ' min';

  return (
    <div className="drawing-page">
      <div className="drawing-header">
        <h1 className="drawing-title">{t('drawing.headerTitle')}</h1>
        <p className="drawing-subtitle">
          {t('drawing.headerSubtitle')}
        </p>
      </div>

      <div className="drawing-body">
        {/* LEFT — Configuration */}
        <div className="drawing-left">
          <div className="config-card">
            <div className="config-card-title">
              <Settings2 size={15} />
              <span>{t('drawing.configTitle')}</span>
            </div>

            <label className="cfg-label">{t('drawing.minPlayersCfg')}</label>
            <div className="player-stepper">
              <button className="stepper-btn" onClick={() => setMinPlayers(p => Math.max(1, p - 1))}>&#8722;</button>
              <span className="stepper-value">{minPlayers}</span>
              <button className="stepper-btn" onClick={() => setMinPlayers(p => p + 1)}>+</button>
            </div>

            <label className="cfg-label" style={{ marginTop: 16 }}>{t('drawing.selectionPreference')}</label>
            <select className="cfg-select" value={weighting} onChange={e => setWeighting(e.target.value)}>
              {WEIGHTING_OPTIONS.map(o => <option key={o} value={o}>{t(WEIGHTING_KEY[o]) || o}</option>)}
            </select>

            <button className="btn-draw" onClick={handleDraw}>
              <RefreshCw size={16} />
              {t('drawing.btnDrawGames')}
            </button>
          </div>

          {drawn && sessions.length > 0 && (
            <div className="playtime-card">
              <div className="playtime-icon"><Clock size={22} color="var(--purple)" /></div>
              <div>
                <p className="playtime-label">{t('drawing.sessionTime')}</p>
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
                <h2 className="results-title">{t('drawing.resultsTitle')}</h2>
                <span className="results-badge">{sessions.length} {t('drawing.resultsFound')}</span>
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
                          <p className="session-desc">{s.description || t('drawing.boardGame')}</p>
                        </div>
                        <span className="session-mins">{s.duration} MIN</span>
                      </div>
                      <div className="session-meta-row">
                        <span className="session-meta-item">
                          <Users size={12} /> {s.minPlayers}-{s.maxPlayers} {t('drawing.players')}
                        </span>
                        <span className="session-meta-item">
                          <span className="complexity-dot" style={{ background: COMPLEXITY_COLOR[s.complexity] || '#aaa' }} />
                          {COMPLEXITY_KEY[s.complexity] ? t(COMPLEXITY_KEY[s.complexity]) : s.complexity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {!confirmed ? (
                <div className="session-actions">
                  <button className="btn-reroll" onClick={handleReroll}>{t('drawing.btnReroll')}</button>
                  <button className="btn-confirm" onClick={handleConfirm}>{t('drawing.btnConfirm')}</button>
                </div>
              ) : (
                <div className="session-confirmed">
                  <CheckCircle size={18} color="#2ed573" />
                  <span>{t('drawing.sessionConfirmed')}</span>
                </div>
              )}
            </>
          ) : drawn ? (
            <div className="drawing-empty">
              <p>{t('drawing.emptyForPlayers')}{minPlayers}+ {t('drawing.emptyPlayersSuffix')}</p>
              <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{t('drawing.emptyHint')}</p>
            </div>
          ) : (
            <div className="drawing-placeholder">
              <RefreshCw size={40} color="var(--purple)" />
              <p>{t('drawing.placeholderText')}<br /><strong>{t('drawing.btnDrawGames')}</strong></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
