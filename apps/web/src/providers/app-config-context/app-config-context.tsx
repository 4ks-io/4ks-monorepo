import React, { useEffect, useContext, useReducer, useState } from 'react';
import { initialState } from './app-config-context-init';
import { AppConfig } from './app-config-context-types';
import {
  appConfigContextReducer,
  AppConfigContextAction,
} from './app-config-context-reducer';
import CircularProgress from '@mui/material/CircularProgress';

const AppConfigContext = React.createContext<AppConfig>(initialState);

type AppConfigContextProviderProps = { children: React.ReactNode };

export function AppConfigContextProvider({
  children,
}: AppConfigContextProviderProps) {
  const [state, dispatch] = useReducer(appConfigContextReducer, initialState);
  const [loading, setLoading] = useState(true);

  async function getAppConfig() {
    let conf = initialState;

    if (import.meta?.env?.VITE_AUTH0_AUDIENCE) {
      conf.AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE as string;
      conf.AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN as string;
      conf.AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID as string;
      conf.TYPESENSE_URL = import.meta.env.VITE_TYPESENSE_URL as string;
      conf.TYPESENSE_PATH = import.meta.env.VITE_TYPESENSE_PATH as string;
      conf.TYPESENSE_API_KEY = import.meta.env.VITE_TYPESENSE_API_KEY as string;
      conf.MEDIA_FALLBACK_URL = import.meta.env
        .VITE_MEDIA_FALLBACK_URL as string;
    } else {
      conf = await (await fetch('/config.json')).json();
    }
    return conf;
  }

  useEffect(() => {
    (async () => {
      const appConfig = await getAppConfig();
      dispatch({
        type: AppConfigContextAction.SET_CONFIG,
        payload: appConfig,
      });
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }
  return (
    <AppConfigContext.Provider value={state}>
      {children}
    </AppConfigContext.Provider>
  );
}

export function useAppConfigContext() {
  return useContext(AppConfigContext);
}
