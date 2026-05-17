import React from 'react';
import { useTranslation } from 'react-i18next';

const PLFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10" width="18" height="12" style={{ borderRadius: '2px', display: 'block' }}>
        <rect width="16" height="5" fill="#fff" />
        <rect width="16" height="5" y="5" fill="#dc143c" />
    </svg>
);

const GBFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30" width="18" height="12" style={{ borderRadius: '2px', display: 'block' }}>
        <path d="M0 0v30h50V0z" fill="#012169" />
        <path d="M0 0l50 30M50 0L0 30" stroke="#fff" strokeWidth="6" />
        <path d="M0 0l50 30M50 0L0 30" stroke="#c8102e" strokeWidth="4" />
        <path d="M25 0v30M0 15h50" stroke="#fff" strokeWidth="10" />
        <path d="M25 0v30M0 15h50" stroke="#c8102e" strokeWidth="6" />
    </svg>
);

export default function LanguageToggle() {
    const { i18n } = useTranslation();
    const isPolish = i18n.language === 'pl';

    return (
        <button
            className="top-bar-btn"
            onClick={() => i18n.changeLanguage(isPolish ? 'en' : 'pl')}
        >
            {isPolish ? <GBFlag /> : <PLFlag />}
        </button>
    );
}