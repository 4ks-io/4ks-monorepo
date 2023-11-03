'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecipeContext } from '@/providers/recipe-context';
import { RecipeMediaBanner } from './RecipeMediaBanner';
import { models_Recipe, models_User } from '@4ks/api-fetch';
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
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type RecipeHeaderProps = {
  user: models_User | undefined;
  recipe: models_Recipe;
};

// todo: better SSR with recipe
export function RecipeHeader({ user, recipe }: RecipeHeaderProps) {
  const rtx = useRecipeContext();
  const router = useRouter();

  // todo: i18n
  const GENERIC_TITLE = `INSERT TITLE HERE`;

  const [isLoading, setIsLoading] = useState(true);
  const [isNew, setIsNew] = useState(false);
  const [title, setTitle] = useState('');
  const [chefName, setChefName] = useState<string>();
  const [titleFocus, setTitleFocus] = useState(false);
  const [shareSucess, setShareSucess] = useState(false);

  useEffect(() => {
    if (rtx?.recipe?.author?.username) {
      setChefName('@' + rtx?.recipe?.author?.username);
    } else if (user?.username) {
      setChefName('@' + user?.username);
    }
  }, [rtx?.recipe?.author?.username, user?.username]);

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
    if (location.pathname == '/r/0') {
      setIsNew(true);
      setTitle(GENERIC_TITLE);
      setIsLoading(false);
    } else if (rtx?.recipe?.createdDate != '') {
      setIsLoading(false);
    }
  }, [rtx?.recipeId, rtx?.recipe?.createdDate]);

  useEffect(() => {
    if (rtx?.recipe?.currentRevision?.name != '') {
      setTitle(`${rtx?.recipe?.currentRevision?.name}`);
    }
  }, [rtx?.recipe?.currentRevision]);

  function forkThisRecipe() {
    // ctx.api?.recipes.postRecipesFork(`${rtx?.recipeId}`).then((r) => {
    //   router.push(`/r/${r.id}`);
    // });
    window.alert('todo => fork this recipe');
  }

  function starThisRecipe() {
    // ctx.api?.recipes.postRecipesStar(`${rtx?.recipeId}`).then(() => {
    //   router.push(`/r/${rtx?.recipeId}`);
    //   // todo => refresh recipe
    // });
    window.alert('todo => star this recipe');
  }

  async function shareThisRecipe() {
    const shareDetails = {
      url: window.location.href,
      title,
      text: title,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareDetails);
      } catch (err) {
        console.error(err);
      }
    } else {
      // browser
      navigator.clipboard.writeText(window.location.href);
      setShareSucess(true);
    }
  }

  function handleClose(event?: React.SyntheticEvent | Event, reason?: string) {
    if (reason === 'clickaway') {
      return;
    }

    setShareSucess(false);
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
    !isNew && router.push(`/${rtx?.recipe?.author?.username}`);
  }

  return (
    <>
      <Snackbar
        open={shareSucess}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          Copied to clipboard!
        </Alert>
      </Snackbar>
      <Stack>
        <RecipeMediaBanner isNew={isNew} />

        {isLoading ? (
          <Skeleton variant="text" height={28} />
        ) : (
          <Typography variant="h6" gutterBottom onClick={navigateChef}>
            {chefName}
          </Typography>
        )}

        {isLoading ? (
          <Skeleton variant="text" height={36} />
        ) : (
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
        )}
      </Stack>
      {
        <Container>
          <Stack direction="row" spacing={2} style={{ paddingTop: 12 }}>
            <Badge color="primary" badgeContent={rtx?.recipe?.metadata?.forks}>
              <Button
                variant="outlined"
                startIcon={<CallSplitIcon />}
                onClick={forkThisRecipe}
                disabled={isNew}
              >
                Fork
              </Button>
            </Badge>
            <Badge color="primary" badgeContent={rtx?.recipe?.metadata?.stars}>
              <Button
                variant="outlined"
                startIcon={<StarOutlineIcon />}
                onClick={starThisRecipe}
                disabled={isNew}
              >
                Star
              </Button>
            </Badge>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={shareThisRecipe}
              disabled={isNew}
            >
              Share
            </Button>
          </Stack>
        </Container>
      }
    </>
  );
}
