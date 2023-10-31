'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

export default function AppBarAvatarAuthenticated() {
  return (
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
        <a href="/app/auth/logout">Logout</a>
      </Toolbar>
    </AppBar>
  );
}
