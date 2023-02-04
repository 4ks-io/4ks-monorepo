import React, { useEffect, useContext, useReducer, useState } from 'react';
import { initialState } from './app-config-context-init';
import { AppConfig } from './app-config-context-types';
import {
  appConfigContextReducer,
  AppConfigContextAction,
} from './app-config-context-reducer';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';

const AppConfigContext = React.createContext<AppConfig>(initialState);

type AppConfigContextProviderProps = { children: React.ReactNode };

export function AppConfigContextProvider({
  children,
}: AppConfigContextProviderProps) {
  const [state, dispatch] = useReducer(appConfigContextReducer, initialState);
  const [loading, setLoading] = useState(true);

  async function getAppConfig() {
    let appConfig = initialState;

    if (import.meta?.env?.VITE_AUTH0_AUDIENCE) {
      appConfig.AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE as string;
      appConfig.AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN as string;
      appConfig.AUTH0_CLIENT_ID = import.meta.env
        .VITE_AUTH0_CLIENT_ID as string;
      appConfig.MEDIA_FALLBACK_URL = import.meta.env
        .VITE_MEDIA_FALLBACK_URL as string;
    } else {
      appConfig = await (await fetch('/config.json')).json();
    }
    return appConfig;
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
    return <Spinner size={SpinnerSize.large} />;
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
