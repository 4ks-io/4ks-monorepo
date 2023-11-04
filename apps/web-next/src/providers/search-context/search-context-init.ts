import { SearchContextState } from './search-context-types';

function handleEmpty() {}

export const initialState: SearchContextState = {
  client: undefined,
  open: false,
  handleOpen: handleEmpty,
  handleClose: handleEmpty,
  results: [],
  setResults: handleEmpty,
  clearResults: handleEmpty,
  value: '',
  setValue: handleEmpty,
};
