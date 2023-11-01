'use client';
import React, { useEffect, useState } from 'react';
import { models_User } from '@4ks/api-fetch';
import { usePathname } from 'next/navigation';
import { default as MuiAppBar } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import ExploreIcon from '@mui/icons-material/Explore';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Chip from '@mui/material/Chip';

import AppBarAvatarUnauthenticated from './AppBarAvatarUnauthenticated';
import AppBarAvatarAuthenticated from './AppBarAvatarAuthenticated';

interface AppBarProps {
  user: models_User | undefined;
}

export default function AppBar({ user }: AppBarProps) {
  const pathname = usePathname();
  const isAuthenticated = !!user;
  const noExplorePaths = ['/explore'];

  function hideExplore(pathname: string) {
    return noExplorePaths.includes(pathname);
  }
  const [showSearchInput, setShowSearchInput] = useState(true);
  const [showExploreLink, setShowExploreLink] = useState(true);

  useEffect(() => {
    if (hideExplore(pathname)) {
      setShowExploreLink(false);
      setShowSearchInput(true);
      return;
    }
    // else
    setShowExploreLink(true);
    setShowSearchInput(true);
  }, [pathname]);

  return (
    <MuiAppBar position="static" sx={{ zIndex: 2000 }}>
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

        <TextField
          id="searchBox"
          // value={search.value || ''}
          size="small"
          placeholder="Search..."
          // onClick={handleOpenSearch}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Chip label="Ctrl+K" />
              </InputAdornment>
            ),
          }}
        />
        {showExploreLink && (
          <Tooltip title="Explore">
            <a href="/explore">
              <IconButton aria-label="explore" size="large">
                <ExploreIcon fontSize="inherit" />
              </IconButton>
            </a>
          </Tooltip>
        )}
        {isAuthenticated ? (
          <AppBarAvatarAuthenticated username={`${user.username}`} />
        ) : (
          <AppBarAvatarUnauthenticated />
        )}
      </Toolbar>
    </MuiAppBar>
  );
}
