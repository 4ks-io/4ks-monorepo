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
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface RecipeHeaderProps {}

const GENERIC_TITLE = `INSERT TITLE HERE`;

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function RecipeHeader(props: RecipeHeaderProps) {
  const rtx = useRecipeContext();
  const ctx = useSessionContext();
  const navigate = useNavigate();
  const [isNew, setIsNew] = useState(false);
  const [title, setTitle] = useState('');
  const [chefName, setChefName] = useState<string>();
  const [titleFocus, setTitleFocus] = useState(false);
  const [shareSucess, setShareSucess] = useState(false);

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
    } else {
      setIsNew(false);
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

  async function shareThisRecipe() {
    const shareDetails = {
      url: window.location.href,
      title,
      text: rtx?.recipe?.author?.username,
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
    !isNew && navigate(`/${rtx?.recipe?.author?.username}`);
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
        {!rtx.recipe || rtx.recipe.id == '' || isNew ? (
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
