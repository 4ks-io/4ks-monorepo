import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Skeleton from '@mui/material/Skeleton';
import { Link } from 'react-router-dom';

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
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardHeader
        avatar={
          loading ? (
            <Skeleton
              animation="wave"
              variant="circular"
              width={40}
              height={40}
            />
          ) : (
            <Avatar
              alt="Ted talk"
              src="https://pbs.twimg.com/profile_images/877631054525472768/Xp5FAPD5_reasonably_small.jpg"
            />
          )
        }
        action={
          loading ? null : (
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          )
        }
        title={
          loading ? (
            <Skeleton
              animation="wave"
              height={10}
              width="80%"
              style={{ marginBottom: 6 }}
            />
          ) : (
            title
          )
        }
        subheader={
          loading ? <Skeleton animation="wave" height={10} width="40%" /> : chef
        }
      />
      {loading ? (
        <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
      ) : (
        <Link to={`/r/${id}`}>
          <CardMedia
            component="img"
            height="140"
            image={imageUrl}
            alt="recipe image"
          />
        </Link>
      )}
      <CardContent>
        {loading ? (
          <React.Fragment>
            <Skeleton
              animation="wave"
              height={10}
              style={{ marginBottom: 6 }}
            />
            <Skeleton animation="wave" height={10} width="80%" />
          </React.Fragment>
        ) : (
          <Typography variant="body2" color="text.secondary" component="p">
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default RecipeCard;

// export default function Facebook() {
//   return (
//     <div>
//       <RecipeCard loading />
//       <RecipeCard />
//     </div>
//   );
// }
