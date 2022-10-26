import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@fluentui/react';
import { TextField } from '@fluentui/react/lib/TextField';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Breadcrumb, IBreadcrumbItem } from '@fluentui/react/lib/Breadcrumb';
import { useRecipeContext } from '../../providers/recipe-context';
import { useSessionContext } from '../../providers/session-context';
import { IconButton } from '@fluentui/react/lib/Button';

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
    if (rtx?.recipeId) {
      ctx.api?.recipes.postRecipesFork(rtx?.recipeId).then((r) => {
        navigate(`/r/${r.id}`);
      });
    }
  }

  function starThisRecipe() {
    if (rtx?.recipeId) {
      ctx.api?.recipes.postRecipesStar(rtx?.recipeId).then(() => {
        navigate(`/r/${rtx.recipeId}`);
        // todo => refresh recipe
      });
    }
  }

  function shareThisRecipe() {
    alert('Share!');
  }

  function handleValidationComplete() {
    rtx?.setTitle(title);
  }

  const userBreadcrumb: IBreadcrumbItem = {
    text: rtx?.recipe?.author?.username || `${ctx.user?.username}`,
    key: 'UserName',
    href: encodeURI(`/${rtx?.recipe?.author?.username}`),
  };

  const titleBreadcrumb: IBreadcrumbItem = {
    text: title,
    key: 'title',
    isCurrentItem: true,
  };

  function getCountLabel(c: number | undefined) {
    return c && c > 0 ? ' (' + c + ')' : '';
  }

  const forksCountLabel = getCountLabel(rtx?.recipe.metadata?.forks);
  const starsCountLabel = getCountLabel(rtx?.recipe.metadata?.stars);

  return (
    <Stack.Item align="stretch">
      <div style={{ marginBottom: '12px' }}>
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
                borderless
                readOnly={false}
                validateOnFocusOut={true}
                onNotifyValidationResult={handleValidationComplete}
                value={title}
              />
            </Stack>
          </Stack>
        ) : (
          <Breadcrumb
            items={[userBreadcrumb, titleBreadcrumb]}
            maxDisplayedItems={2}
            ariaLabel="Breadcrumb with items rendered as links"
            overflowAriaLabel="More links"
          />
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
