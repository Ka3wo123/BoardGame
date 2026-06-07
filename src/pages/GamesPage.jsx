import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Check, Archive, Users, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as db from '../data/db';
import './TwoColPage.css';
import './GamesPage.css';

const COMPLEXITY_OPTIONS = ['Łatwa', 'Średnia', 'Trudna', 'Ekspercka'];
const COMPLEXITY_KEY = { 'Łatwa': 'games.complexity.easy', 'Średnia': 'games.complexity.medium', 'Trudna': 'games.complexity.hard', 'Ekspercka': 'games.complexity.expert' };
const STATUS_OPTIONS = ['Available', 'In Use', 'Maintenance'];
const EMPTY_FORM = { title: '', description: '', minPlayers: 2, maxPlayers: 4, durationMin: 60, complexity: 'Średnia', status: 'Available', coverColor: '#6C3483' };
const STATUS_META = {
  Available:   { labelKey: 'games.status.available',  cls: 'badge-available' },
  'In Use':    { labelKey: 'games.status.inUse',      cls: 'badge-inuse' },
  Maintenance: { labelKey: 'games.status.service',    cls: 'badge-maintenance' },
};
const COVER_PRESETS = ['#6C3483','#1A5276','#7D6608','#1B4F72','#145A32','#7B241C','#4A235A','#1F618D'];

export default function GamesPage() {
  const { user, addToast } = useApp();
  const { t } = useTranslation();
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
    if (!form.title.trim()) { addToast(t('games.toasts.requiredTitle'), 'error'); return; }
    if (editId) {
      await db.updateBoardGameAsync(editId, form.title, form.description, form.minPlayers, form.maxPlayers, form.durationMin, form.complexity, form.status, form.coverColor);
      addToast(t('games.toasts.updated', { title: form.title }), 'success');
    } else {
      await db.addBoardGameAsync(user.id, form.title, form.description, form.minPlayers, form.maxPlayers, form.durationMin, form.complexity, form.status, form.coverColor);
      addToast(t('games.toasts.added', { title: form.title }), 'success');
    }
    resetForm(); load();
  };

  const startEdit = g => {
    setForm({ title: g.title, description: g.description, minPlayers: g.minPlayers, maxPlayers: g.maxPlayers, durationMin: g.durationMin, complexity: g.complexity, status: g.status, coverColor: g.coverColor || '#6C3483' });
    setEditId(g.id); setShowForm(true);
  };

  const handleDelete = async g => {
    await db.deleteBoardGameAsync(g.id);
    addToast(t('games.toasts.archived', { title: g.title }), 'info');
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
            <h2>{t('games.libraryTitle')}</h2>
            <span className="total-badge">{games.length} {t('games.total')}</span>
          </div>
          <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus size={16} /> {t('games.btnAdd')}
          </button>
        </div>

        <div className="games-filters">
          <div className="filter-group">
            <span className="filter-label">{t('games.filters.playersLabel')}</span>
            <select value={filterPlayers} onChange={e => setFilterPlayers(e.target.value)} className="filter-select">
              <option value="">{t('games.filters.any')}</option>
              {[2,3,4,5,6,8].map(n => <option key={n} value={n}>{n}+ {t('games.filters.players')}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <span className="filter-label">{t('games.filters.availabilityLabel')}</span>
            <select value={filterAvail} onChange={e => setFilterAvail(e.target.value)} className="filter-select">
              <option value="Wszystkie">{t('games.filters.all')}</option>
              <option value="Available">{t('games.filters.available')}</option>
              <option value="In Use">{t('games.filters.inUse')}</option>
              <option value="Maintenance">{t('games.filters.service')}</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 && <p className="empty-state">{t('games.emptyState')}</p>}

        <ul className="item-list">
          {filtered.map(g => {
            const sm = STATUS_META[g.status] || STATUS_META.Available;
            return (
              <li key={g.id} className={"game-card " + (editId === g.id ? 'active' : '')} onClick={() => startEdit(g)}>
                <div className="game-cover" style={{ background: g.coverColor || '#6C3483' }}>
                  <span className="game-cover-initial">{g.title[0]}</span>
                </div>
                <div className="game-card-body">
                  <strong className="item-title">{g.title}</strong>
                  {g.description && <p className="item-desc">{g.description}</p>}
                  <div className="game-card-meta">
                    <span><Users size={13} style={{verticalAlign:'middle',marginRight:3}}/> {g.minPlayers}–{g.maxPlayers}</span>
                    <span><Clock size={13} style={{verticalAlign:'middle',marginRight:3}}/> {g.durationMin}min</span>
                    <span className={"status-badge " + sm.cls}>{t(sm.labelKey)}</span>
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
                <h3>{editId ? t('games.editForm.titleEdit') : t('games.editForm.titleNew')}</h3>
                <p className="right-subtitle">{t('games.editForm.subtitle')}</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-secondary" onClick={resetForm}>{t('games.editForm.cancel')}</button>
                <button className="btn-primary" onClick={handleSubmit}>
                  <Check size={15} /> {t('games.editForm.save')}
                </button>
              </div>
            </div>

            <div className="edit-layout">
              <div className="edit-main">
                <div className="form-group">
                  <label>{t('games.editForm.gameTitle')}</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder={t('games.editForm.gameTitlePlaceholder')} />
                </div>
                <div className="form-group">
                  <label>{t('games.editForm.description')}</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder={t('games.editForm.descriptionPlaceholder')} rows={4} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('games.editForm.minPlayers')}</label>
                    <input type="number" min="1" value={form.minPlayers} onChange={e => setForm(f => ({ ...f, minPlayers: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>{t('games.editForm.maxPlayers')}</label>
                    <input type="number" min="1" value={form.maxPlayers} onChange={e => setForm(f => ({ ...f, maxPlayers: e.target.value }))} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('games.editForm.playTime')}</label>
                    <input type="number" min="5" step="5" value={form.durationMin} onChange={e => setForm(f => ({ ...f, durationMin: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>{t('games.editForm.difficulty')}</label>
                    <select value={form.complexity} onChange={e => setForm(f => ({ ...f, complexity: e.target.value }))}>
                      {COMPLEXITY_OPTIONS.map(c => <option key={c} value={c}>{t(COMPLEXITY_KEY[c])}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="edit-side">
                <div className="form-group">
                  <label>{t('games.editForm.cover')}</label>
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
                  <label>{t('games.editForm.statusLabel')}</label>
                  <div className="status-radio-list">
                    {STATUS_OPTIONS.map(s => (
                      <label key={s} className={"status-radio " + (form.status === s ? 'checked' : '')}>
                        <input type="radio" name="status" checked={form.status === s} onChange={() => setForm(f => ({ ...f, status: s }))} />
                        <div>
                          <span className={"status-radio-label status-label-" + s.replace(' ', '-')}>{t(STATUS_META[s]?.labelKey || 'games.status.available')}</span>
                          <span className="status-radio-desc">
                            {s === 'Available' ? t('games.status.descAvailable') : s === 'In Use' ? t('games.status.descInUse') : t('games.status.descService')}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {editId && (
                  <button className="btn-archive" onClick={() => handleDelete({ id: editId, title: form.title })}>
                    <Archive size={14} /> {t('games.editForm.removeFromCatalog')}
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state" style={{ margin: 'auto' }}>
            <p>{t('games.editForm.emptyRight')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
