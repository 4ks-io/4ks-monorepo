import React, { useEffect, useContext, useState, useReducer } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ApiClient } from '@4ks/api-fetch';
import ApiServiceFactory from '../services';
import {
  ISessionContext,
  initialState,
  createUserProps,
} from './session-context-init';
import {
  sessionContextReducer,
  SesionContextAction,
} from './session-context-reducer';

const SessionContext = React.createContext<ISessionContext>(initialState);

type SessionContextProviderProps = { children: React.ReactNode };

export function SessionContextProvider({
  children,
}: SessionContextProviderProps) {
  const { user, getAccessTokenSilently } = useAuth0();

  const [state, dispatch] = useReducer(sessionContextReducer, initialState);

  function createUser(a: ApiClient) {
    return ({ username, displayName }: createUserProps) => {
      a?.users
        .postUsers({
          displayName: displayName,
          username: username.trim(),
        })
        .then((u) => {
          dispatch({
            type: SesionContextAction.SET_USER,
            payload: u,
          });
        });
    };
  }

  async function setUser(a: ApiClient) {
    a.users
      .getUsersProfile()
      .then((u) => {
        dispatch({
          type: SesionContextAction.SET_USER,
          payload: u,
        });
      })
      .catch(() => {
        dispatch({
          type: SesionContextAction.SET_ACTIONS,
          payload: { createUser: createUser(a) },
        });
      });
  }

  useEffect(() => {
    // authenticated user
    if (user) {
      console.log('// authenticated user');
      getAccessTokenSilently().then(async (t) => {
        let a = ApiServiceFactory(t);
        dispatch({
          type: SesionContextAction.SET_API,
          payload: a,
        });
        setUser(a);
      });
    } else {
      // anonymous user
      console.log('// anonymous user');
      dispatch({
        type: SesionContextAction.SET_API,
        payload: ApiServiceFactory(undefined),
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
