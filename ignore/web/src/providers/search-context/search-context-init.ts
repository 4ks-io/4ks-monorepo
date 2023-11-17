import { SearchContextState } from './search-context-types';

export const initialState: SearchContextState = {
  client: undefined,
  open: false,
  handleOpen: () => {},
  handleClose: () => {},
  results: [],
  setResults: () => {},
  clearResults: () => {},
  value: '',
  setValue: () => {},
};
