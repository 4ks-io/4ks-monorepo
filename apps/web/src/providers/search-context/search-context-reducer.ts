import { SearchContextState } from './search-context-types';

interface IAction {
  type: SearchContextAction;
  payload?: any;
}

export enum SearchContextAction {
  INIT = 'init',
  SET_RESULTS = 'setResults',
  SHOW_MODAL = 'showModal',
  HIDE_MODAL = 'hideModal',
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
    case SearchContextAction.SHOW_MODAL:
      return { ...state, showModal: true };
    //
    case SearchContextAction.HIDE_MODAL:
      return { ...state, showModal: false };
    //
    default:
      throw new Error();
  }
}
