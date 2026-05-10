import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { loginAsync, registerAsync } from '../data/db';
import {
  Dice5, LayoutGrid, Shuffle, Trophy,
  CalendarDays, Users, LogIn, UserPlus,
  Layers2, Sun, Moon
} from 'lucide-react';
import './LoginPage.css';

export default function LoginPage() {
  const { login, theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const clearMessages = () => { setError(''); setSuccess(''); };
  const switchMode = (m) => { setMode(m); clearMessages(); };

  const handleLogin = async () => {
    if (!password) { setError('Podaj hasło!'); return; }
    setLoading(true); clearMessages();
    try {
      const user = await loginAsync(email, password);
      if (!user) { setError('Nieprawidłowy email lub hasło.'); return; }
      login(user);
      navigate('/tournaments');
    } catch (ex) {
      setError(`Błąd połączenia: ${ex.message}`);
    } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!password) { setError('Podaj hasło!'); return; }
    if (password.length < 6) { setError('Hasło musi mieć minimum 6 znaków.'); return; }
    if (password !== confirmPassword) { setError('Hasła nie są identyczne!'); return; }
    setLoading(true); clearMessages();
    try {
      const { user, error: err } = await registerAsync(email, password, displayName);
      if (err) { setError(err); return; }
      setSuccess(`Konto "${user.displayName}" utworzone! Możesz się teraz zalogować.`);
      switchMode('login');
      setEmail(user.email);
      setDisplayName(''); setPassword(''); setConfirmPassword('');
    } catch (ex) {
      setError(`Błąd: ${ex.message}`);
    } finally { setLoading(false); }
  };

  return (
    <div className="login-root">
      <div className="blob blob1" />
      <div className="blob blob2" />
      <div className="blob blob3" />

      <button className="login-theme-btn" onClick={toggleTheme} title={theme === 'dark' ? 'Włącz tryb jasny' : 'Włącz tryb ciemny'}>
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        <span>{theme === 'dark' ? 'Tryb jasny' : 'Tryb ciemny'}</span>
      </button>

      <div className="login-layout">
        {/* LEFT: Branding */}
        <div className="login-left">
          <div className="login-branding">
            <div className="logo-row">
              <div className="logo-icon">
                <Dice5 size={28} color="white" />
              </div>
              <div>
                <h2 className="logo-title">
                  Board<span style={{ color: 'var(--color6)' }}>Games</span>
                </h2>
                <p className="logo-subtitle">Twoja platforma gier planszowych</p>
              </div>
            </div>

            <div className="logo-sep" />

            <div className="feature-list">
              <FeatureItem Icon={Layers2}   color="var(--color3)" title="Katalog Gier"      desc="Baza z tagami, ocenami i filtrowaniem" />
              <FeatureItem Icon={Shuffle}      color="var(--color4)" title="Losowanie Tytułu"  desc="Inteligentny dobór gry wg liczby graczy" />
              <FeatureItem Icon={Trophy}       color="var(--color6)" title="Turnieje"           desc="Drabinki pucharowe i ligi" />
              <FeatureItem Icon={CalendarDays} color="var(--color8)" title="Wydarzenia"         desc="Spotkania i listy obecności" />
              <FeatureItem Icon={Users}        color="#9B59B6"       title="Społeczność"        desc="Profile graczy i wymiana gier" />
            </div>
          </div>
        </div>

        {/* RIGHT: Form card */}
        <div className="login-right">
          <div className="login-card">
            <h2 className="login-card-title">
              Witaj w <span style={{ color: 'var(--color6)' }}>BoardGames</span>
            </h2>
            <p className="login-card-subtitle">
              {mode === 'login' ? 'Zaloguj się, aby kontynuować' : 'Utwórz nowe konto'}
            </p>

            <div className="login-tabs">
              <button
                className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => switchMode('login')}
              >Logowanie</button>
              <button
                className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
                onClick={() => switchMode('register')}
              >Rejestracja</button>
            </div>

            {mode === 'register' && (
              <div className="field-group">
                <label className="form-label">Wyświetlana nazwa</label>
                <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Twój nick" />
              </div>
            )}

            <div className="field-group">
              <label className="form-label">Adres e-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
            </div>

            <div className="field-group">
              <label className="form-label">Hasło</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            {mode === 'register' && (
              <div className="field-group">
                <label className="form-label">Potwierdź hasło</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
              </div>
            )}

            {error && <div className="msg-box msg-error">{error}</div>}
            {success && <div className="msg-box msg-success">{success}</div>}

            {mode === 'login' ? (
              <button
                className="btn-primary login-submit"
                onClick={handleLogin}
                disabled={loading || !email}
              >
                {loading
                  ? 'Logowanie...'
                  : <><LogIn size={15} style={{ marginRight: 8, verticalAlign: 'middle' }} />Zaloguj się</>
                }
              </button>
            ) : (
              <button
                className="btn-primary login-submit"
                onClick={handleRegister}
                disabled={loading || !email || !displayName}
              >
                {loading
                  ? 'Tworzenie...'
                  : <><UserPlus size={15} style={{ marginRight: 8, verticalAlign: 'middle' }} />Utwórz konto</>
                }
              </button>
            )}

            <p style={{ textAlign: 'center', marginTop: '12px', color: 'var(--text1)', fontSize: '12px' }}>
              Demo: <strong style={{ color: 'var(--color6)' }}>demo@example.com</strong> / <strong style={{ color: 'var(--color6)' }}>demo123</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ Icon, color, title, desc }) {
  return (
    <div className="feature-item">
      <div className="feature-icon">
        <Icon size={18} color={color} />
      </div>
      <div>
        <p className="feature-title">{title}</p>
        <p className="feature-desc">{desc}</p>
      </div>
    </div>
  );
}