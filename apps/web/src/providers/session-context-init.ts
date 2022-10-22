import { models_User } from '@4ks/api-fetch';
import { ApiClient } from '@4ks/api-fetch';

export interface createUserProps {
  username: string;
  displayName: string;
}

export interface ISessionContext {
  actions: {
    createUser: ((props: createUserProps) => void) | undefined;
  };
  user: models_User | undefined;
  api: ApiClient | undefined;
}

// export interface ISessionContextU {
//   actions: {
//     createUser: undefined;
//   };
//   user: models_User | undefined | null;
//   api: ApiClient | undefined | null;
// }

export const initialState: ISessionContext = {
  actions: {
    createUser: undefined,
  },
  user: undefined,
  api: undefined,
};
