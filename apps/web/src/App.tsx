import React, { useEffect } from 'react';
import { SessionContextProvider } from './providers/session-context';
import Router from './Router';
import { Auth0Provider } from '@auth0/auth0-react';
import { useLocation } from 'react-router-dom';
import { Stack } from '@fluentui/react/lib/Stack';
import AppBar from './pages/Layout/AppBar';
import { BrowserRouter } from 'react-router-dom';
import { useAppConfigContext } from './providers';

function AppLayout() {
  const location = useLocation();

  useEffect(() => {
    if (!['/me', '/new', '/login', '/logout'].includes(location.pathname)) {
      localStorage.setItem('locationPathname', location.pathname);
    }
  }, [location.pathname]);

  return (
    <Stack verticalAlign="space-between">
      <AppBar />
      <Router />
    </Stack>
  );
}

function App() {
  const atx = useAppConfigContext();
  return (
    <Auth0Provider
      audience={atx.AUTH0_AUDIENCE}
      domain={atx.AUTH0_DOMAIN}
      clientId={atx.AUTH0_CLIENT_ID}
      redirectUri={window.location.origin + `/login`}
      cacheLocation={'localstorage'}
    >
      <SessionContextProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </SessionContextProvider>
    </Auth0Provider>
  );
}

export default App;
