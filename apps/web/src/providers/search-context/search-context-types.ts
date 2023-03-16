export type SearchContextState = {
  client: any;
  results: any;
  setResults: (r: any) => void;
  clearResults: () => void;
  showModal: boolean;
  closeSearch: () => void;
};
