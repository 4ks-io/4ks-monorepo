import React from 'react';
import { Stack, Image, ImageFit, TextField } from '@fluentui/react';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-hooks-web';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import Logo from '../../logo.svg';

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: 'local-4ks-api-key', // Be sure to use an API key that only allows search operations
    nodes: [
      {
        host: 'local.4ks.io',
        port: 443,
        path: '/search', // Optional. Example: If you have your typesense mounted in localhost:8108/typesense, path should be equal to '/typesense'
        protocol: 'https',
      },
    ],
    // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
    cacheSearchResultsForSeconds: 2 * 60,
  },
  additionalSearchParameters: {
    query_by: 'name,author,ingredients,instructions',
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

// https://www.algolia.com/doc/guides/building-search-ui/widgets/create-your-own-widgets/react-hooks/
const Landing = () => {
  return (
    <div
      style={{
        height: '80vh',
        width: '100%',
        display: 'flex',
        alignContent: 'center',
      }}
    >
      <Stack
        verticalAlign="center"
        horizontalAlign="center"
        style={{ width: '100%', rowGap: 10 }}
      >
        <Image src={Logo} width={100} imageFit={ImageFit.contain}></Image>
        <InstantSearch indexName="recipes" searchClient={searchClient}>
          <SearchBox placeholder="Search . . ." />
          {/* <TextField
          placeholder="Search . . ."
          styles={{
            fieldGroup: {
              height: '40px',
              borderColor: 'lightgray',
            },
            field: {
              fontSize: 16,
              height: '40px',
            },
          }}
        /> */}
          <Hits />
        </InstantSearch>
        {/* <TextField
          placeholder="Search . . ."
          styles={{
            fieldGroup: {
              height: '40px',
              borderColor: 'lightgray',
            },
            field: {
              fontSize: 16,
              height: '40px',
            },
          }}
        /> */}
      </Stack>
    </div>
  );
};

export default Landing;
