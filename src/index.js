import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n.js'
import {
  initGA,
  trackPageView,
  initContentsquare,
} from "./analytics";

import "./firebase";

initGA();
initContentsquare();
trackPageView();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
