import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { loginAsync, registerAsync } from '../data/db';
import {
  Dice5, Shuffle, Trophy,
  CalendarDays, Users, LogIn, UserPlus,
  Layers2, Sun, Moon
} from 'lucide-react';
import './LoginPage.css';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../components/LanguageToggle';
import i18n from '../i18n';

export default function LoginPage() {
  const { login, theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      const { user, error: err } = await registerAsync(email, password, displayName);
      if (err) { setError(err); return; }
      setSuccess(t('login.messages.accountCreated', { name: user.displayName }));
      switchMode('login');
      setEmail(user.email);
      setDisplayName(''); setPassword(''); setConfirmPassword('');
    } catch (ex) {
      setError(t('login.errors.genericError', { message: ex.message }));
    } finally { setLoading(false); }
  };

  return (
    <div className="login-root">
      <div className="blob blob1" />
      <div className="blob blob2" />
      <div className="blob blob3" />

      <div className='top-right-actions'>
        <LanguageToggle />
        <button
          className="top-bar-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? t('login.themeLight') : t('login.themeDark')}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span>{theme === 'dark' ? t('login.themeLight') : t('login.themeDark')}</span>
        </button>
      </div>


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
                <p className="logo-subtitle">{t('login.logoSubtitle')}</p>
              </div>
            </div>

            <div className="logo-sep" />

            <div className="feature-list">
              <FeatureItem Icon={Layers2} color="var(--color3)" title={t('login.features.catalogTitle')} desc={t('login.features.catalogDesc')} />
              <FeatureItem Icon={Shuffle} color="var(--color4)" title={t('login.features.drawTitle')} desc={t('login.features.drawDesc')} />
              <FeatureItem Icon={Trophy} color="var(--color6)" title={t('login.features.tournamentsTitle')} desc={t('login.features.tournamentsDesc')} />
              <FeatureItem Icon={CalendarDays} color="var(--color8)" title={t('login.features.eventsTitle')} desc={t('login.features.eventsDesc')} />
              <FeatureItem Icon={Users} color="#9B59B6" title={t('login.features.communityTitle')} desc={t('login.features.communityDesc')} />
            </div>
          </div>
        </div>

        {/* RIGHT: Form card */}
        <div className="login-right">
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
              <div className="field-group">
                <label className="form-label">{t('login.card.labelDisplayName')}</label>
                <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder={t('login.card.placeholderDisplayName')} />
              </div>
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