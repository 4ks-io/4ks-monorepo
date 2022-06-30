import React, { useEffect, useContext, useState } from 'react';
import { useAuth0, User } from '@auth0/auth0-react';
import { ApiClient } from '@4ks/api-fetch';
import ApiServiceFactory from '../services';

export interface ISessionContext {
  user: User;
  api: ApiClient;
}

export interface ISessionContextU {
  user: User | undefined | null;
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
        dispatch({
          user,
          api: ApiServiceFactory(t),
        });
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
