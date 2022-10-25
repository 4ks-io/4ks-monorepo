import {
  ApiClient,
  models_User,
  dtos_UpdateUser,
  dtos_CreateUser,
} from '@4ks/api-fetch';

export interface ISessionContext {
  actions: {
    createUser: ((data: dtos_CreateUser) => void) | undefined;
    updateUser: ((id: string, data: dtos_UpdateUser) => void) | undefined;
  };
  user: models_User | undefined;
  api: ApiClient | undefined;
}

export const initialState: ISessionContext = {
  actions: {
    createUser: undefined,
    updateUser: undefined,
  },
  user: undefined,
  api: undefined,
};
