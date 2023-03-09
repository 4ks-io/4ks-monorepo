import React from 'react';
import { SessionContextProvider } from './providers';
import Router from './Router';
import { Auth0Provider } from '@auth0/auth0-react';
import { Stack } from '@fluentui/react/lib/Stack';
import AppBar from './pages/Layout/AppBar';
import PrimarySearchAppBar from './pages/Layout/PrimarySearchAppBar';
import { BrowserRouter } from 'react-router-dom';
import { useAppConfigContext, useSearchContext } from './providers';
import { InstantSearch } from 'react-instantsearch-hooks-web';
import { Spinner } from '@fluentui/react';
import { Helmet } from 'react-helmet';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './mui';

function App() {
  const atx = useAppConfigContext();
  const search = useSearchContext();

  if (!search?.client) {
    return <Spinner />;
  }

  return (
    <Auth0Provider
      audience={atx.AUTH0_AUDIENCE}
      domain={atx.AUTH0_DOMAIN}
      clientId={atx.AUTH0_CLIENT_ID}
      redirectUri={window.location.origin + `/login`}
      cacheLocation={'localstorage'}
    >
      <BrowserRouter>
        <Helmet>
          <meta charSet="utf-8" />
          <title>4ks</title>
          <link rel="canonical" href="https://www.4ks.io" />
        </Helmet>
        <SessionContextProvider>
          <InstantSearch indexName="recipes" searchClient={search.client}>
            <ThemeProvider theme={theme}>
              <PrimarySearchAppBar />
              {/* <Stack verticalAlign="space-between"> */}
              {/* <AppBar /> */}

              <Router />
              {/* </Stack> */}
            </ThemeProvider>
          </InstantSearch>
        </SessionContextProvider>
      </BrowserRouter>
    </Auth0Provider>
  );
}

export default App;
