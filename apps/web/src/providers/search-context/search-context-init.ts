import { SearchContextState } from './search-context-types';

export const initialState: SearchContextState = {
  client: undefined,
  results: [],
  setResults: () => {},
  clearResults: () => {},
  showModal: false,
  closeSearch: () => {},
};
