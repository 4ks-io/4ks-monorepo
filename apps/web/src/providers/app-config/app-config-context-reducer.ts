import { AppConfig } from './app-config-context-types';

interface IAction {
  type: AppConfigContextAction;
  payload?: any;
}

export enum AppConfigContextAction {
  SET_CONFIG = 'setConfig',
}

export function appConfigContextReducer(
  state: AppConfig,
  action: IAction
): AppConfig {
  switch (action.type) {
    case AppConfigContextAction.SET_CONFIG:
      return action.payload as AppConfig;
    //
    default:
      throw new Error();
  }
}
