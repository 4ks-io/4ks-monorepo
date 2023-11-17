export type SearchContextState = {
  client: any;
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  results: any;
  setResults: (r: any) => void;
  clearResults: () => void;
  clear: () => void;
  value: string;
  setValue: (v: string) => void;
};
