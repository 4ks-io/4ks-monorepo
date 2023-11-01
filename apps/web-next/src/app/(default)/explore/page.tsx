import * as React from 'react';
import ExploreSearch from '@/components/ExploreSearch';
import { ExploreSearchResults } from '@/components/ExploreSearch';
import { serverClient } from '@/trpc/serverClient';
import SearchResults from '@/components/SearchResults';

export default async function ExplorePage() {
  const data = await serverClient.recipes.search('');
  if (!data) {
    return (
      <div>
        <div>no results</div>
      </div>
    );
  }

  // return <ExploreSearch apikey={apikey} host={host} path={path} />;
  return (
    <>
      <SearchResults results={data} />;
    </>
  );
}
