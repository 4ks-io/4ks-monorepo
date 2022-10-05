import React from 'react';

export const documentProps = {
  title: 'About',
  description: 'Find 4ks.',
};

export function Page() {
  return (
    <>
      <h1>About</h1>
      <p>
        Demo using <code>vite-plugin-ssr</code>.
      </p>
    </>
  );
}
