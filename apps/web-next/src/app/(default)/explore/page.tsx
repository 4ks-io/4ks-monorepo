import * as React from 'react';
import ExploreSearch from '@/components/ExploreSearch';
import { ExploreSearchResults } from '@/components/ExploreSearch';
import { serverClient } from '@/trpc/serverClient';

export default async function ExplorePage() {
  const data = await serverClient.recipes.search('');

  // return <ExploreSearch apikey={apikey} host={host} path={path} />;
  return (
    <>
      Explore
      {JSON.stringify(data)}
      {/* <ExploreSearchResults /> */}
    </>
  );
}
