'use client';
import * as React from 'react';
import Link from 'next/link';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import StarIcon from '@mui/icons-material/Star';
import ShareIcon from '@mui/icons-material/Share';
import { styled } from '@mui/material/styles';
import { normalizeForURL } from '@/libs/navigation';

// https://css.glass/
const StyledCardHeader = styled(CardHeader)({
  margin: '-120px auto 0',
  borderRadius: '4px',
  position: 'relative',
  zIndex: 2,
  background: 'rgba(255, 255, 255, 0.2)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(5px)',
});

interface MediaProps {
  loading?: boolean;
  id?: string;
  title?: string;
  description?: string;
  chef?: string;
  imageUrl?: string;
}

export default function RecipeCard(props: MediaProps) {
  const { loading = false, id, title, description, chef, imageUrl } = props;
  let recipeURL = `/recipe/${id}`;
  if (title) {
    recipeURL = `/recipe/${normalizeForURL(title)}/${id}`;
  }

  return (
    <Card>
      {loading ? (
        <Skeleton sx={{ height: 280 }} animation="wave" variant="rectangular" />
      ) : (
        <Link key={id} href={recipeURL} style={{ textDecoration: 'none' }}>
          <CardMedia
            component="img"
            height="280"
            image={imageUrl}
            alt="recipe image"
          />
        </Link>
      )}
      <StyledCardHeader
        // style={{ padding: 4 }}
        action={
          loading ? null : (
            <>
              <IconButton aria-label="add to favorites">
                <StarIcon />
              </IconButton>
              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>
            </>
          )
        }
        // todo: {overflow: 'hidden', textOverflow: 'ellipsis'}
        title={
          loading ? (
            <Skeleton
              animation="wave"
              height={30}
              width="80%"
              style={{ marginBottom: 6 }}
            />
          ) : (
            <Link href={recipeURL} style={{ textDecoration: 'none' }}>
              {title}
            </Link>
          )
        }
        subheader={
          loading ? (
            <Skeleton animation="wave" height={20} width="40%" />
          ) : (
            <Link href={`/${chef}`} style={{ textDecoration: 'none' }}>
              {chef}
            </Link>
          )
        }
      />
    </Card>
  );
}
