import { SearchContextState } from './search-context-types';

interface IAction {
  type: SearchContextAction;
  payload?: any;
}

export enum SearchContextAction {
  INIT = 'init',
  SET_RESULTS = 'setResults',
}

export function searchContextReducer(
  state: SearchContextState,
  action: IAction
): SearchContextState {
  switch (action.type) {
    case SearchContextAction.INIT:
      return { ...state, ...action.payload };
    //
    case SearchContextAction.SET_RESULTS:
      return { ...state, results: action.payload };
    //
    default:
      throw new Error();
  }
}
