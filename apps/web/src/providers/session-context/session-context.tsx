import React, { useEffect, useContext, useReducer } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  ApiClient,
  dtos_CreateUser,
  dtos_UpdateUser,
  models_User,
} from '@4ks/api-fetch';
import ApiServiceFactory from '../../services/api';
import { ISessionContext, initialState } from './session-context-init';
import {
  sessionContextReducer,
  SessionContextAction,
} from './session-context-reducer';
import { useNavigate } from 'react-router-dom';

const SessionContext = React.createContext<ISessionContext>(initialState);

type SessionContextProviderProps = { children: React.ReactNode };

export function SessionContextProvider({
  children,
}: SessionContextProviderProps) {
  const { user, isLoading, isAuthenticated, getAccessTokenSilently } =
    useAuth0();
  const [state, dispatch] = useReducer(sessionContextReducer, initialState);
  const navigate = useNavigate();
  const p = localStorage.getItem('locationPathname') || '/';

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
        const u = await a.users.patchUsers(id, data);
        dispatch({
          type: SessionContextAction.SET_USER,
          payload: u,
        });
      }
    };
  }

  async function getUser(a: ApiClient) {
    const e = await a.users.getUsersExist();
    if (e?.exist) {
      const u = await a.users.getUsersProfile();
      await dispatch({
        type: SessionContextAction.SET_USER,
        payload: u,
      });
      await dispatch({
        type: SessionContextAction.SET_ACTIONS,
        payload: { updateUser: updateUser(a) },
      });
      navigate(p);
    } else {
      await dispatch({
        type: SessionContextAction.SET_ACTIONS,
        payload: { createUser: createUser(a) },
      });
      navigate('/new', { replace: true });
    }
  }

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // authenticated user
        // console.log('// authenticated2');
        getAccessTokenSilently().then(async (t) => {
          let a = ApiServiceFactory(t);
          await dispatch({
            type: SessionContextAction.SET_API,
            payload: a,
          });
          getUser(a);
        });
      } else {
        // anonymous user
        // console.log('// anonymous');
        dispatch({
          type: SessionContextAction.SET_API,
          payload: ApiServiceFactory(undefined),
        });
      }
    }
  }, [isLoading, user, isAuthenticated]);

  return (
    <SessionContext.Provider value={state}>{children}</SessionContext.Provider>
  );
}

export function useSessionContext() {
  return useContext(SessionContext);
}
