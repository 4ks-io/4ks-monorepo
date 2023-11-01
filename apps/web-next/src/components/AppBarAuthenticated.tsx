import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { serverClient } from '@/trpc/serverClient';
import AppBarAvatarAuthenticated from '@/components/AppBarAvatarAuthenticated';

export default async function AppBarAuthenticated() {
  const data = await serverClient.users.getAuthenticated();

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
        <Box sx={{ flexGrow: 1 }} />
        <AppBarAvatarAuthenticated username={`${data.username}`} />
      </Toolbar>
    </AppBar>
  );
}
