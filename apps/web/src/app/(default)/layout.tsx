import * as React from 'react';
import AppHeader from '@/components/AppHeader';
import { getUserData } from '@/libs/server/data';

type DefaultLayoutProps = {
  children: React.ReactNode;
};

export default async function DefaultLayout({ children }: DefaultLayoutProps) {
  // log().Debug(new Error(), [{ k: 'msg', v: 'DefaultLayout' }]);
  const user = await getUserData();

  return (
    <>
      <AppHeader user={user} />
      {children}
    </>
  );
}
