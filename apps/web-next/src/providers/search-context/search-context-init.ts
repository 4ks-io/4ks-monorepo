import { SearchContextState } from './search-context-types';

/* eslint-disable  @typescript-eslint/no-empty-function */
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
