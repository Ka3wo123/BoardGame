import React, { useState, useEffect, useCallback } from 'react';
import { CalendarDays, CheckCheck, XOctagon, Trash2, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import * as db from '../data/db';
import './TwoColPage.css';

const statusBadge = { Planned: 'badge-planned', Confirmed: 'badge-confirmed', InProgress: 'badge-inprogress', Completed: 'badge-completed', Cancelled: 'badge-cancelled' };
const attendeeBadge = { Pending: 'badge-pending', Confirmed: 'badge-confirmed', Declined: 'badge-declined', Maybe: 'badge-pending' };

export default function EventsPage() {
  const { user, addToast } = useApp();
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [attendeeSearchResults, setAttendeeSearchResults] = useState([]);

  // Form
  const [evtName, setEvtName] = useState('');
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [plannedGames, setPlannedGames] = useState('');

  // Players added during creation
  const [formPlayerSearch, setFormPlayerSearch] = useState('');
  const [formPlayerSearchResults, setFormPlayerSearchResults] = useState([]);
  const [formPlayers, setFormPlayers] = useState([]);
  const [formManualPlayer, setFormManualPlayer] = useState('');

  const load = useCallback(async () => {
    const all = await db.getEventsAsync(user.id);
    setEvents(all);
    if (selected) {
      const fresh = all.find(e => e.id === selected.id);
      setSelected(fresh || null);
    }
  }, [user.id, selected?.id]);

  useEffect(() => { load(); }, []);

  // Search for attendees in the event detail panel
  useEffect(() => {
    if (attendeeSearch.length < 2) { setAttendeeSearchResults([]); return; }
    const t = setTimeout(async () => {
      const res = await db.searchPlayersGlobalAsync(attendeeSearch);
      setAttendeeSearchResults(res);
    }, 250);
    return () => clearTimeout(t);
  }, [attendeeSearch]);

  // Search for players during event creation form
  useEffect(() => {
    if (formPlayerSearch.length < 2) { setFormPlayerSearchResults([]); return; }
    const t = setTimeout(async () => {
      const res = await db.searchPlayersGlobalAsync(formPlayerSearch);
      setFormPlayerSearchResults(res.filter(r => !formPlayers.find(p => p.name === (r.nickname || r.name))));
    }, 250);
    return () => clearTimeout(t);
  }, [formPlayerSearch, formPlayers]);

  const upcoming = events.filter(e => new Date(e.eventDate) >= new Date());
  const past = events.filter(e => new Date(e.eventDate) < new Date());

  const addFormPlayer = (p) => {
    const name = p.nickname || p.name;
    if (formPlayers.find(x => x.name === name)) return;
    setFormPlayers(prev => [...prev, { name, linkedUserId: p.isUser ? p.creatorId : null, ownedGames: p.ownedGames || [] }]);
    setFormPlayerSearch('');
    setFormPlayerSearchResults([]);
  };

  const addFormManualPlayer = () => {
    const n = formManualPlayer.trim();
    if (!n || formPlayers.find(x => x.name === n)) return;
    setFormPlayers(prev => [...prev, { name: n }]);
    setFormManualPlayer('');
  };

  const create = async () => {
    const evt = await db.createEventAsync(user.id, evtName, desc, location, date, startTime, endTime, plannedGames);
    addToast(t('events.toasts.created', { name: evt.name }), 'success');
    setEvtName(''); setDesc(''); setLocation(''); setPlannedGames('');
    setDate(''); setStartTime(''); setEndTime('');
    setFormPlayers([]); setFormPlayerSearch('');
    load();
  };

  const addAttendee = async (nameOverride, linkedUserId) => {
    if (!selected) return;
    const n = nameOverride || attendeeName;
    if (!n) return;
    await db.addAttendeeAsync(selected.id, n, linkedUserId || null);
    setAttendeeName('');
    addToast(t('events.toasts.attendeeAdded'), 'success');
    load();
  };

  const updateStatus = async (s) => {
    if (!selected) return;
    await db.updateEventStatusAsync(selected.id, s);
    addToast(t('events.toasts.statusChanged', { status: statusLabel[s] }), 'info');
    load();
  };

  const deleteEvent = async () => {
    if (!selected) return;
    await db.deleteEventAsync(selected.id, user.id);
    setSelected(null);
    addToast(t('events.toasts.deleted'), 'info');
    load();
  };

  const updateAttendee = async (attendeeId, s) => {
    if (!selected) return;
    await db.updateAttendeeStatusAsync(selected.id, attendeeId, s);
    load();
  };

  const currentAttendees = selected?.attendees || [];

  const EventItem = ({ evt }) => (
    <div
      className={`card-inner list-item ${selected?.id === evt.id ? 'list-item-active' : ''}`}
      onClick={() => setSelected(evt)}
      style={{ cursor: 'pointer', marginBottom: 6 }}
    >
      <p style={{ color: 'var(--color8)', fontWeight: 600, fontSize: 14 }}>{evt.name}</p>

      <p style={{ color: 'var(--text1)', fontSize: 11 }}>
        {new Date(evt.eventDate).toLocaleDateString('pl-PL')} • {evt.location}
      </p>
      <p style={{ color: 'var(--text2)', fontSize: 11 }}>
        {t('events.details.attendeesCount')}: {evt.attendees?.length || 0} •{' '}
        <span className={`badge ${statusBadge[evt.status] || ''}`}>{statusLabel[evt.status] || evt.status}</span>
      </p>
    </div>
  );

  return (
    <div className="tcpage">
      <div className="page-header">
        <h1><CalendarDays size={24} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--color8)' }} />
          <span style={{ color: 'var(--color8)' }}>{t('events.title')}</span>
        </h1>
      </div>

      <div className="tcpage-cols">
        {/* LEFT */}
        <div className="tcpage-left">
          <div className="card">
            <p className="section-title">{t('events.newEvent')}</p>

            <label className="form-label">{t('events.form.name')}</label>
            <input value={evtName} onChange={e => setEvtName(e.target.value)} />

            <label className="form-label">{t('events.form.desc')}</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} />

            <label className="form-label">{t('events.form.location')}</label>
            <input value={location} onChange={e => setLocation(e.target.value)} />

            <label className="form-label">{t('events.form.date')}</label>
            <input
              type="date"
              className="input-date-custom"
              value={date}
              onChange={e => setDate(e.target.value)}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">{t('events.form.from')}</label>
                <input
                  type="time"
                  className="input-time-custom"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">{t('events.form.to')}</label>
                <input
                  type="time"
                  className="input-time-custom"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <label className="form-label">{t('events.form.plannedGames')}</label>
            <input value={plannedGames} onChange={e => setPlannedGames(e.target.value)} />

            <button
              className="btn-primary"
              style={{ marginTop: 10, width: '100%' }}
              onClick={create}
              disabled={!evtName}
            >
              {t('events.form.btnCreate')}
            </button>
          </div>

          <p className="section-title">{t('events.sections.upcoming')}</p>
          {upcoming.length === 0 && <p style={{ color: 'var(--text2)', fontSize: 13 }}>{t('events.sections.noUpcoming')}</p>}
          {upcoming.map(e => <EventItem key={e.id} evt={e} />)}

          <p className="section-title" style={{ marginTop: 10 }}>{t('events.sections.past')}</p>
          {past.length === 0 && <p style={{ color: 'var(--text2)', fontSize: 13 }}>{t('events.sections.noPast')}</p>}
          {past.map(e => (
            <div key={e.id} style={{ opacity: 0.7 }}>
              <EventItem evt={e} />
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="tcpage-right">
          {selected ? (
            <>
              <div className="action-row">
                <button className="btn-secondary" onClick={() => updateStatus('Completed')}>
                  <CheckCheck size={14} style={{ marginRight: 6 }} />{t('events.details.btnComplete')}
                </button>
                <button className="btn-danger" onClick={() => updateStatus('Cancelled')}>
                  <XOctagon size={14} style={{ marginRight: 6 }} />{t('events.details.btnCancelEvent')}
                </button>
                <button className="btn-danger" onClick={deleteEvent}>
                  <Trash2 size={14} style={{ marginRight: 6 }} />{t('events.details.btnDelete')}
                </button>
              </div>

              {/* Add attendee */}
              <div className="card">
                <p className="section-title">{t('events.details.addAttendee')}</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    value={attendeeName}
                    onChange={e => setAttendeeName(e.target.value)}
                    placeholder={t('events.details.attendeePlaceholder')}
                    style={{ flex: 1 }}
                    onKeyDown={e => e.key === 'Enter' && addAttendee()}
                  />
                  <button className="btn-primary" onClick={addAttendee} disabled={!attendeeName}>
                    <UserPlus size={14} style={{ marginRight: 6 }} />{t('events.details.btnAdd')}
                  </button>
                </div>
              </div>

              {/* Attendees list */}
              <div className="card">
                <p className="section-title">{t('events.details.attendanceList')}</p>
                {currentAttendees.length === 0 && (
                  <p style={{ color: 'var(--text2)', fontSize: 13 }}>{t('events.details.noAttendees')}</p>
                )}
                {currentAttendees.map(a => (
                  <div key={a.id} className="card-inner attendee-row" style={{ marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight:600, margin:'0 0 2px' }}>{a.name}</p>
                      <span className={`badge ${attendeeBadge[a.status] || ''}`}>
                        {attendeeLabel[a.status] || a.status}
                      </span>
                      {a.ownedGames?.length > 0 && (
                        <div style={{ marginTop:4, display:'flex', flexWrap:'wrap', gap:3 }}>
                          {a.ownedGames.map(g => (
                            <span key={g} style={{ fontSize:10, background:'var(--panel)', color:'var(--purple)', borderRadius:8, padding:'1px 6px' }}>🎲 {g}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      className="btn-primary"
                      style={{ padding: '4px 10px', fontSize: 13 }}
                      onClick={() => updateAttendee(a.id, 'Confirmed')}
                    >✓</button>
                    <button
                      className="btn-danger"
                      style={{ padding: '4px 10px', fontSize: 13 }}
                      onClick={() => updateAttendee(a.id, 'Declined')}
                    >✗</button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="card empty-state">
              <CalendarDays size={48} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--color8)' }} />
              <h3>{t('events.details.emptyStateTitle')}</h3>
              <p>{t('events.details.emptyStateDesc')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
