import React, { useEffect, useState } from 'react';
import { Stack } from '@fluentui/react';
import { TextField } from '@fluentui/react/lib/TextField';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import { Label } from '@fluentui/react/lib/Label';
import { useRecipeContext } from '../../providers/recipe-context';
import { useSessionContext } from '../../providers/session-context';

interface RecipeHeaderProps {}

export function RecipeHeader(props: RecipeHeaderProps) {
  const rtx = useRecipeContext();
  const ctx = useSessionContext();
  const [isNew, setIsNew] = useState(true);
  const [title, setTitle] = useState(`INSERT TITLE HERE`);

  function handleTitleChange(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ) {
    setTitle(`${newValue}`);
  }

  useEffect(() => {
    rtx?.recipeId != '0' && setIsNew(false);
  }, [rtx?.recipeId]);

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
            readOnly={!isNew}
            value={rtx?.recipe?.currentRevision?.name || title}
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
