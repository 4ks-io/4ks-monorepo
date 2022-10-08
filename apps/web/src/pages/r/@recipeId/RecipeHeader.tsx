import React, { useEffect, useState } from 'react';
import { Stack } from '@fluentui/react';
import { TextField } from '@fluentui/react/lib/TextField';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import { Label } from '@fluentui/react/lib/Label';
import { useRecipeContext } from '../../../providers/recipe-context';
import { useSessionContext } from '../../../providers/session-context';

interface RecipeHeaderProps {}

export function RecipeHeader(props: RecipeHeaderProps) {
  const rtx = useRecipeContext();
  const ctx = useSessionContext();
  const [isNew, setIsNew] = useState(false);
  const [title, setTitle] = useState('');

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

  return (
    <Stack.Item align="stretch">
      <Stack horizontal horizontalAlign="start">
        <span>
          <Label style={{ fontWeight: 400 }}>
            {rtx?.recipe?.author?.displayName || `${ctx.user?.name}`}/
          </Label>
        </span>
        <span>
          <TextField
            onChange={handleTitleChange}
            style={{ fontWeight: 600 }}
            borderless
            readOnly={false}
            validateOnFocusOut={true}
            onNotifyValidationResult={handleValidationComplete}
            value={title}
          />
        </span>
      </Stack>
      {isNew && (
        <Stack horizontal horizontalAlign="space-evenly">
          <Stack.Item align="end">
            <PrimaryButton
              iconProps={{ iconName: 'BranchFork2' }}
              text="Fork"
              onClick={_alertFork}
            />
          </Stack.Item>
          <Stack.Item align="end">
            <PrimaryButton
              iconProps={{ iconName: 'FavoriteStar' }}
              text="Star"
              onClick={_alertStar}
            />
          </Stack.Item>
          <Stack.Item align="end">
            <PrimaryButton
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
