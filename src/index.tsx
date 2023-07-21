import React from 'react';
import ReactDOM from 'react-dom/client';
import "./i18n/configs"; //i18

import './index.css';
import Root from './components/Root';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
