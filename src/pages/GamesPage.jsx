import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as db from '../data/db';
import './TwoColPage.css';
import './GamesPage.css';

const EMPTY_FORM = { title: '', description: '', people: 2, hours: 1, accessibility: true };

export default function GamesPage() {
  const { user, addToast } = useApp();
  const [games, setGames] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [filterPeople, setFilterPeople] = useState('');

  const load = useCallback(async () => {
    const list = await db.getBoardGamesAsync(user.id);
    setGames(list);
  }, [user.id]);

  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(false); };

  const handleSubmit = async () => {
    if (!form.title.trim()) { addToast('Tytuł jest wymagany.', 'error'); return; }
    if (editId) {
      await db.updateBoardGameAsync(editId, form.title, form.description, form.people, form.hours, form.accessibility);
      addToast(`Zaktualizowano "${form.title}".`, 'success');
    } else {
      await db.addBoardGameAsync(user.id, form.title, form.description, form.people, form.hours, form.accessibility);
      addToast(`Dodano "${form.title}".`, 'success');
    }
    resetForm();
    load();
  };

  const startEdit = (g) => {
    setForm({ title: g.title, description: g.description, people: g.people, hours: g.hours, accessibility: g.accessibility });
    setEditId(g.id);
    setShowForm(true);
  };

  const handleDelete = async (g) => {
    await db.deleteBoardGameAsync(g.id);
    addToast(`Usunięto "${g.title}".`, 'info');
    load();
  };

  const filtered = filterPeople
    ? games.filter(g => g.people >= Number(filterPeople))
    : games;

  return (
    <div className="two-col-page">
      {/* Left — list */}
      <div className="two-col-left">
        <div className="two-col-header">
          <h2>Kolekcja gier</h2>
          <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus size={16} /> Dodaj grę
          </button>
        </div>

        <div className="games-filter">
          <label>Filtruj – min. graczy:</label>
          <input
            type="number" min="1" value={filterPeople}
            onChange={e => setFilterPeople(e.target.value)}
            placeholder="np. 4"
          />
          {filterPeople && <button className="btn-ghost" onClick={() => setFilterPeople('')}><X size={14} /></button>}
        </div>

        {filtered.length === 0 && <p className="empty-state">Brak gier w kolekcji.</p>}

        <ul className="item-list">
          {filtered.map(g => (
            <li
              key={g.id}
              className={`item-card ${editId === g.id ? 'active' : ''}`}
            >
              <div className="item-card-body" onClick={() => startEdit(g)}>
                <strong className="item-title">{g.title}</strong>
                <span className="item-meta">👥 {g.people} graczy · ⏱ {g.hours}h · {g.accessibility ? '✅ Dostępna' : '🚫 Niedostępna'}</span>
                {g.description && <p className="item-desc">{g.description}</p>}
              </div>
              <div className="item-card-actions">
                <button className="btn-icon" title="Edytuj" onClick={() => startEdit(g)}><Pencil size={15} /></button>
                <button className="btn-icon btn-danger" title="Usuń" onClick={() => handleDelete(g)}><Trash2 size={15} /></button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right — form */}
      <div className={`two-col-right ${showForm ? 'visible' : ''}`}>
        <div className="two-col-right-header">
          <h3>{editId ? 'Edytuj grę' : 'Nowa gra'}</h3>
          <button className="btn-icon" onClick={resetForm}><X size={16} /></button>
        </div>

        <div className="form-group">
          <label>Tytuł *</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Nazwa gry" />
        </div>
        <div className="form-group">
          <label>Opis</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Krótki opis gry" rows={3} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Liczba graczy</label>
            <input type="number" min="1" value={form.people} onChange={e => setForm(f => ({ ...f, people: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Czas (h)</label>
            <input type="number" min="0.5" step="0.5" value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} />
          </div>
        </div>
        <div className="form-group form-checkbox">
          <label>
            <input type="checkbox" checked={form.accessibility} onChange={e => setForm(f => ({ ...f, accessibility: e.target.checked }))} />
            Dostępna (uwzględniaj w losowaniu)
          </label>
        </div>

        <div className="form-actions">
          <button className="btn-primary" onClick={handleSubmit}>
            <Check size={15} /> {editId ? 'Zapisz zmiany' : 'Dodaj grę'}
          </button>
          <button className="btn-secondary" onClick={resetForm}>Anuluj</button>
        </div>
      </div>
    </div>
  );
}
