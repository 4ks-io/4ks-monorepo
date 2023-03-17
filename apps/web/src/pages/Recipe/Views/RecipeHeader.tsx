import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipeContext } from '../../../providers';
import { useSessionContext } from '../../../providers';
import { RecipeMediaBanner } from './components';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import StarOutline from '@mui/icons-material/StarOutline';
import CallSplit from '@mui/icons-material/CallSplit';
import Share from '@mui/icons-material/Share';

import { TextField } from '@fluentui/react/lib/TextField';
import { Breadcrumb, IBreadcrumbItem } from '@fluentui/react/lib/Breadcrumb';
import { IconButton } from '@fluentui/react/lib/Button';
import { Label } from '@fluentui/react/lib/Label';

interface RecipeHeaderProps {}

const GENERIC_TITLE = `INSERT TITLE HERE`;

export function RecipeHeader(props: RecipeHeaderProps) {
  const rtx = useRecipeContext();
  const ctx = useSessionContext();
  const navigate = useNavigate();
  const [isNew, setIsNew] = useState(false);
  const [title, setTitle] = useState('');

  function handleTitleFocus() {
    if (title == GENERIC_TITLE) {
      setTitle(``);
    }
  }

  function handleTitleBlur() {
    if (title == '') {
      setTitle(GENERIC_TITLE);
    }
  }

  function handleTitleChange(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ) {
    setTitle(`${newValue}`);
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

  function handleValidationComplete() {
    rtx?.setTitle(title);
  }

  const userBreadcrumb: IBreadcrumbItem = {
    text: '@' + (rtx?.recipe?.author?.username || ctx.user?.username),
    key: 'UserName',
    href: encodeURI(`/${rtx?.recipe?.author?.username}`),
  };

  function getCountLabel(c: number | undefined) {
    return c && c > 0 ? ' (' + c + ')' : '';
  }

  const forksCountLabel = getCountLabel(rtx?.recipe?.metadata?.forks);
  const starsCountLabel = getCountLabel(rtx?.recipe?.metadata?.stars);

  return (
    <Stack>
      {!rtx.recipe || rtx.recipe.id == '' || rtx.recipeId == '0' ? (
        <Skeleton variant="rectangular" height={256} />
      ) : (
        <RecipeMediaBanner />
      )}

      {userBreadcrumb.text.length > 0 ? (
        <Breadcrumb
          items={[userBreadcrumb]}
          maxDisplayedItems={1}
          ariaLabel="headercrums"
        />
      ) : (
        <Skeleton variant="text" />
      )}
      {rtx?.editing ? (
        <Stack>
          <IconButton
            iconProps={{ iconName: 'EditMirrored' }}
            aria-label="EditMirrored"
          />
          <TextField
            onFocus={handleTitleFocus}
            onBlur={handleTitleBlur}
            onChange={handleTitleChange}
            style={{ fontWeight: 600, fontSize: '18px' }}
            styles={{
              field: {
                fontSize: 16,
                width: 400,
              },
            }}
            borderless
            readOnly={false}
            validateOnFocusOut={true}
            onNotifyValidationResult={handleValidationComplete}
            value={title}
          />
        </Stack>
      ) : (
        <>
          {title?.length > 0 ? (
            <Label
              styles={{
                root: {
                  fontSize: 20,
                  height: '40px',
                  paddingLeft: 8,
                  marginBottom: 16,
                },
              }}
            >
              {title}
            </Label>
          ) : (
            <Skeleton />
          )}
        </>
      )}
      {isNew && (
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<CallSplit />}
            onClick={forkThisRecipe}
          >
            {`Fork${forksCountLabel}`}
          </Button>
          <Button
            variant="outlined"
            startIcon={<StarOutline />}
            onClick={starThisRecipe}
          >
            {`Star${starsCountLabel}`}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Share />}
            onClick={shareThisRecipe}
          >
            Share
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
