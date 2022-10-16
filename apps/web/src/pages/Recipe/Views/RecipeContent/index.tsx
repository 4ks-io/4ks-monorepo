import React, { useEffect, useState } from 'react';
import { RecipeIngredients } from './RecipeIngredients';
import { RecipeInstructions } from './RecipeInstructions';
import { RecipeSocial } from './RecipeSocial';
import { stackStyles, itemAlignmentsStackTokens } from './../../styles';
import { RecipeEditingControls } from './RecipeEditingControls';
import { RecipeSummary } from './RecipeSummary';
import RecipeLoading from './RecipeLoading';
import { PrimaryButton } from '@fluentui/react/lib/Button';

import { useNavigate } from 'react-router-dom';
import { models_Recipe, dtos_UpdateRecipe } from '@4ks/api-fetch';
import FontSizeChanger from 'react-font-size-changer';
import { IconButton } from '@fluentui/react/lib/Button';
import { useRecipeContext } from '../../../../providers/recipe-context';

type RecipeProps = {
  create?: boolean;
};

const RecipeContentView = ({ create }: RecipeProps) => {
  const rtx = useRecipeContext();

  if (!rtx || !rtx.recipe) {
    return <RecipeLoading />;
  }

  return (
    <>
      <RecipeEditingControls />
      {/* <RecipeSummary /> */}
      <RecipeIngredients />
      <RecipeInstructions />
      <RecipeSocial />

      <FontSizeChanger
        targets={['#target .contentResizer']}
        // onChange={(element: any, newValue: any, oldValue: any) => {
        //   console.log(element, newValue, oldValue);
        // }}
        options={{
          stepSize: 2,
          range: 3,
        }}
        customButtons={{
          up: (
            <IconButton
              iconProps={{ iconName: 'ZoomIn' }}
              title="Emoji"
              ariaLabel="ZoomIn"
            />
          ),
          down: (
            <IconButton
              iconProps={{ iconName: 'ZoomOut' }}
              title="Emoji"
              ariaLabel="ZoomOut"
            />
          ),
          style: {
            color: 'white',
          },
          buttonsMargin: 2,
        }}
      />
    </>
  );
};

export { RecipeContentView };
export default { RecipeContentView };
