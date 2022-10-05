import React, { useEffect, useContext, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ApiClient } from '@4ks/api-fetch';
import ApiServiceFactory from '../services';
import { models_User } from '@4ks/api-fetch';

export interface ISessionContext {
  user: models_User;
  api: ApiClient;
}

export interface ISessionContextU {
  user: models_User | undefined | null;
  api: ApiClient | undefined | null;
}

const initialState = {
  user: undefined,
  api: undefined,
};

const SessionContext = React.createContext<ISessionContext | ISessionContextU>(
  initialState
);

type SessionContextProviderProps = { children: React.ReactNode };

export function SessionContextProvider({
  children,
}: SessionContextProviderProps) {
  const { user, getAccessTokenSilently } = useAuth0();
  const [state, dispatch] = useState<ISessionContext | ISessionContextU>(
    initialState
  );

  useEffect(() => {
    if (user) {
      getAccessTokenSilently().then(async (t) => {
        let a = ApiServiceFactory(t);
        let u: models_User;

        try {
          u = await a.users.getUsersProfile();
          dispatch({
            user: u,
            api: a,
          });
        } catch {
          try {
            u = await a.users.postUsers({
              displayName: `${user.name}`,
              username: `${user.name}`,
            });
            dispatch({
              user: u,
              api: a,
            });
          } catch {
            console.log(`failed to create user`);
          }
        }
      });
    } else {
      dispatch({
        user: undefined,
        api: ApiServiceFactory(undefined),
      });
    }
  }, [user]);

  return (
    <SessionContext.Provider value={state}>{children}</SessionContext.Provider>
  );
}

export function useSessionContext() {
  return useContext(SessionContext);
}
