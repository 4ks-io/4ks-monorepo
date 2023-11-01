'use client';

import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { useSearchContext } from '@/providers/search-context';
// import CircularProgress from '@mui/material/CircularProgress';
import { Skeleton } from '@mui/material';
import SearchDialog from '@/components/SearchDialog/SearchDialog';
import { InstantSearch } from 'react-instantsearch';

export default function LandingPageSearchBox() {
  const search = useSearchContext();
  if (!search || !search.client) {
    // return <CircularProgress />;
    return <Skeleton variant="rectangular" width={300} height={56} />;
  }
  function handleOpenSearch() {
    search.handleOpen();
  }

  return (
    <InstantSearch indexName="recipes" searchClient={search.client}>
      <SearchDialog />
      <TextField
        id="searchBox"
        placeholder="Search..."
        onClick={handleOpenSearch}
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
    </InstantSearch>
  );
}
