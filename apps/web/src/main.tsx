import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { AppConfigContextProvider, SearchContextProvider } from './providers';

initializeIcons();

ReactDOM.render(
  <React.StrictMode>
    <AppConfigContextProvider>
      <SearchContextProvider>
        <App />
      </SearchContextProvider>
    </AppConfigContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
