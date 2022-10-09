import React from 'react';
import { SessionContextProvider } from './providers/session-context';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import Router from './Router';

initializeIcons();

function App() {
  return (
    <SessionContextProvider>
      <Router />
    </SessionContextProvider>
  );
}

export default App;
