import React from 'react';
import { Counter } from './Counter';
import { Stack } from '@fluentui/react';

export const documentProps = {
  title: '4ks',
  description: 'Find 4ks.',
};

export function Page() {
  return (
    <>
      <Stack horizontal horizontalAlign="space-between">
        AppBarTest
      </Stack>
      <h1>{import.meta.env.VITE_WELCOME as string}</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </>
  );
}
