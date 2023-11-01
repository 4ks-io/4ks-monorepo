import * as React from 'react';
import ExploreSearch from '@/components/ExploreSearch';

export default function RecipePage() {
  const apikey = `${process.env.NEXT_PUBLICTYPESENSE_API_KEY}`;
  const host = `${process.env.NEXT_PUBLICTYPESENSE_URL}`;
  const path = `${process.env.NEXT_PUBLICTYPESENSE_PATH}`;

  return <ExploreSearch apikey={apikey} host={host} path={path} />;
}
