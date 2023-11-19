import React from 'react';
import RegisterComponent from './register-component';
import { Page, PageProps } from '@/libs/navigation';
import { handleUserNavigation } from '@/libs/server/navigation';
import type { Metadata } from 'next';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';

export const metadata: Metadata = {
  title: '4ks Register',
  description: '4ks User Registration',
};

// export default withPageAuthRequired(
export default async function RegisterPage({
  params,
  searchParams,
}: PageProps) {
  await handleUserNavigation(Page.REGISTER);

  return <RegisterComponent />;
}
