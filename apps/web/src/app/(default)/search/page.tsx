import * as React from 'react';
import { serverClient } from '@/trpc/serverClient';
import SearchResults from '@/components/SearchResults';
import Box from '@mui/material/Box';
import { redirect } from 'next/navigation';

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  if (!searchParams || !searchParams['q'] || searchParams['q'] === '') {
    redirect('/explore');
  }

  // fetch
  const data = await serverClient.search.recipes(searchParams['q'] as string);
  if (!data) {
    return (
      <div>
        <div>no results</div>
      </div>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        mt: ['12px', '18px', '24px'],
        p: 3,
      }}
    >
      <SearchResults results={data} />
    </Box>
  );
}
