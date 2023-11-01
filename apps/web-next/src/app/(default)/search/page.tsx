import * as React from 'react';
import { serverClient } from '@/trpc/serverClient';
import SearchResults from '@/components/SearchResults';

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // todo: improve
  if (!searchParams || !searchParams['q'] || searchParams['q'] === '') {
    return (
      <div>
        <div>search cannot be empty</div>
      </div>
    );
  }

  // fetch
  const data = await serverClient.recipes.search(searchParams['q'] as string);
  if (!data) {
    return (
      <div>
        <div>no results</div>
      </div>
    );
  }

  return <SearchResults results={data} />;
}
