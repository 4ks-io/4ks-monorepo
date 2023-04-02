import React, { useEffect, useContext, useReducer } from 'react';
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

  useEffect(() => {
    window.addEventListener('keydown', keyDownHandler);
  }, []);

  function keyDownHandler(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'k' && !state.open) {
      handleOpen();
      event.preventDefault();
      // console.log('Control and K!');
    }
  }

  function setResults(results: []) {
    dispatch({
      type: SearchContextAction.SET_RESULTS,
      payload: results,
    });
  }

  function clearResults() {
    setResults([]);
  }

  function handleOpen() {
    dispatch({
      type: SearchContextAction.OPEN_DIALOG,
      payload: null,
    });
  }

  function handleClose() {
    dispatch({
      type: SearchContextAction.CLOSE_DIALOG,
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
        per_page: 21,
      },
    });

    dispatch({
      type: SearchContextAction.INIT,
      payload: {
        client: typesenseInstantsearchAdapter.searchClient,
        open: false,
        handleClose,
        handleOpen,
        setResults,
        clearResults,
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
