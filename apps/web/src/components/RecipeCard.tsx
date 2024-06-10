'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import StarIcon from '@mui/icons-material/Star';
import ShareIcon from '@mui/icons-material/Share';
import { styled } from '@mui/material/styles';
import { normalizeForURL } from '@/libs/navigation';
import Tooltip from '@mui/material/Tooltip';

interface MediaProps {
  loading?: boolean;
  id?: string;
  title?: string;
  description?: string;
  chef?: string;
  imageUrl?: string;
}

export default function RecipeCard({
  loading = false,
  id,
  title,
  chef,
  imageUrl,
}: MediaProps) {
  const [raised, setRaised] = useState(false);

  let recipeURL = `/recipe/${id}`;
  if (title) {
    recipeURL = `/recipe/${id}-${normalizeForURL(title)}`;
  }

  // https://css.glass/
  const StyledCardHeader = styled(CardHeader)({
    zIndex: 2,
    margin: '-120px auto 0',
    borderRadius: '4px',
    position: 'relative',
    background: 'rgba(0, 0, 0, 0.2)',
    // background: 'rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(5px)',
    // '&:hover': {
    //   background: 'rgba(255, 255, 255, 0.2)',
    // },
  });

  function handlePopoverOpen() {
    setRaised(true);
  }
  function handlePopoverClose() {
    setRaised(false);
  }

  return (
    <Card
      raised={raised}
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
    >
      {loading ? (
        <Skeleton sx={{ height: 320 }} animation="wave" variant="rectangular" />
      ) : (
        <Link
          prefetch={false}
          key={id}
          href={recipeURL}
          style={{ textDecoration: 'none' }}
        >
          <CardMedia
            component="img"
            height="320"
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
        // tr@ck: {overflow: 'hidden', textOverflow: 'ellipsis'}
        title={
          loading ? (
            <Skeleton
              animation="wave"
              height={30}
              width="80%"
              style={{ marginBottom: 6 }}
            />
          ) : (
            <Tooltip title={title}>
              <Link
                prefetch={false}
                href={recipeURL}
                style={{ textDecoration: 'none', color: '#fff' }}
              >
                <div
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '16rem',
                  }}
                >
                  <Typography variant="h6" noWrap>
                    {title}
                  </Typography>
                </div>
              </Link>
            </Tooltip>
          )
        }
        subheader={
          loading ? (
            <Skeleton animation="wave" height={20} width="40%" />
          ) : (
            <Link
              prefetch={false}
              href={`/${chef}`}
              style={{ textDecoration: 'none', color: '#fff' }}
            >
              {chef}
            </Link>
          )
        }
      />
    </Card>
  );
}
