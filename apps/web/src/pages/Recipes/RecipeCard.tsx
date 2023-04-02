import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import { Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import ShareIcon from '@mui/icons-material/Share';
import { styled } from '@mui/material/styles';

// https://css.glass/
const StyledCardHeader = styled(CardHeader)({
  margin: '-90px auto 0',
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

function RecipeCard(props: MediaProps) {
  const { loading = false, id, title, description, chef, imageUrl } = props;

  return (
    <Card>
      {loading ? (
        <Skeleton sx={{ height: 280 }} animation="wave" variant="rectangular" />
      ) : (
        <Link to={`/r/${id}`}>
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
        title={
          loading ? (
            <Skeleton
              animation="wave"
              height={30}
              width="80%"
              style={{ marginBottom: 6 }}
            />
          ) : (
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/r/${id}`}
            >
              {title}
            </Link>
          )
        }
        subheader={
          loading ? (
            <Skeleton animation="wave" height={20} width="40%" />
          ) : (
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/${chef}`}
            >
              {chef}
            </Link>
          )
        }
      />
    </Card>
  );
}

export default RecipeCard;
