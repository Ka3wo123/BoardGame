import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Check, Archive } from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as db from '../data/db';
import './TwoColPage.css';
import './GamesPage.css';

const COMPLEXITY_OPTIONS = ['Łatwa', 'Średnia', 'Trudna', 'Ekspercka'];
const STATUS_OPTIONS = ['Available', 'In Use', 'Maintenance'];
const STATUS_LABEL = { Available: 'Dostępna', 'In Use': 'W użyciu', Maintenance: 'Serwis' };
const EMPTY_FORM = { title: '', description: '', minPlayers: 2, maxPlayers: 4, durationMin: 60, complexity: 'Średnia', status: 'Available', coverColor: '#6C3483' };
const STATUS_META = {
  Available:   { label: 'DOSTĘPNA',  cls: 'badge-available' },
  'In Use':    { label: 'W UŻYCIU',  cls: 'badge-inuse' },
  Maintenance: { label: 'SERWIS',    cls: 'badge-maintenance' },
};
const COVER_PRESETS = ['#6C3483','#1A5276','#7D6608','#1B4F72','#145A32','#7B241C','#4A235A','#1F618D'];

export default function GamesPage() {
  const { user, addToast, language } = useApp();
  const tr = (pl, en) => language === 'en' ? en : pl;
  const COMPLEXITY_EN = { 'Łatwa': 'Easy', 'Średniat': 'Medium', 'Trudna': 'Hard', 'Ekspercka': 'Expert' };
  const STATUS_META_TR = {
    Available:   { label: tr('DOSTĘPNA', 'AVAILABLE'), cls: 'badge-available' },
    'In Use':    { label: tr('W UŻYCIU', 'IN USE'),   cls: 'badge-inuse' },
    Maintenance: { label: tr('SERWIS', 'SERVICE'),  cls: 'badge-maintenance' },
  };
  const [games, setGames] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [filterPlayers, setFilterPlayers] = useState('');
  const [filterAvail, setFilterAvail] = useState('Wszystkie');

  const load = useCallback(async () => {
    const list = await db.getBoardGamesAsync(user.id);
    setGames(list);
  }, [user.id]);

  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(false); };

  const handleSubmit = async () => {
    if (!form.title.trim()) { addToast(tr('Tytuł jest wymagany.', 'Title is required.'), 'error'); return; }
    if (editId) {
      await db.updateBoardGameAsync(editId, form.title, form.description, form.minPlayers, form.maxPlayers, form.durationMin, form.complexity, form.status, form.coverColor);
      addToast(tr('Zaktualizowano "', 'Updated "') + form.title + '"', 'success');
    } else {
      await db.addBoardGameAsync(user.id, form.title, form.description, form.minPlayers, form.maxPlayers, form.durationMin, form.complexity, form.status, form.coverColor);
      addToast(tr('Dodano "', 'Added "') + form.title + '"', 'success');
    }
    resetForm(); load();
  };

  const startEdit = g => {
    setForm({ title: g.title, description: g.description, minPlayers: g.minPlayers, maxPlayers: g.maxPlayers, durationMin: g.durationMin, complexity: g.complexity, status: g.status, coverColor: g.coverColor || '#6C3483' });
    setEditId(g.id); setShowForm(true);
  };

  const handleDelete = async g => {
    await db.deleteBoardGameAsync(g.id);
    addToast(tr('Zarchiwizowano "', 'Removed "') + g.title + '"', 'info');
    if (editId === g.id) resetForm();
    load();
  };

  const filtered = games.filter(g => {
    const playerOk = filterPlayers ? g.maxPlayers >= Number(filterPlayers) : true;
    const availOk = filterAvail === 'All' || filterAvail === 'Wszystkie' ? true : g.status === filterAvail;
    return playerOk && availOk;
  });

  return (
    <div className="two-col-page">
      <div className="two-col-left">
        <div className="two-col-header">
          <div>
            <h2>{tr('Biblioteka gier', 'Game library')}</h2>
            <span className="total-badge">{games.length} {tr('ŁĄCZNIE', 'TOTAL')}</span>
          </div>
          <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus size={16} /> {tr('Dodaj grę', 'Add game')}
          </button>
        </div>

        <div className="games-filters">
          <div className="filter-group">
            <span className="filter-label">{tr('LICZBA GRACZY', 'PLAYERS')}</span>
            <select value={filterPlayers} onChange={e => setFilterPlayers(e.target.value)} className="filter-select">
              <option value="">{tr('Dowolna', 'Any')}</option>
              {[2,3,4,5,6,8].map(n => <option key={n} value={n}>{n}+ {tr('graczy', 'players')}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <span className="filter-label">{tr('DOSTĘPNOŚĆ', 'AVAILABILITY')}</span>
            <select value={filterAvail} onChange={e => setFilterAvail(e.target.value)} className="filter-select">
              <option value="Wszystkie">{tr('Wszystkie', 'All')}</option>
              <option value="Available">{tr('Dostępna', 'Available')}</option>
              <option value="In Use">{tr('W użyciu', 'In Use')}</option>
              <option value="Maintenance">{tr('Serwis', 'Service')}</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 && <p className="empty-state">{tr('Brak gier w kolekcji.', 'No games in collection.')}</p>}

        <ul className="item-list">
          {filtered.map(g => {
            const sm = STATUS_META_TR[g.status] || STATUS_META_TR.Available;
            return (
              <li key={g.id} className={"game-card " + (editId === g.id ? 'active' : '')} onClick={() => startEdit(g)}>
                <div className="game-cover" style={{ background: g.coverColor || '#6C3483' }}>
                  <span className="game-cover-initial">{g.title[0]}</span>
                </div>
                <div className="game-card-body">
                  <strong className="item-title">{g.title}</strong>
                  {g.description && <p className="item-desc">{g.description}</p>}
                  <div className="game-card-meta">
                    <span>👥 {g.minPlayers}–{g.maxPlayers}</span>
                    <span>⏱ {g.durationMin}min</span>
                    <span className={"status-badge " + sm.cls}>{sm.label}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={"two-col-right " + (showForm ? 'visible' : '')}>
        {showForm ? (
          <>
            <div className="two-col-right-header">
              <div>
                <h3>{editId ? tr('Edytuj grę', 'Edit game') : tr('Nowa gra', 'New game')}</h3>
                <p className="right-subtitle">{tr('Uzupełnij informacje o grze i jej dostępności', 'Fill in game details and availability')}</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-secondary" onClick={resetForm}>{tr('Anuluj', 'Cancel')}</button>
                <button className="btn-primary" onClick={handleSubmit}>
                  <Check size={15} /> {tr('Zapisz', 'Save')}
                </button>
              </div>
            </div>

            <div className="edit-layout">
              <div className="edit-main">
                <div className="form-group">
                  <label>{tr('TYTUŁ GRY', 'GAME TITLE')}</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder={tr('Nazwa gry', 'Game name')} />
                </div>
                <div className="form-group">
                  <label>{tr('OPIS', 'DESCRIPTION')}</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder={tr('Krótki opis gry', 'Short game description')} rows={4} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{tr('MIN. GRACZY', 'MIN. PLAYERS')}</label>
                    <input type="number" min="1" value={form.minPlayers} onChange={e => setForm(f => ({ ...f, minPlayers: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>{tr('MAX. GRACZY', 'MAX. PLAYERS')}</label>
                    <input type="number" min="1" value={form.maxPlayers} onChange={e => setForm(f => ({ ...f, maxPlayers: e.target.value }))} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{tr('CZAS GRY (MIN)', 'PLAY TIME (MIN)')}</label>
                    <input type="number" min="5" step="5" value={form.durationMin} onChange={e => setForm(f => ({ ...f, durationMin: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>{tr('TRUDNOŚĆ', 'DIFFICULTY')}</label>
                    <select value={form.complexity} onChange={e => setForm(f => ({ ...f, complexity: e.target.value }))}>
                      {COMPLEXITY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="edit-side">
                <div className="form-group">
                  <label>{tr('OKŁADKA GRY', 'GAME COVER')}</label>
                  <div className="cover-preview" style={{ background: form.coverColor }}>
                    <span className="cover-preview-initial">{form.title ? form.title[0] : '?'}</span>
                  </div>
                  <div className="color-presets">
                    {COVER_PRESETS.map(c => (
                      <button key={c} className={"color-dot " + (form.coverColor === c ? 'selected' : '')} style={{ background: c }} onClick={() => setForm(f => ({ ...f, coverColor: c }))} />
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: 16 }}>
                  <label>{tr('STATUS', 'STATUS')}</label>
                  <div className="status-radio-list">
                    {STATUS_OPTIONS.map(s => (
                      <label key={s} className={"status-radio " + (form.status === s ? 'checked' : '')}>
                        <input type="radio" name="status" checked={form.status === s} onChange={() => setForm(f => ({ ...f, status: s }))} />
                        <div>
                          <span className={"status-radio-label status-label-" + s.replace(' ', '-')}>{STATUS_META_TR[s]?.label || s}</span>
                          <span className="status-radio-desc">
                            {s === 'Available' ? tr('Gotowa do gry', 'Ready to play') : s === 'In Use' ? tr('Aktualnie używana', 'Currently in use') : tr('Uszkodzona lub brakuje części', 'Damaged or missing parts')}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {editId && (
                  <button className="btn-archive" onClick={() => handleDelete({ id: editId, title: form.title })}>
                    <Archive size={14} /> {tr('USUŃ Z KATALOGU', 'REMOVE FROM CATALOG')}
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state" style={{ margin: 'auto' }}>
            <p>{tr('Wybierz grę z listy lub dodaj nową', 'Select a game or add a new one')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
