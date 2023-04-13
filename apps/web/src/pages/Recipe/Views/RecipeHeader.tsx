import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipeContext } from '../../../providers';
import { useSessionContext } from '../../../providers';
import { RecipeMediaBanner } from './components';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import ShareIcon from '@mui/icons-material/Share';
import InputAdornment from '@mui/material/InputAdornment';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Badge from '@mui/material/Badge';

interface RecipeHeaderProps {}

const GENERIC_TITLE = `INSERT TITLE HERE`;

export function RecipeHeader(props: RecipeHeaderProps) {
  const rtx = useRecipeContext();
  const ctx = useSessionContext();
  const navigate = useNavigate();
  const [isNew, setIsNew] = useState(false);
  const [title, setTitle] = useState('');
  const [chefName, setChefName] = useState<string>();
  const [titleFocus, setTitleFocus] = useState(false);

  useEffect(() => {
    if (rtx?.recipe?.author?.username) {
      setChefName('@' + rtx?.recipe?.author?.username);
    } else if (ctx.user?.username) {
      setChefName('@' + ctx.user?.username);
    }
  }, [rtx?.recipe?.author?.username, ctx.user?.username]);

  function handleTitleFocus() {
    setTitleFocus(true);
    if (title == GENERIC_TITLE) {
      setTitle(``);
    }
  }

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  useEffect(() => {
    if (rtx?.recipeId == '0') {
      setIsNew(true);
      setTitle(GENERIC_TITLE);
    }
  }, [rtx?.recipeId]);

  useEffect(() => {
    if (rtx?.recipe?.currentRevision?.name != '') {
      setTitle(`${rtx?.recipe?.currentRevision?.name}`);
    }
  }, [rtx?.recipe?.currentRevision]);

  function forkThisRecipe() {
    ctx.api?.recipes.postRecipesFork(`${rtx?.recipeId}`).then((r) => {
      navigate(`/r/${r.id}`);
    });
  }

  function starThisRecipe() {
    ctx.api?.recipes.postRecipesStar(`${rtx?.recipeId}`).then(() => {
      navigate(`/r/${rtx?.recipeId}`);
      // todo => refresh recipe
    });
  }

  function shareThisRecipe() {
    alert('Share!');
  }

  function handleTitleBlur() {
    if (['', undefined].includes(title)) {
      setTitle(GENERIC_TITLE);
    } else {
      rtx?.setTitle(title);
    }
    setTitleFocus(false);
  }

  function navigateChef() {
    !isNew && navigate(`/${rtx?.recipe?.author?.username}`);
  }

  return (
    <>
      <Stack>
        {!rtx.recipe || rtx.recipe.id == '' || rtx.recipeId == '0' ? (
          <Skeleton variant="rectangular" height={256} />
        ) : (
          <RecipeMediaBanner />
        )}

        {chefName ? (
          <Typography variant="h6" gutterBottom onClick={navigateChef}>
            {chefName}
          </Typography>
        ) : (
          <Skeleton variant="text" />
        )}

        {rtx?.editing ? (
          <Stack>
            <TextField
              variant="standard"
              onFocus={handleTitleFocus}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              value={title}
              // variant="standard"
              size="small"
              inputProps={{ style: { fontSize: 28 } }} // font size of input text
              InputProps={{
                disableUnderline: true,
                startAdornment: titleFocus ? (
                  <InputAdornment position="start">
                    <EditIcon />
                  </InputAdornment>
                ) : (
                  <></>
                ),
              }}
            />
          </Stack>
        ) : (
          <>
            {title?.length > 0 ? (
              <Typography variant="h5" gutterBottom>
                {title}
              </Typography>
            ) : (
              <Skeleton />
            )}
          </>
        )}
      </Stack>
      {isNew && (
        <Container>
          <Stack direction="row" spacing={2} style={{ paddingTop: 12 }}>
            <Badge color="primary" badgeContent={rtx?.recipe?.metadata?.forks}>
              <Button
                variant="outlined"
                startIcon={<CallSplitIcon />}
                onClick={forkThisRecipe}
              >
                Fork
              </Button>
            </Badge>
            <Badge color="primary" badgeContent={rtx?.recipe?.metadata?.stars}>
              <Button
                variant="outlined"
                startIcon={<StarOutlineIcon />}
                onClick={starThisRecipe}
              >
                Star
              </Button>
            </Badge>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={shareThisRecipe}
            >
              Share
            </Button>
          </Stack>
        </Container>
      )}
    </>
  );
}
