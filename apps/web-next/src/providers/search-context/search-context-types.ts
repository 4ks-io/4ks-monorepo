export type SearchContextState = {
  client: any;
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  results: any;
  setResults: (r: any) => void;
  clearResults: () => void;
  value: string;
  setValue: (v: string) => void;
};
