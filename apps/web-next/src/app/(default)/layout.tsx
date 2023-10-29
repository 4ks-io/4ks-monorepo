import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import { getSession } from '@auth0/nextjs-auth0';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { serverClient } from '@/trpc/serverClient';

export default async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const pathname = headersList.get('x-invoke-path') || '';

  // is authenticated
  const session = await getSession();

  if (session) {
    // check user exists
    const data = await serverClient.users.exists();
    console.log('data', data);
    console.log('pathname', pathname);

    if (data.Status == 204) {
      if (pathname != '/register') {
        // redirect('/register');
        console.log('redir to register');
      }
    } else if (pathname == '/register') {
      // redirect('/');
      console.log('redir away from register');
    }
  }

  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AppBar position="static" sx={{ zIndex: 2000 }}>
            <Toolbar sx={{ backgroundColor: 'background.paper' }}>
              <Box
                component="img"
                sx={{
                  height: 36,
                  paddingRight: 1,
                }}
                alt="4ks.io"
                src={'/logo.svg'}
              />
              {session?.user && <a href="/api/auth/logout">Logout</a>}
              {!session?.user && <a href="/app/auth/login">Login</a>}
            </Toolbar>
          </AppBar>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: 'background.default',
              mt: ['12px', '18px', '24px'],
              p: 3,
            }}
          >
            {children}
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
