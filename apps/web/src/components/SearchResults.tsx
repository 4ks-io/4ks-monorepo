'use client';
import * as React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import RecipeCard from '@/components/RecipeCard';
import { TypesenseSearchResult } from '@/server/search-client';
import { Typography } from '@mui/material';

type SearchResultsProps = {
  results: TypesenseSearchResult | undefined;
};

export default function SearchResults({ results }: SearchResultsProps) {
  if (!results || !results.hits) {
    return <div>no results</div>;
  }

  if (!results || (results.hits && results.hits.length === 0)) {
    return (
      <Container style={{ marginTop: 20 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          No results
        </Typography>
      </Container>
    );
  }

  console.log(results);

  return (
    <Container style={{ marginTop: 20 }}>
      <Grid container spacing={1}>
        {results.hits.map((h) => (
          <Grid xs={12} md={6} lg={4} key={h.document.id}>
            <RecipeCard
              key={h.document.id}
              id={h.document.id}
              title={h.document.name}
              chef={h.document.author}
              imageUrl={h.document.imageURL}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
