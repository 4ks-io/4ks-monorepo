import React, { useEffect, useContext, useReducer } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  ApiClient,
  dtos_CreateUser,
  dtos_UpdateUser,
  models_User,
} from '@4ks/api-fetch';
import ApiServiceFactory from '../services/api';
import { ISessionContext, initialState } from './session-context-init';
import {
  sessionContextReducer,
  SessionContextAction,
} from './session-context-reducer';

const SessionContext = React.createContext<ISessionContext>(initialState);

type SessionContextProviderProps = { children: React.ReactNode };

export function SessionContextProvider({
  children,
}: SessionContextProviderProps) {
  const { user, getAccessTokenSilently } = useAuth0();

  const [state, dispatch] = useReducer(sessionContextReducer, initialState);

  function createUser(a: ApiClient) {
    return ({ username, displayName }: dtos_CreateUser) => {
      a?.users
        .postUsers({
          displayName: displayName,
          username: username.trim(),
        })
        .then((u: models_User) => {
          dispatch({
            type: SessionContextAction.SET_USER,
            payload: u,
          });
          dispatch({
            type: SessionContextAction.SET_ACTIONS,
            payload: { updateUser: updateUser(a) },
          });
        });
    };
  }

  function updateUser(a: ApiClient) {
    return async (id: string, data: dtos_UpdateUser) => {
      if (data.username) {
        // try {
        const u = await a.users.patchUsers(id, data);
        dispatch({
          type: SessionContextAction.SET_USER,
          payload: u,
        });
        // } catch {
        //   console.log('error updating user');
        // }
      }
    };
  }

  async function getUser(a: ApiClient) {
    a.users
      .getUsersProfile()
      .then((u: models_User) => {
        dispatch({
          type: SessionContextAction.SET_USER,
          payload: u,
        });
        dispatch({
          type: SessionContextAction.SET_ACTIONS,
          payload: { updateUser: updateUser(a) },
        });
      })
      .catch(() => {
        dispatch({
          type: SessionContextAction.SET_ACTIONS,
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
          type: SessionContextAction.SET_API,
          payload: a,
        });
        getUser(a);
      });
    } else {
      // anonymous user
      console.log('// anonymous user');
      dispatch({
        type: SessionContextAction.SET_API,
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
