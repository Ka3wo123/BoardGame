import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { loginAsync, registerAsync } from '../data/db';
import { Dice5, LogIn, UserPlus, Sun, Moon, Globe } from 'lucide-react';
import BoardGameBackground from '../components/BoardGameBackground';
import './LoginPage.css';

export default function LoginPage() {
  const { login, theme, toggleTheme, language, toggleLanguage } = useApp();
  const t = (pl, en) => language === 'en' ? en : pl;
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const clearMessages = () => { setError(''); setSuccess(''); };
  const switchMode = (m) => { setMode(m); clearMessages(); };

  const handleLogin = async () => {
    if (!password) { setError(t('Podaj hasło!', 'Please enter your password!')); return; }
    setLoading(true); clearMessages();
    try {
      const user = await loginAsync(email, password);
      if (!user) { setError(t('Nieprawidłowy email lub hasło.', 'Invalid email or password.')); return; }
      login(user);
      navigate('/tournaments');
    } catch (ex) {
      setError(t(`Błąd połączenia: ${ex.message}`, `Connection error: ${ex.message}`));
    } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!password) { setError(t('Podaj hasło!', 'Please enter a password!')); return; }
    if (password.length < 6) { setError(t('Hasło musi mieć minimum 6 znaków.', 'Password must be at least 6 characters.')); return; }
    if (password !== confirmPassword) { setError(t('Hasła nie są identyczne!', 'Passwords do not match!')); return; }
    setLoading(true); clearMessages();
    try {
      const { user, error: err } = await registerAsync(email, password, displayName, fullName);
      if (err) { setError(err); return; }
      setSuccess(`Konto "${user.displayName}" utworzone! Możesz się teraz zalogować.`);
      switchMode('login');
      setEmail(user.email);
      setDisplayName(''); setFullName(''); setPassword(''); setConfirmPassword('');
    } catch (ex) {
      setError(`Błąd: ${ex.message}`);
    } finally { setLoading(false); }
  };

  return (
    <div className="login-root">
      <BoardGameBackground />

      {/* Logo - fixed in the top-left corner */}
      <div className="login-logo">
        <div className="logo-icon">
          <Dice5 size={26} color="white" />
        </div>
        <div>
          <h2 className="logo-title">
            Board<span style={{ color: 'var(--color6)' }}>Games</span>
          </h2>
          <p className="logo-subtitle">{t('Twoja platforma gier planszowych', 'Your board games platform')}</p>
        </div>
      </div>

      {/* Top-right controls */}
      <div className="login-controls">
        <button className="login-theme-btn" onClick={toggleTheme} title={theme === 'dark' ? t('Włącz tryb jasny', 'Light mode') : t('Włącz tryb ciemny', 'Dark mode')}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span>{theme === 'dark' ? t('Tryb jasny', 'Light') : t('Tryb ciemny', 'Dark')}</span>
        </button>
        <button className="login-theme-btn" onClick={toggleLanguage} title={t('Zmień język', 'Change language')}>
          <Globe size={18} />
          <span>{language === 'en' ? 'Polski' : 'English'}</span>
        </button>
      </div>

      {/* Centered auth card */}
      <div className="login-center">
        <div className="login-card">
          <h2 className="login-card-title">
            {t('Witaj w ', 'Welcome to ')}<span style={{ color: 'var(--color6)' }}>BoardGames</span>
          </h2>
          <p className="login-card-subtitle">
            {mode === 'login' ? t('Zaloguj się, aby kontynuować', 'Sign in to continue') : t('Utwórz nowe konto', 'Create a new account')}
          </p>

          <div className="login-tabs">
            <button
              className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode('login')}
            >{t('Logowanie', 'Sign in')}</button>
            <button
              className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => switchMode('register')}
            >{t('Rejestracja', 'Register')}</button>
          </div>

          {mode === 'register' && (
            <>
              <div className="field-group">
                <label className="form-label">{t('Wyświetlana nazwa (nick) *', 'Display name (nick) *')}</label>
                <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder={t('Twój nick', 'Your nick')} />
              </div>
              <div className="field-group">
                <label className="form-label">{t('Imię i nazwisko', 'Full name')}</label>
                <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder={t('np. Jan Kowalski', 'e.g. John Smith')} />
              </div>
            </>
          )}

          <div className="field-group">
            <label className="form-label">{t('Adres e-mail', 'Email address')}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
          </div>

          <div className="field-group">
            <label className="form-label">{t('Hasło', 'Password')}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          {mode === 'register' && (
            <div className="field-group">
              <label className="form-label">{t('Potwierdź hasło', 'Confirm password')}</label>
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
                ? t('Logowanie...', 'Signing in...')
                : <><LogIn size={15} style={{ marginRight: 8, verticalAlign: 'middle' }} />{t('Zaloguj się', 'Sign in')}</>
              }
            </button>
          ) : (
            <button
              className="btn-primary login-submit"
              onClick={handleRegister}
              disabled={loading || !email || !displayName}
            >
              {loading
                ? t('Tworzenie...', 'Creating...')
                : <><UserPlus size={15} style={{ marginRight: 8, verticalAlign: 'middle' }} />{t('Utwórz konto', 'Create account')}</>
              }
            </button>
          )}

          <p style={{ textAlign: 'center', marginTop: '14px', color: 'var(--text1)', fontSize: '12.5px' }}>
            Demo: <strong style={{ color: 'var(--color6)' }}>demo@example.com</strong> / <strong style={{ color: 'var(--color6)' }}>demo123</strong>
          </p>
          {mode === 'register' && (
            <p style={{ textAlign: 'center', marginTop: '6px', color: 'var(--text2)', fontSize: '11.5px' }}>
              {t('Rejestracja tworzy nowe konto lokalnie.', 'Registration creates a new local account.')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
