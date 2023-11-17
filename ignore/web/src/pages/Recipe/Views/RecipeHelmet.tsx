import React, { useEffect, useState } from 'react';
import { useRecipeContext } from '../../../providers';
import { Helmet } from 'react-helmet';

const DEFAULT_TITLE = '4ks';

export function RecipeHelmet() {
  const rtx = useRecipeContext();
  const [title, setTitle] = useState(DEFAULT_TITLE);

  useEffect(() => {
    if (rtx?.recipe?.currentRevision?.name != '') {
      const name = rtx?.recipe?.currentRevision?.name;
      setTitle(`${DEFAULT_TITLE} | ${name}`);
    } else {
      setTitle(DEFAULT_TITLE);
    }
  }, [rtx?.recipe?.currentRevision]);

  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title}</title>
      <link rel="canonical" href="https://www.4ks.io" />
    </Helmet>
  );
}
