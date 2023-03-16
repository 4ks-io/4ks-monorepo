import React, { useEffect, useContext, useReducer, useState } from 'react';
import { initialState } from './search-context-init';
import { SearchContextState } from './search-context-types';
import {
  searchContextReducer,
  SearchContextAction,
} from './search-context-reducer';
import { useAppConfigContext } from '..';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

const SearchContext = React.createContext<SearchContextState>(initialState);

type SearchContextProviderProps = { children: React.ReactNode };

export function SearchContextProvider({
  children,
}: SearchContextProviderProps) {
  const atx = useAppConfigContext();
  const [state, dispatch] = useReducer(searchContextReducer, initialState);

  const keyDownHandler = (event: KeyboardEvent) => {
    event.preventDefault();
    if (event.ctrlKey && event.key === 'k') {
      console.log('You just pressed Control and K!');
      dispatch({
        type: SearchContextAction.SHOW_MODAL,
        payload: null,
      });
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', keyDownHandler);
  });

  function setResults(restults: []) {
    dispatch({
      type: SearchContextAction.SET_RESULTS,
      payload: restults,
    });
  }

  function clearResults() {
    setResults([]);
  }

  function closeSearch() {
    dispatch({
      type: SearchContextAction.HIDE_MODAL,
      payload: null,
    });
  }

  useEffect(() => {
    const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
      server: {
        apiKey: atx.TYPESENSE_API_KEY,
        nodes: [
          {
            host: atx.TYPESENSE_URL,
            path: atx.TYPESENSE_PATH,
            port: 443,
            protocol: 'https',
          },
        ],
        // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
        cacheSearchResultsForSeconds: 2 * 60,
      },
      additionalSearchParameters: {
        query_by: 'name,author,ingredients',
      },
    });

    dispatch({
      type: SearchContextAction.INIT,
      payload: {
        client: typesenseInstantsearchAdapter.searchClient,
        setResults,
        clearResults,
        closeSearch,
      },
    });
  }, []);

  return (
    <SearchContext.Provider value={state}>{children}</SearchContext.Provider>
  );
}

export function useSearchContext() {
  return useContext(SearchContext);
}
