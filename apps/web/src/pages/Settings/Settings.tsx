import React from 'react';
import { useSessionContext } from '../../providers/session-context';
import { PageLayout } from '../Layout';

const Settings = () => {
  const ctx = useSessionContext();
  return (
    <PageLayout>
      <h2>Settings</h2>
      <p>username: {ctx.user?.username}</p>
    </PageLayout>
  );
};

export default Settings;
