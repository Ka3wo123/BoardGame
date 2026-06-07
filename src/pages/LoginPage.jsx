import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { loginAsync, registerAsync } from '../data/db';
import { Dice5, LogIn, UserPlus, Sun, Moon, Globe } from 'lucide-react';
import BoardGameBackground from '../components/BoardGameBackground';
import './LoginPage.css';

export default function LoginPage() {
  const { login, theme, toggleTheme } = useApp();
  const { t, i18n } = useTranslation();
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
  const toggleLanguage = () => i18n.changeLanguage(i18n.language === 'en' ? 'pl' : 'en');

  const handleLogin = async () => {
    if (!password) { setError(t('login.errors.requiredPassword')); return; }
    setLoading(true); clearMessages();
    try {
      const user = await loginAsync(email, password);
      if (!user) { setError(t('login.errors.invalidCredentials')); return; }
      login(user);
      navigate('/tournaments');
    } catch (ex) {
      setError(t('login.errors.connectionError', { message: ex.message }));
    } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!password) { setError(t('login.errors.requiredPassword')); return; }
    if (password.length < 6) { setError(t('login.errors.passwordLength')); return; }
    if (password !== confirmPassword) { setError(t('login.errors.passwordsNotMatch')); return; }
    setLoading(true); clearMessages();
    try {
      const { user, error: err } = await registerAsync(email, password, displayName, fullName);
      if (err) { setError(err); return; }
      setSuccess(t('login.messages.accountCreated', { name: user.displayName }));
      switchMode('login');
      setEmail(user.email);
      setDisplayName(''); setFullName(''); setPassword(''); setConfirmPassword('');
    } catch (ex) {
      setError(t('login.errors.genericError', { message: ex.message }));
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
          <p className="logo-subtitle">{t('login.logoSubtitle')}</p>
        </div>
      </div>

      {/* Top-right controls */}
      <div className="login-controls">
        <button className="login-theme-btn" onClick={toggleTheme} title={theme === 'dark' ? t('login.themeLightTitle') : t('login.themeDarkTitle')}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span>{theme === 'dark' ? t('login.themeLight') : t('login.themeDark')}</span>
        </button>
        <button className="login-theme-btn" onClick={toggleLanguage} title={t('login.changeLanguage')}>
          <Globe size={18} />
          <span>{i18n.language === 'en' ? 'Polski' : 'English'}</span>
        </button>
      </div>

      {/* Centered auth card */}
      <div className="login-center">
        <div className="login-card">
          <h2 className="login-card-title">
            {t('login.card.welcome')}<span style={{ color: 'var(--color6)' }}>BoardGames</span>
          </h2>
          <p className="login-card-subtitle">
            {mode === 'login' ? t('login.card.subtitleLogin') : t('login.card.subtitleRegister')}
          </p>

          <div className="login-tabs">
            <button
              className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode('login')}
            >{t('login.card.tabLogin')}</button>
            <button
              className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => switchMode('register')}
            >{t('login.card.tabRegister')}</button>
          </div>

          {mode === 'register' && (
            <>
              <div className="field-group">
                <label className="form-label">{t('login.card.labelDisplayName')}</label>
                <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder={t('login.card.placeholderDisplayName')} />
              </div>
              <div className="field-group">
                <label className="form-label">{t('login.card.labelFullName')}</label>
                <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder={t('login.card.placeholderFullName')} />
              </div>
            </>
          )}

          <div className="field-group">
            <label className="form-label">{t('login.card.labelEmail')}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
          </div>

          <div className="field-group">
            <label className="form-label">{t('login.card.labelPassword')}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          {mode === 'register' && (
            <div className="field-group">
              <label className="form-label">{t('login.card.labelConfirmPassword')}</label>
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
                ? t('login.card.loadingLogin')
                : <><LogIn size={15} style={{ marginRight: 8, verticalAlign: 'middle' }} />{t('login.card.btnLogin')}</>
              }
            </button>
          ) : (
            <button
              className="btn-primary login-submit"
              onClick={handleRegister}
              disabled={loading || !email || !displayName}
            >
              {loading
                ? t('login.card.loadingRegister')
                : <><UserPlus size={15} style={{ marginRight: 8, verticalAlign: 'middle' }} />{t('login.card.btnRegister')}</>
              }
            </button>
          )}

          <p style={{ textAlign: 'center', marginTop: '14px', color: 'var(--text1)', fontSize: '12.5px' }}>
            {t('login.card.demo')} <strong style={{ color: 'var(--color6)' }}>demo@example.com</strong> / <strong style={{ color: 'var(--color6)' }}>demo123</strong>
          </p>
          {mode === 'register' && (
            <p style={{ textAlign: 'center', marginTop: '6px', color: 'var(--text2)', fontSize: '11.5px' }}>
              {t('login.card.registerHint')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
