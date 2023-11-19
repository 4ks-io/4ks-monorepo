import React, { useEffect, useState } from 'react';
import RegisterComponent from './register-component';
import { Page, PageProps, PagePropsParams } from '@/libs/navigation';
import { handleUserNavigation } from '@/libs/server/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '4ks Register',
  description: '4ks User Registration',
};

export default async function RegisterPage({
  params,
  searchParams,
}: PageProps) {
  // await registerRedirect(params);
  await handleUserNavigation(Page.REGISTER);

  return <RegisterComponent />;
}
