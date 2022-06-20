import React from 'react';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

function AppAuth() {
  return (
    <Auth0Provider
      audience={import.meta.env.VITE_AUTH0_AUDIENCE as string}
      domain={import.meta.env.VITE_AUTH0_DOMAIN as string}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID as string}
      redirectUri={window.location.origin}
      cacheLocation={'localstorage'}
    >
      <App />
    </Auth0Provider>
  );
}

export default AppAuth;
