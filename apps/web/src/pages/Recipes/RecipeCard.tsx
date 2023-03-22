import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import { Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import ShareIcon from '@mui/icons-material/Share';
import CardActions from '@mui/material/CardActions';

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
      <CardActions disableSpacing></CardActions>
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
      <CardHeader
        style={{ padding: 4 }}
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
            title
          )
        }
        subheader={
          loading ? <Skeleton animation="wave" height={20} width="40%" /> : chef
        }
      />
    </Card>
  );
}

export default RecipeCard;
