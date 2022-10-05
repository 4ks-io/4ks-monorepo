import React from 'react';
import ReactDOM from 'react-dom';
import AppAuth from './AppAuth';

(async () => {
  let appConfig = {
    AUTH0_AUDIENCE: '',
    AUTH0_DOMAIN: '',
    AUTH0_CLIENT_ID: '',
  };

  if (import.meta?.env?.VITE_AUTH0_AUDIENCE) {
    appConfig.AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE as string;
    appConfig.AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN as string;
    appConfig.AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID as string;
  } else {
    appConfig = await (await fetch('/config.json')).json();
  }

  ReactDOM.render(
    <React.StrictMode>
      <AppAuth appConfig={appConfig} />
    </React.StrictMode>,
    document.getElementById('root')
  );
})();
