import React, { useEffect } from 'react';
import { SessionContextProvider } from './providers';
import Router from './Router';
import { Auth0Provider } from '@auth0/auth0-react';
import { useLocation } from 'react-router-dom';
import { Stack } from '@fluentui/react/lib/Stack';
import AppBar from './pages/Layout/AppBar';
import { BrowserRouter } from 'react-router-dom';
import { useAppConfigContext, useSearchContext } from './providers';
import { InstantSearch } from 'react-instantsearch-hooks-web';
import { Spinner } from '@fluentui/react';

function AppLayout() {
  const location = useLocation();

  // disable a few paths from saving to localstorage for post-auth routing
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
  const search = useSearchContext();

  return (
    <Auth0Provider
      audience={atx.AUTH0_AUDIENCE}
      domain={atx.AUTH0_DOMAIN}
      clientId={atx.AUTH0_CLIENT_ID}
      redirectUri={window.location.origin + `/login`}
      cacheLocation={'localstorage'}
    >
      <BrowserRouter>
        <SessionContextProvider>
          {search?.client ? (
            <InstantSearch indexName="recipes" searchClient={search.client}>
              <AppLayout />
            </InstantSearch>
          ) : (
            <Spinner />
          )}
        </SessionContextProvider>
      </BrowserRouter>
    </Auth0Provider>
  );
}

export default App;
