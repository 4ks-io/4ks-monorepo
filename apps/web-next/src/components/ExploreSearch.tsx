'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';

import { InstantSearch, SearchBox, Hits, useHits } from 'react-instantsearch';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import RecipeCard from '@/components/RecipeCard';

function NewRecipeButton() {
  const router = useRouter();

  return (
    <Fab
      color="primary"
      aria-label="add"
      sx={{
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        position: 'fixed',
      }}
      onClick={() => {
        router.push('/recipe/0');
      }}
    >
      <AddIcon />
    </Fab>
  );
}

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
    future: {
      // https://www.algolia.com/doc/api-reference/widgets/instantsearch/js/#widget-param-future
      preserveSharedStateOnUnmount: true,
    },
  };
}

export function ExploreSearchResults() {
  const { hits } = useHits();
  return (
    <Container style={{ marginTop: 20 }}>
      <Grid container spacing={1}>
        {hits.map((h) => (
          <Grid xs={12} md={6} lg={4} key={h.objectID}>
            <RecipeCard
              key={h.objectID}
              id={`${h['id']}`}
              title={`${h['name']}`}
              chef={`${h['author']}`}
              imageUrl={`${h['imageURL']}`}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default function ExploreSearch({
  host,
  path,
  apikey,
}: ExploreSearchProps) {
  // console.log('ExploreSearch', { host, path, apikey });

  const tcfg = makeTypesenseServerConfig({ host, path, apikey });
  const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter(tcfg);
  const searchClient = typesenseInstantsearchAdapter.searchClient;

  return (
    <InstantSearch indexName="recipes" searchClient={searchClient}>
      <SearchBox />
      {/* <Hits /> */}
      <ExploreSearchResults />
    </InstantSearch>
  );
}
