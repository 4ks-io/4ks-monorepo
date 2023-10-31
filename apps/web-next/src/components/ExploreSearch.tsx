'use client';
import * as React from 'react';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

type ExploreSearchProps = {
  host: string;
  path: string;
  apikey: string;
};

function makeTypesenseServerConfig({ host, path, apikey }: ExploreSearchProps) {
  return {
    server: {
      apiKey: apikey,
      nodes: [
        {
          host: host,
          port: 443,
          path: path,
          protocol: 'https',
        },
      ],
      // Defaults to 2 minutes. Set to 0 to disable caching.
      cacheSearchResultsForSeconds: 2 * 60,
    },
    additionalSearchParameters: {
      query_by: 'name,author,ingredients',
      per_page: 21,
    },
  };
}

export default function ExploreSearch({
  host,
  path,
  apikey,
}: ExploreSearchProps) {
  console.log('ExploreSearch', { host, path, apikey });

  const tcfg = makeTypesenseServerConfig({ host, path, apikey });
  const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter(tcfg);
  const searchClient = typesenseInstantsearchAdapter.searchClient;

  return (
    <InstantSearch indexName="recipes" searchClient={searchClient}>
      <SearchBox />
      <Hits />
    </InstantSearch>
  );
}
