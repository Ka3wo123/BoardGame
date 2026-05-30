import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Trophy, CalendarDays, Users, Dice5, Gamepad2, Shuffle,
  Menu, Power, Sun, Moon, Globe,
  CheckCircle2, XCircle, AlertTriangle, Info, X
} from 'lucide-react';
import './Layout.css';

const navItemsData = [
  { path: '/games',        icon: Gamepad2,    labelPl: 'Kolekcja gier',  labelEn: 'Game Library' },
  { path: '/drawing',      icon: Shuffle,     labelPl: 'Losowanie',       labelEn: 'Drawing' },
  { path: '/tournaments',  icon: Trophy,      labelPl: 'Turnieje',        labelEn: 'Tournaments' },
  { path: '/events',       icon: CalendarDays, labelPl: 'Wydarzenia',     labelEn: 'Events' },
  { path: '/community',    icon: Users,        labelPl: 'Społeczność',    labelEn: 'Community' },
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
  const { user, logout, theme, toggleTheme, language, toggleLanguage } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.displayName
    ? user.displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const close = () => setSidebarOpen(false);

  return (
    <div className="app-root">
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
          {navItemsData.map(({ path, icon: Icon, labelPl, labelEn }) => (
            <NavLink
              key={path}
              to={path}
              onClick={close}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} className="nav-icon" />
              <span className="nav-label">{language === 'en' ? labelEn : labelPl}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-theme">
          <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? (language === 'en' ? 'Light mode' : 'Tryb jasny') : (language === 'en' ? 'Dark mode' : 'Tryb ciemny')}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? (language === 'en' ? 'Light mode' : 'Tryb jasny') : (language === 'en' ? 'Dark mode' : 'Tryb ciemny')}</span>
          </button>
          <button className="theme-toggle lang-toggle" onClick={toggleLanguage} title={language === 'pl' ? 'Switch to English' : 'Zmień na Polski'}>
            <Globe size={16} />
            <span>{language === 'pl' ? 'English' : 'Polski'}</span>
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <p className="user-name">{user?.displayName}</p>
            <p className="user-email">{user?.email}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Wyloguj">
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