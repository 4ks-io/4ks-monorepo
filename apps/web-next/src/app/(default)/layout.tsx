import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { getSession } from '@auth0/nextjs-auth0';

export default async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <>
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
          {session?.user && <a href="/app/auth/logout">Logout</a>}
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
    </>
  );
}
