'use client';
import React from 'react';
import { useRecipeContext } from '@/providers/recipe-context';
import { SectionTitle } from '../SectionTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { normalizeForURL } from '@/libs/navigation';
import LinkIcon from '@mui/icons-material/Link';
import Link from 'next/link';

interface RecipeSocialProps {}

export default function RecipeSocial(props: RecipeSocialProps) {
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
            {rtx.recipe?.branch && (
              <Link
                prefetch={false}
                href={`/recipe/${rtx.recipe?.branch}`}
                style={{ textDecoration: 'none', color: '#000' }}
              >
                <Typography variant="body1" gutterBottom>
                  <LinkIcon fontSize="small" /> Parent Recipe
                </Typography>
              </Link>
            )}
            <Typography variant="body1" gutterBottom>
              <Link
                prefetch={false}
                href={'https://' + rtx.recipe.currentRevision?.link}
                style={{ textDecoration: 'none', color: '#000' }}
              >
                <LinkIcon fontSize="small" />{' '}
                {rtx.recipe.currentRevision?.link.split('/')[0]}
              </Link>
            </Typography>
          </>
        )}
      </Stack>
      <div style={{ paddingBottom: 30 }} />
    </>
  );
}
