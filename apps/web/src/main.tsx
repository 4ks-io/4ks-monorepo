import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AppConfigContextProvider, SearchContextProvider } from './providers';

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
