import React, { useState, useEffect, useCallback } from 'react';
import { CalendarDays, CheckCheck, XOctagon, Trash2, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as db from '../data/db';
import './TwoColPage.css';

const statusLabel = { Planned: 'Zaplanowane', Confirmed: 'Potwierdzone', InProgress: 'W trakcie', Completed: 'Zakończone', Cancelled: 'Anulowane' };
const statusBadge = { Planned: 'badge-planned', Confirmed: 'badge-confirmed', InProgress: 'badge-inprogress', Completed: 'badge-completed', Cancelled: 'badge-cancelled' };
const attendeeBadge = { Pending: 'badge-pending', Confirmed: 'badge-confirmed', Declined: 'badge-declined', Maybe: 'badge-pending' };
const attendeeLabel = { Pending: 'Oczekuje', Confirmed: 'Potwierdził', Declined: 'Odrzucił', Maybe: 'Może' };

export default function EventsPage() {
  const { user, addToast } = useApp();
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [attendeeName, setAttendeeName] = useState('');

  // Form
  const [evtName, setEvtName] = useState('');
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [plannedGames, setPlannedGames] = useState('');

  const load = useCallback(async () => {
    const all = await db.getEventsAsync(user.id);
    setEvents(all);
    if (selected) {
      const fresh = all.find(e => e.id === selected.id);
      setSelected(fresh || null);
    }
  }, [user.id, selected?.id]);

  useEffect(() => { load(); }, []);

  const upcoming = events.filter(e => new Date(e.eventDate) >= new Date());
  const past = events.filter(e => new Date(e.eventDate) < new Date());

  const create = async () => {
    const evt = await db.createEventAsync(user.id, evtName, desc, location, date, startTime, endTime, plannedGames);
    addToast(`Wydarzenie "${evt.name}" utworzone!`, 'success');
    setEvtName(''); setDesc(''); setLocation(''); setPlannedGames('');
    load();
  };

  const addAttendee = async () => {
    if (!selected || !attendeeName) return;
    await db.addAttendeeAsync(selected.id, attendeeName);
    setAttendeeName('');
    addToast('Uczestnik dodany.', 'success');
    load();
  };

  const updateStatus = async (s) => {
    if (!selected) return;
    await db.updateEventStatusAsync(selected.id, s);
    addToast(`Status zmieniony na: ${statusLabel[s]}.`, 'info');
    load();
  };

  const deleteEvent = async () => {
    if (!selected) return;
    await db.deleteEventAsync(selected.id, user.id);
    setSelected(null);
    addToast('Wydarzenie usunięte.', 'info');
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
        Uczestników: {evt.attendees?.length || 0} •{' '}
        <span className={`badge ${statusBadge[evt.status] || ''}`}>{statusLabel[evt.status] || evt.status}</span>
      </p>
    </div>
  );

  return (
    <div className="tcpage">
      <div className="page-header">
        <h1><CalendarDays size={24} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--color8)' }} />
          <span style={{ color: 'var(--color8)' }}>Wydarzenia</span>
        </h1>
      </div>

      <div className="tcpage-cols">
        {/* LEFT */}
        <div className="tcpage-left">
          <div className="card">
            <p className="section-title">Nowe wydarzenie</p>

            <label className="form-label">Nazwa</label>
            <input value={evtName} onChange={e => setEvtName(e.target.value)} />

            <label className="form-label">Opis</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} />

            <label className="form-label">Lokalizacja</label>
            <input value={location} onChange={e => setLocation(e.target.value)} />

            <label className="form-label">Data</label>
            <input
              type="date"
              className="input-date-custom"
              value={date}
              onChange={e => setDate(e.target.value)}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Od</label>
                <input
                  type="time"
                  className="input-time-custom"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">Do</label>
                <input
                  type="time" 
                  className="input-time-custom"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <label className="form-label">Planowane gry (po przecinku)</label>
            <input value={plannedGames} onChange={e => setPlannedGames(e.target.value)} />

            <button
              className="btn-primary"
              style={{ marginTop: 10, width: '100%' }}
              onClick={create}
              disabled={!evtName}
            >
              Utwórz wydarzenie
            </button>
          </div>

          <p className="section-title">Nadchodzące</p>
          {upcoming.length === 0 && <p style={{ color: 'var(--text2)', fontSize: 13 }}>Brak nadchodzących.</p>}
          {upcoming.map(e => <EventItem key={e.id} evt={e} />)}

          <p className="section-title" style={{ marginTop: 10 }}>Zakończone / Anulowane</p>
          {past.length === 0 && <p style={{ color: 'var(--text2)', fontSize: 13 }}>Brak.</p>}
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
                  <CheckCheck size={14} style={{ marginRight: 6 }} />Zakończ
                </button>
                <button className="btn-danger" onClick={() => updateStatus('Cancelled')}>
                  <XOctagon size={14} style={{ marginRight: 6 }} />Anuluj wydarzenie
                </button>
                <button className="btn-danger" onClick={deleteEvent}>
                  <Trash2 size={14} style={{ marginRight: 6 }} />Usuń
                </button>
              </div>

              {/* Add attendee */}
              <div className="card">
                <p className="section-title">Dodaj uczestnika</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    value={attendeeName}
                    onChange={e => setAttendeeName(e.target.value)}
                    placeholder="Imię uczestnika"
                    style={{ flex: 1 }}
                    onKeyDown={e => e.key === 'Enter' && addAttendee()}
                  />
                  <button className="btn-primary" onClick={addAttendee} disabled={!attendeeName}>
                    <UserPlus size={14} style={{ marginRight: 6 }} />Dodaj
                  </button>
                </div>
              </div>

              {/* Attendees list */}
              <div className="card">
                <p className="section-title">Lista obecności</p>
                {currentAttendees.length === 0 && (
                  <p style={{ color: 'var(--text2)', fontSize: 13 }}>Brak uczestników.</p>
                )}
                {currentAttendees.map(a => (
                  <div key={a.id} className="card-inner attendee-row" style={{ marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13 }}>{a.name}</p>
                      <span className={`badge ${attendeeBadge[a.status] || ''}`}>
                        {attendeeLabel[a.status] || a.status}
                      </span>
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
              <h3>Wybierz wydarzenie z listy</h3>
              <p>lub utwórz nowe, aby zobaczyć szczegóły</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
