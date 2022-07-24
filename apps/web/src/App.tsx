import React from 'react';
import { SessionContextProvider } from './providers/session-context';
import Router from './Router';

function App() {
  return (
    <SessionContextProvider>
      <Router />
    </SessionContextProvider>
  );
}

export default App;
