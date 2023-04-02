import { SearchContextState } from './search-context-types';

interface IAction {
  type: SearchContextAction;
  payload?: any;
}

export enum SearchContextAction {
  INIT = 'init',
  SET_RESULTS = 'setResults',
  OPEN_DIALOG = 'openDialog',
  CLOSE_DIALOG = 'closeDialog',
}

export function searchContextReducer(
  state: SearchContextState,
  action: IAction
): SearchContextState {
  switch (action.type) {
    case SearchContextAction.INIT:
      return { ...state, ...action.payload };
    //
    case SearchContextAction.OPEN_DIALOG:
      return { ...state, open: true };
    //
    case SearchContextAction.CLOSE_DIALOG:
      return { ...state, open: false };
    //
    case SearchContextAction.SET_RESULTS:
      return { ...state, results: action.payload };
    //
    default:
      throw new Error();
  }
}
