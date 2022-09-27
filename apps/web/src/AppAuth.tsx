import React from 'react';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

type AppConfig = {
  AUTH0_AUDIENCE: string
  AUTH0_DOMAIN: string
  AUTH0_CLIENT_ID: string
}

function AppAuth({ appConfig }: {appConfig: AppConfig}) {
  return (
    <Auth0Provider
      audience={appConfig.AUTH0_AUDIENCE}
      domain={appConfig.AUTH0_DOMAIN}
      clientId={appConfig.AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
      cacheLocation={'localstorage'}
    >
      <App />
    </Auth0Provider>
  );
}

export default AppAuth;
