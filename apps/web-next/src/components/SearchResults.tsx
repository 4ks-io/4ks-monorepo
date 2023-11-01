'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import RecipeCard from '@/components/RecipeCard';
import { TypesenseSearchResult } from '@/server/search-client';

// function NewRecipeButton() {
//   const router = useRouter();

//   return (
//     <Fab
//       color="primary"
//       aria-label="add"
//       sx={{
//         margin: 0,
//         top: 'auto',
//         right: 20,
//         bottom: 20,
//         left: 'auto',
//         position: 'fixed',
//       }}
//       onClick={() => {
//         router.push('/recipe/0');
//       }}
//     >
//       <AddIcon />
//     </Fab>
//   );
// }

type SearchResultsProps = {
  results: TypesenseSearchResult;
};

export default function SearchResults({ results }: SearchResultsProps) {
  if (!results || !results.hits) {
    return <div>no results</div>;
  }
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
