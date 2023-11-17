'use client';
import React from 'react';
import { useSearchContext } from '@/providers/search-context';
import { Skeleton } from '@mui/material';
import SearchDialog from '@/components/SearchDialog/SearchDialog';
import { InstantSearch } from 'react-instantsearch';
import { InstantSearchNext } from 'react-instantsearch-nextjs';
import SearchBox from '@/components/SearchBox';

export default function LandingPageSearchBox() {
  const search = useSearchContext();
  if (!search || !search.client) {
    return <Skeleton variant="rectangular" width={300} height={56} />;
  }

  return (
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
  );
}
