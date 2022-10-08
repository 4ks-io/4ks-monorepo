import React from 'react';
import { PageContextProvider } from './usePageContext';
import type { PageContext } from './types';
import { Auth0Provider } from '@auth0/auth0-react';
import { SessionContextProvider } from '../providers/session-context';
import { AppBar } from '../components/Layout';
import { Stack } from '@fluentui/react/lib/Stack';
// import { initializeIcons } from '@fluentui/react/lib/Icons';

// initializeIcons();

export { PageShell };

function PageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Auth0Provider
          audience={import.meta.env.VITE_AUTH0_AUDIENCE as string}
          domain={import.meta.env.VITE_AUTH0_DOMAIN as string}
          clientId={import.meta.env.VITE_AUTH0_CLIENT_ID as string}
          redirectUri={import.meta.env.VITE_BASE_URL + '/authback'}
          cacheLocation={'localstorage'}
        >
          <SessionContextProvider>
            <Stack verticalAlign="space-between">
              <AppBar />
              {children}
            </Stack>
          </SessionContextProvider>
        </Auth0Provider>
      </PageContextProvider>
    </React.StrictMode>
  );
}
