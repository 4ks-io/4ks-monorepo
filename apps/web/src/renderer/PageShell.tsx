import React from 'react';
import logo from './logo.svg';
import { PageContextProvider } from './usePageContext';
import type { PageContext } from './types';
import './PageShell.css';
import { Link } from './Link';
import { Auth0Provider } from '@auth0/auth0-react';
import { SessionContextProvider } from '../providers/session-context';
import { AppBar } from '../components/Layout';
import { Stack } from '@fluentui/react/lib/Stack';

export { PageShell };

function PageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
  console.log(pageContext.urlPathname);
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        {/* <Layout>
          <Sidebar>
            <Logo />
            <Link className="navitem" href="/">
              Home
            </Link>
            <Link className="navitem" href="/about">
              About
            </Link>
          </Sidebar>
          <Content>{children}</Content>
        </Layout> */}
        <Auth0Provider
          audience={import.meta.env.VITE_AUTH0_AUDIENCE as string}
          domain={import.meta.env.VITE_AUTH0_DOMAIN as string}
          clientId={import.meta.env.VITE_AUTH0_CLIENT_ID as string}
          redirectUri={'https://local.4ks.io/'}
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

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        maxWidth: 900,
        margin: 'auto',
      }}
    >
      {children}
    </div>
  );
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        lineHeight: '1.8em',
      }}
    >
      {children}
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        paddingBottom: 50,
        borderLeft: '2px solid #eee',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  );
}

function Logo() {
  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 10,
      }}
    >
      <a href="/">
        <img src={logo} height={64} width={64} alt="logo" />
      </a>
    </div>
  );
}
