import React from 'react';
import { useRecipeContext } from '../../../../providers';
import { SectionTitle } from '../components';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface RecipeSocialProps {}

export function RecipeSocial(props: RecipeSocialProps) {
  const rtx = useRecipeContext();

  return (
    <>
      <Stack>
        <SectionTitle value={'Contributors'} />
        {rtx?.recipe?.contributors?.map((c) => {
          return (
            <Typography key={c.username} variant="body1" gutterBottom>
              {c.username}
            </Typography>
          );
        })}
      </Stack>
      <div style={{ paddingBottom: 30 }} />
      <Stack>
        {rtx?.recipe.currentRevision?.link && (
          <>
            <SectionTitle value={'Source'} />
            <Typography variant="body1" gutterBottom>
              <a
                href={'https://' + rtx.recipe.currentRevision?.link}
                target="_blank"
                rel="noreferrer"
              >
                {rtx.recipe.currentRevision?.link.split('/')[0]}
              </a>
            </Typography>
          </>
        )}
      </Stack>
    </>
  );
}
