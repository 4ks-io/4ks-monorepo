import React, { useEffect, createContext, useContext, useState } from 'react';
import { useAuth0, User } from '@auth0/auth0-react';
import ApiServiceFactory, { API } from '../services';

export interface ISessionContext {
  user: User;
  api: API;
}

type SessionContextProviderProps = { children: React.ReactNode };

const SessionContext = React.createContext<ISessionContext | undefined>(
  undefined
);

export function SessionContextProvider({
  children,
}: SessionContextProviderProps) {
  const { user, getAccessTokenSilently } = useAuth0();
  const [state, dispatch] = useState<ISessionContext | undefined>();

  useEffect(() => {
    if (user) {
      console.log(user);
      getAccessTokenSilently().then(async (t) => {
        dispatch({
          user,
          api: ApiServiceFactory(t),
        });
      });
    }
  }, [user]);

  return (
    <SessionContext.Provider value={state}>{children}</SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('login required');
  }
  return context;
}
