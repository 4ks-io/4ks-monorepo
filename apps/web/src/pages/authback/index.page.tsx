import React from 'react';
import { usePageContext } from '../../renderer/usePageContext';

export const documentProps = {
  title: '4ks',
  description: 'authback.',
};

export function Page() {
  const pageContext = usePageContext();
  console.log(pageContext);
  return (
    <p>
      redir to <a href="https://www.w3docs.com"></a>
    </p>
  );
}
