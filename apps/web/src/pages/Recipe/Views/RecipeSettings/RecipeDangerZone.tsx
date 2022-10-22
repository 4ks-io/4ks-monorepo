import React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { SectionTitle } from '../components/SectionTitle';
import { stackStyles, itemAlignmentsStackTokens } from './../../styles';
import { Icon } from '@fluentui/react/lib/Icon';
import { useSessionContext } from '../../../../providers/session-context';
import { useRecipeContext } from '../../../../providers/recipe-context';
import { useNavigate } from 'react-router-dom';
import { DefaultButton } from '@fluentui/react/lib/Button';

interface RecipeDangerZoneProps {}

export function RecipeDangerZone({}: RecipeDangerZoneProps) {
  const ctx = useSessionContext();
  const rtx = useRecipeContext();
  const navigate = useNavigate();

  const handleDelete = () => {
    if (rtx?.recipeId) {
      ctx.api?.recipes.deleteRecipes(rtx.recipeId).then(() => navigate(`/r`));
    }
  };

  return (
    <Stack styles={stackStyles} tokens={itemAlignmentsStackTokens}>
      <SectionTitle value={'Danger Zone'} />
      <Stack.Item>
        <Icon iconName="Delete" onClick={handleDelete} />
        <DefaultButton text="Delete Recipe" onClick={handleDelete} />
      </Stack.Item>
    </Stack>
  );
}
