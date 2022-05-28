import React from 'react';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

function AppAuth() {
  console.log(import.meta.env.MODE);
  console.log(import.meta);
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
    >
      <App />
    </Auth0Provider>
  );
}

export default AppAuth;
