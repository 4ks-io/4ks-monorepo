import React from 'react';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { usePageContext } from '../renderer/usePageContext';
import { Landing, Recipes, Recipe } from './pages';

function AppAuth() {
  const pageContext = usePageContext();

  return (
    <Auth0Provider
      audience={import.meta.env.VITE_AUTH0_AUDIENCE as string}
      domain={import.meta.env.VITE_AUTH0_DOMAIN as string}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID as string}
      redirectUri={pageContext.urlPathname}
      cacheLocation={'localstorage'}
    >
      {/* <App /> */}
      <Landing />
    </Auth0Provider>
  );
}

export default AppAuth;
