import { ISessionContext } from './session-context-init';

interface IAction {
  type: SesionContextAction;
  payload?: any;
}

export enum SesionContextAction {
  SET_ACTIONS = 'setActions',
  SET_API = 'setApi',
  SET_USER = 'setUser',
}

export function sessionContextReducer(state: ISessionContext, action: IAction) {
  switch (action.type) {
    //
    case SesionContextAction.SET_ACTIONS:
      console.log('SET_ACTIONS');
      return { ...state, actions: action.payload };
    //
    case SesionContextAction.SET_API:
      console.log('SET_API');
      return { ...state, api: action.payload };
    //
    case SesionContextAction.SET_USER:
      console.log('SET_USER');
      return { ...state, user: action.payload };

    //
    default:
      throw new Error();
  }
}
