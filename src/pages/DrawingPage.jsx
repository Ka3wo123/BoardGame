import React, { useState } from 'react';
import { Shuffle, Clock, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as db from '../data/db';
import './DrawingPage.css';

export default function DrawingPage() {
  const { addToast } = useApp();
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  const [sessions, setSessions] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [drawn, setDrawn] = useState(false);

  const handleDraw = async () => {
    const result = await db.createDrawingAsync(Number(numberOfPlayers));
    if (result.length === 0) {
      addToast('Brak dostępnych gier dla podanej liczby graczy.', 'warning');
      setSessions([]);
      setDrawn(true);
      return;
    }
    setSessions(result);
    setTotalHours(result.reduce((sum, s) => sum + Number(s.duration), 0));
    setDrawn(true);
    addToast(`Wylosowano ${result.length} gier.`, 'success');
  };

  return (
    <div className="drawing-page">
      <div className="drawing-header">
        <h2>Losowanie gier</h2>
        <p className="drawing-subtitle">Wylosuj kolejność gier spośród dostępnych w kolekcji.</p>
      </div>

      <div className="drawing-controls">
        <div className="form-group">
          <label><Users size={15} /> Minimalna liczba graczy</label>
          <input
            type="number" min="1" value={numberOfPlayers}
            onChange={e => setNumberOfPlayers(e.target.value)}
          />
        </div>
        <button className="btn-primary btn-draw" onClick={handleDraw}>
          <Shuffle size={18} /> Losuj
        </button>
      </div>

      {drawn && sessions.length === 0 && (
        <div className="drawing-empty">
          Żadna gra nie spełnia kryteriów (dostępna + min. {numberOfPlayers} graczy).
        </div>
      )}

      {sessions.length > 0 && (
        <div className="drawing-results">
          <div className="drawing-total">
            <Clock size={16} /> Łączny czas: <strong>{totalHours}h</strong>
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
