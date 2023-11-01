'use client';
import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { usePathname } from 'next/navigation';
import Tooltip from '@mui/material/Tooltip';
import ExploreIcon from '@mui/icons-material/Explore';
import IconButton from '@mui/material/IconButton';
import AppBarAvatarUnauthenticated from './AppBarAvatarUnauthenticated';

export default function AppBarUnauthenticated() {
  const pathname = usePathname();

  const [showSearchInput, setShowSearchInput] = useState(true);
  const [showExploreLink, setShowExploreLink] = useState(true);

  useEffect(() => {
    if (['/explore'].includes(pathname)) {
      setShowExploreLink(false);
      setShowSearchInput(true);
      return;
    }
    // else
    setShowExploreLink(true);
    setShowSearchInput(true);
  }, [pathname]);

  return (
    <AppBar position="static" sx={{ zIndex: 2000 }}>
      <Toolbar sx={{ backgroundColor: 'background.paper' }}>
        <a href="/">
          <Box
            component="img"
            sx={{
              height: 36,
              paddingRight: 1,
            }}
            alt="4ks.io"
            src={'/logo.svg'}
          />
        </a>
        <Box sx={{ flexGrow: 1 }} />
        {showExploreLink && (
          <Tooltip title="Explore">
            <a href="/explore">
              <IconButton aria-label="explore" size="large">
                <ExploreIcon fontSize="inherit" />
              </IconButton>
            </a>
          </Tooltip>
        )}
        <AppBarAvatarUnauthenticated />
      </Toolbar>
    </AppBar>
  );
}
