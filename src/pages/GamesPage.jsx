import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Pencil, Check, X, Users, Timer, Dot } from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as db from '../data/db';
import './TwoColPage.css';
import './GamesPage.css';
import { useTranslation } from 'react-i18next';

const EMPTY_FORM = { title: '', description: '', people: 2, hours: 1, accessibility: true };

export default function GamesPage() {
  const { user, addToast } = useApp();
  const { t } = useTranslation();
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
    if (!form.title.trim()) { addToast(t('games.toasts.requiredTitle'), 'error'); return; }
    if (editId) {
      await db.updateBoardGameAsync(editId, form.title, form.description, form.people, form.hours, form.accessibility);
      addToast(t('games.toasts.updated', { title: form.title }), 'success');
    } else {
      await db.addBoardGameAsync(user.id, form.title, form.description, form.people, form.hours, form.accessibility);
      addToast(t('games.toasts.added', { title: form.title }), 'success');
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
    addToast(t('games.toasts.deleted', { title: g.title }), 'info');
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
          <h2>{t('games.title')}</h2>
          <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
            <div className='add-game'><Plus size={16} /> {t('games.btnAdd')}</div>
          </button>
        </div>

        <div className="games-filter">
          <label>{t('games.filterLabel')}</label>
          <input
            type="number" min="1" value={filterPeople}
            onChange={e => setFilterPeople(e.target.value)}
          />
          {filterPeople && <button className="btn-ghost" onClick={() => setFilterPeople('')}><X size={14} /></button>}
        </div>

        {filtered.length === 0 && <p className="empty-state">{t('games.emptyState')}</p>}

        <ul className="item-list">
          {filtered.map(g => (
            <li
              key={g.id}
              className={`item-card ${editId === g.id ? 'active' : ''}`}
            >
              <div className="item-card-body" onClick={() => startEdit(g)}>
                <strong className="item-title">{g.title}</strong>
                <span className="item-meta">
                  <Users size={15} /> {t('games.card.playersCount', { count: g.people })} <Dot />
                  <Timer size={15} /> {t('games.card.hoursCount', { count: g.hours })} <Dot />
                  {g.accessibility ? t('games.card.statusAvailable') : t('games.card.statusUnavailable')}
                </span>
                {g.description && <p className="item-desc">{g.description}</p>}
              </div>
              <div className="item-card-actions">
                <button className="btn-icon" title={t('games.card.titleEdit')} onClick={() => startEdit(g)}><Pencil size={15} /></button>
                <button className="btn-icon btn-danger" title={t('games.card.titleDelete')} onClick={() => handleDelete(g)}><Trash2 size={15} /></button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right — form */}
      <div className={`two-col-right ${showForm ? 'visible' : ''}`}>
        <div className="two-col-right-header">
          <h3>{editId ? t('games.form.titleEdit') : t('games.form.titleNew')}</h3>
          <button className="btn-icon" onClick={resetForm}><X size={16} /></button>
        </div>

        <div className="form-group">
          <label>{t('games.form.labelTitle')}</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder={t('games.form.placeholderTitle')} />
        </div>
        <div className="form-group">
          <label>{t('games.form.labelDesc')}</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder={t('games.form.placeholderDesc')} rows={3} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>{t('games.form.labelPlayers')}</label>
            <input type="number" min="1" value={form.people} onChange={e => setForm(f => ({ ...f, people: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>{t('games.form.labelHours')}</label>
            <input type="number" min="0.5" step="0.5" value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} />
          </div>
        </div>
        <div className="form-group form-checkbox">
          <label>
            <input type="checkbox" checked={form.accessibility} onChange={e => setForm(f => ({ ...f, accessibility: e.target.checked }))} />
            {t('games.form.labelAccessibility')}
          </label>
        </div>

        <div className="form-actions">
          <button className="btn-primary" onClick={handleSubmit}>
            <Check size={15} /> {editId ? t('games.form.btnSubmitEdit') : t('games.form.btnSubmitNew')}
          </button>
          <button className="btn-secondary" onClick={resetForm}>{t('games.form.btnCancel')}</button>
        </div>
      </div>
    </div>
  );
}