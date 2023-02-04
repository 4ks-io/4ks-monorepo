import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import 'react-loading-skeleton/dist/skeleton.css';
import { AppConfigContextProvider } from './providers';

initializeIcons();

ReactDOM.render(
  <React.StrictMode>
    <AppConfigContextProvider>
      <App />
    </AppConfigContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
