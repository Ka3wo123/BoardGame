import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import {
  Trophy, CalendarDays, Users, Dice5, Gamepad2, Shuffle,
  Menu, Power, Sun, Moon, Globe,
  CheckCircle2, XCircle, AlertTriangle, Info, X
} from 'lucide-react';
import BoardGameBackground from './BoardGameBackground';
import './Layout.css';

const navItemsData = [
  { path: '/games',        icon: Gamepad2,    labelKey: 'nav.games' },
  { path: '/drawing',      icon: Shuffle,     labelKey: 'nav.drawing' },
  { path: '/tournaments',  icon: Trophy,      labelKey: 'nav.tournaments' },
  { path: '/events',       icon: CalendarDays, labelKey: 'nav.events' },
  { path: '/community',    icon: Users,        labelKey: 'nav.community' },
];

const TOAST_META = {
  success: { icon: CheckCircle2, color: '#4CAF50' },
  error:   { icon: XCircle,      color: 'var(--color14)' },
  warning: { icon: AlertTriangle, color: 'var(--color6)' },
  info:    { icon: Info,          color: 'var(--purple)' },
};

function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="toast-container">
      {toasts.map(t => {
        const meta = TOAST_META[t.type] || TOAST_META.info;
        const Icon = meta.icon;
        return (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <Icon size={16} color={meta.color} className="toast-icon" />
            <span className="toast-message">{t.message}</span>
            <button className="toast-close" onClick={() => removeToast(t.id)}>
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default function Layout() {
  const { user, logout, theme, toggleTheme, toggleLanguage } = useApp();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.displayName
    ? user.displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const close = () => setSidebarOpen(false);

  return (
    <div className="app-root">
      <BoardGameBackground />

      <button className="hamburger" onClick={() => setSidebarOpen(o => !o)}>
        <Menu size={20} />
      </button>

      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={close} />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Dice5 size={22} color="white" />
          </div>
          <span className="sidebar-logo-text">
            Board<span style={{ color: 'var(--color6)' }}>Games</span>
          </span>
        </div>

        <nav className="sidebar-nav">
          {navItemsData.map(({ path, icon: Icon, labelKey }) => (
            <NavLink
              key={path}
              to={path}
              onClick={close}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} className="nav-icon" />
              <span className="nav-label">{t(labelKey)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-theme">
          <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? t('theme.lightTitle') : t('theme.darkTitle')}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? t('theme.light') : t('theme.dark')}</span>
          </button>
          <button className="theme-toggle lang-toggle" onClick={toggleLanguage} title={i18n.language === 'pl' ? t('lang.switchToEnglish') : t('lang.switchToPolish')}>
            <Globe size={16} />
            <span>{i18n.language === 'pl' ? t('lang.toEnglish') : t('lang.toPolish')}</span>
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <p className="user-name">{user?.displayName}</p>
            <p className="user-email">{user?.email}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout} title={t('user.logout')}>
            <Power size={16} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>

      <ToastContainer />
    </div>
  );
}