import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dice5, Home, ArrowLeft } from 'lucide-react';
import './NotFound.css';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="nf-container">
            <div className="nf-content">
                <div className="nf-icon-wrapper">
                    <Dice5 size={80} className="nf-animation-dice" />
                    <div className="nf-shadow"></div>
                </div>

                <h1 className="nf-title">{t('notFound.title')}</h1>
                <h2 className="nf-subtitle">{t('notFound.subtitle')}</h2>
                <p className="nf-description">{t('notFound.description')}</p>

                <div className="nf-actions">
                    <button className="btn-nf btn-nf-secondary" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} />
                        <span>{t('notFound.btnBack')}</span>
                    </button>

                    <button className="btn-nf btn-nf-primary" onClick={() => navigate('/')}>
                        <Home size={18} />
                        <span>{t('notFound.btnHome')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}