import React, { useState } from 'react';
import { Shuffle, Clock, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import * as db from '../data/db';
import './DrawingPage.css';

export default function DrawingPage() {
  const { addToast } = useApp();
  const { t } = useTranslation();
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
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

  return (
    <div className="drawing-page">
      <div className="drawing-header">
        <h2>{t('drawing.title')}</h2>
        <p className="drawing-subtitle">{t('drawing.subtitle')}</p>
      </div>

      <div className="drawing-controls">
        <div className="form-group">
          <label><Users size={15} /> {t('drawing.minPlayersLabel')}</label>
          <input
            type="number" min="1" value={numberOfPlayers}
            onChange={e => setNumberOfPlayers(e.target.value)}
          />
        </div>
        <button className="btn-primary btn-draw" onClick={handleDraw}>
          <Shuffle size={18} /> {t('drawing.btnDraw')}
        </button>
      </div>

      {drawn && sessions.length === 0 && (
        <div className="drawing-empty">
          {t('drawing.emptyState', { count: numberOfPlayers })}
        </div>
      )}

      {sessions.length > 0 && (
        <div className="drawing-results">
          <div className="drawing-total">
            <Clock size={16} /> {t('drawing.totalTime')} <strong>{totalHours}h</strong>
          </div>
          <ul className="session-list">
            {sessions.map(s => (
              <li key={s.number} className="session-card">
                <span className="session-number">#{s.number}</span>
                <span className="session-title">{s.title}</span>
                <span className="session-duration"><Clock size={13} /> {s.duration}h</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
