import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@fluentui/react';
import { TextField } from '@fluentui/react/lib/TextField';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Breadcrumb, IBreadcrumbItem } from '@fluentui/react/lib/Breadcrumb';
import { useRecipeContext } from '../../providers/recipe-context';
import { useSessionContext } from '../../providers/session-context';
import { IconButton } from '@fluentui/react/lib/Button';
import Skeleton from 'react-loading-skeleton';
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
    if (rtx?.recipe?.currentRevision?.name) {
      setTitle(rtx?.recipe?.currentRevision?.name);
    }
  }, [rtx?.recipe.currentRevision]);

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
    text: '@' + (rtx?.recipe?.author?.username || undefined),
    key: 'UserName',
    href: encodeURI(`/${rtx?.recipe?.author?.username}`),
  };

  function getCountLabel(c: number | undefined) {
    return c && c > 0 ? ' (' + c + ')' : '';
  }

  const forksCountLabel = getCountLabel(rtx?.recipe.metadata?.forks);
  const starsCountLabel = getCountLabel(rtx?.recipe.metadata?.stars);

  return (
    <Stack.Item align="stretch">
      <div style={{ marginBottom: '12px' }}>
        {userBreadcrumb.text.length > 0 ? (
          <Breadcrumb
            items={[userBreadcrumb]}
            maxDisplayedItems={1}
            ariaLabel="headercrums"
            // style={{ fontWeight: 400 }}
            // overflowAriaLabel="More links"
          />
        ) : (
          <Skeleton />
        )}
        {rtx?.editing ? (
          <Stack horizontal horizontalAlign="start">
            <Stack
              horizontal
              horizontalAlign="start"
              style={{ margin: '11px 0px 1px' }}
            >
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
          </Stack>
        ) : (
          <>
            {title.length > 0 ? (
              <Label
                styles={{
                  root: {
                    fontSize: 20,
                    height: '40px',
                    paddingLeft: 8,
                    marginBottom: 40,
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
      </div>
      {isNew && (
        <Stack horizontal horizontalAlign="space-evenly">
          <DefaultButton
            iconProps={{ iconName: 'BranchFork2' }}
            text={`Fork${forksCountLabel}`}
            onClick={forkThisRecipe}
          />
          <DefaultButton
            iconProps={{ iconName: 'FavoriteStar' }}
            text={`Star${starsCountLabel}`}
            onClick={starThisRecipe}
          />
          <DefaultButton
            iconProps={{ iconName: 'SocialListeningLogo' }}
            text="Share"
            onClick={shareThisRecipe}
          />
        </Stack>
      )}
    </Stack.Item>
  );
}
