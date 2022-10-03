import React from 'react';
import { Counter } from './Counter';

export { Page };

function Page() {
  return (
    <>
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
