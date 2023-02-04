import { ISessionContext } from './session-context-init';
import { ApiClient, models_User } from '@4ks/api-fetch';

interface IAction {
  type: SessionContextAction;
  payload?: any;
}

export enum SessionContextAction {
  SET_ACTIONS = 'setActions',
  SET_API = 'setApi',
  SET_USER = 'getUser',
}

export function sessionContextReducer(state: ISessionContext, action: IAction) {
  switch (action.type) {
    //
    case SessionContextAction.SET_ACTIONS:
      // console.log('SET_ACTIONS');
      return { ...state, actions: action.payload };
    //
    case SessionContextAction.SET_API:
      // console.log('SET_API');
      return { ...state, api: action.payload as ApiClient };
    //
    case SessionContextAction.SET_USER:
      // console.log('SET_USER');
      return { ...state, user: action.payload as models_User };

    //
    default:
      throw new Error();
  }
}
