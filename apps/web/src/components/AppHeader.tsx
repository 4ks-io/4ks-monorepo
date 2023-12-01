'use client';
import React, { useEffect, useState } from 'react';
import { models_User } from '@4ks/api-fetch';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ExploreIcon from '@mui/icons-material/Explore';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import LinearProgress from '@mui/material/LinearProgress';
import { useRecipeContext } from '@/providers/recipe-context';
import { useSearchContext } from '@/providers/search-context';
import AppHeaderAvatarUnauthenticated from './AppHeaderAvatarUnauthenticated';
import AppHeaderAvatarAuthenticated from './AppHeaderAvatarAuthenticated';
import SearchDialog from '@/components/SearchDialog/SearchDialog';
import { InstantSearch } from 'react-instantsearch';
import { InstantSearchNext } from 'react-instantsearch-nextjs';
import SearchBox from '@/components/SearchBox';
import Badge from '@mui/material/Badge';

interface AppHeaderProps {
  user: models_User | undefined;
}

export default function AppHeader({ user }: AppHeaderProps) {
  const search = useSearchContext();
  const pathname = usePathname();
  const isAuthenticated = !!user;
  const rtx = useRecipeContext();

  function hideExplore(pathname: string) {
    return ['/explore'].includes(pathname);
  }

  const hasNewEvent = user?.events?.some((e) => e?.status == 2);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {rtx.actionInProgress && <LinearProgress />}
      <Toolbar variant="dense" sx={{ backgroundColor: 'background.paper' }}>
        <Link prefetch={false} href="/">
          <Box
            component="img"
            sx={{
              height: 28,
              paddingRight: 1,
            }}
            alt="4ks.io"
            src={'/logo.svg'}
          />
        </Link>
        <Box sx={{ flexGrow: 1 }} />

        {/* search */}
        {!search?.client ? (
          <TextField disabled id="searchBox" size="small" sx={{ width: 300 }} />
        ) : (
          <InstantSearch
            indexName="recipes"
            searchClient={search.client}
            future={{
              preserveSharedStateOnUnmount: true,
            }}
          >
            <SearchDialog />
            <SearchBox
              value={search.value || ''}
              onClick={() => search.handleOpen()}
              onClear={() => search.clear()}
            />
          </InstantSearch>
        )}

        {showExploreLink && (
          <Tooltip title="Explore">
            <Link prefetch={false} href="/explore">
              <IconButton aria-label="explore">
                <ExploreIcon fontSize="inherit" />
              </IconButton>
            </Link>
          </Tooltip>
        )}

        {hasNewEvent && (
          <Tooltip title="New Event!">
            <Link prefetch={false} href={'/' + user?.username}>
              <IconButton aria-label="notifications">
                <NotificationsActiveIcon fontSize="inherit" color="secondary" />
              </IconButton>
            </Link>
          </Tooltip>
        )}

        {isAuthenticated ? (
          <AppHeaderAvatarAuthenticated username={`${user.username}`} />
        ) : (
          <AppHeaderAvatarUnauthenticated />
        )}
      </Toolbar>
    </>
  );
}
