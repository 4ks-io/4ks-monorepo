import React, { useEffect, useState } from 'react';
import { Stack } from '@fluentui/react';
import { TextField } from '@fluentui/react/lib/TextField';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Breadcrumb, IBreadcrumbItem } from '@fluentui/react/lib/Breadcrumb';
import { useRecipeContext } from '../../providers/recipe-context';
import { useSessionContext } from '../../providers/session-context';
import { IconButton } from '@fluentui/react/lib/Button';
import { Toggle } from '@fluentui/react/lib/Toggle';

interface RecipeHeaderProps {}

export function RecipeHeader(props: RecipeHeaderProps) {
  const rtx = useRecipeContext();
  const ctx = useSessionContext();
  const [isNew, setIsNew] = useState(false);
  const [title, setTitle] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);

  function handleTitleChange(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ) {
    setTitle(`${newValue}`);
  }

  useEffect(() => {
    if (rtx?.recipeId == '0') {
      setIsNew(true);
      setTitle(`INSERT TITLE HERE`);
    }
  }, [rtx?.recipeId]);

  useEffect(() => {
    if (rtx?.recipe?.currentRevision?.name) {
      setTitle(rtx?.recipe?.currentRevision?.name);
    }
  }, [rtx?.recipe.currentRevision]);

  function handleValidationComplete() {
    rtx?.setTitle(title);
  }

  function handleEditTitleComplete() {
    setEditingTitle(false);
  }

  function toggleEditTitle(
    ev: React.MouseEvent<HTMLElement> | undefined,
    item: IBreadcrumbItem | undefined
  ): void {
    setEditingTitle(!editingTitle);
  }

  const userBreadcrumb: IBreadcrumbItem = {
    text: rtx?.recipe?.author?.displayName || `${ctx.user?.name}`,
    key: 'DisplayName',
    href: encodeURI(`/${rtx?.recipe?.author?.displayName}`),
  };

  const titleBreadcrumb: IBreadcrumbItem = {
    text: title,
    key: 'title',
    onClick: toggleEditTitle,
    isCurrentItem: true,
  };

  const fakeBreadcrumb: IBreadcrumbItem = {
    text: '',
    key: 'fake',
    isCurrentItem: true,
  };

  return (
    <Stack.Item align="stretch">
      <div style={{ marginBottom: '12px' }}>
        {rtx?.editing && editingTitle ? (
          <Stack horizontal horizontalAlign="start">
            <Stack
              horizontal
              horizontalAlign="start"
              style={{ margin: '11px 0px 1px' }}
            >
              <IconButton
                iconProps={{ iconName: 'Completed' }}
                aria-label="Complete"
                onClick={handleEditTitleComplete}
              />
              <TextField
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
          <Stack.Item align="end">
            <DefaultButton
              iconProps={{ iconName: 'BranchFork2' }}
              text="Fork"
              onClick={_alertFork}
            />
          </Stack.Item>
          <Stack.Item align="end">
            <DefaultButton
              iconProps={{ iconName: 'FavoriteStar' }}
              text="Star"
              onClick={_alertStar}
            />
          </Stack.Item>
          <Stack.Item align="end">
            <DefaultButton
              iconProps={{ iconName: 'SocialListeningLogo' }}
              text="Share"
              onClick={_alertShare}
            />
          </Stack.Item>
        </Stack>
      )}
    </Stack.Item>
  );
}

function _alertFork() {
  alert('Fork!');
}

function _alertStar() {
  alert('Star!');
}

function _alertShare() {
  alert('Share!');
}
