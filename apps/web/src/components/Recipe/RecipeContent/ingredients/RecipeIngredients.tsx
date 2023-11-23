'use client';
import React, { useEffect, useState } from 'react';
import { isSSR } from '@/libs/navigation';
import Stack from '@mui/material/Stack';
import { models_Ingredient } from '@4ks/api-fetch';
import { useRecipeContext } from '@/providers/recipe-context';
import RecipeIngredient from './RecipeIngredient';
import { SectionTitle } from '../../SectionTitle';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import RecipeDraggableIngredients from './RecipeDraggableIngredients';
import {
  handleListAdd,
  handleListChange,
  handleListDelete,
  handleListDragEnd,
} from '../dnd-functions';

type RecipeIngredientsProps = {
  ingredients: models_Ingredient[];
};

export default function RecipeIngredients(props: RecipeIngredientsProps) {
  const [ingredients, setIngredients] = useState(props.ingredients);
  const rtx = useRecipeContext();

  useEffect(() => {
    // skip if undefined
    if (!rtx?.recipe.currentRevision?.ingredients) {
      return;
    }
    // skip if no change
    if (rtx?.recipe.currentRevision?.ingredients == ingredients) {
      return;
    }
    setIngredients(rtx?.recipe.currentRevision?.ingredients);
  }, [ingredients, rtx?.recipe.currentRevision?.ingredients]);

  function refreshIngredients(i: models_Ingredient[]) {
    rtx?.setIngredients(i);
    setIngredients(i);
  }

  const onDragEnd = handleListDragEnd<models_Ingredient>(
    ingredients,
    refreshIngredients
  );

  const handleIngredientAdd = () =>
    handleListAdd<models_Ingredient>(ingredients, refreshIngredients);

  const handleIngredientDelete = (index: number) =>
    handleListDelete<models_Ingredient>(index, ingredients, refreshIngredients);

  const handleIngredientChange = handleListChange<models_Ingredient>(
    ingredients,
    refreshIngredients
  );

  const fallback = (
    <ul
      style={{ listStyleType: 'none', paddingInlineStart: '0px' }}
      className="ingredients"
    >
      {props.ingredients.map((ingredient, index) => (
        <li key={`ingredient_${index}_${ingredient.id}`}>
          <RecipeIngredient
            index={index}
            data={ingredient}
            isDragging={false}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <Stack>
      <Stack direction="row" spacing={2}>
        <SectionTitle value={'Ingredients'} />
        <IconButton aria-label="add" onClick={handleIngredientAdd}>
          <AddIcon />
        </IconButton>
      </Stack>

      {isSSR ? (
        fallback
      ) : (
        <RecipeDraggableIngredients
          data={ingredients}
          onDragEnd={onDragEnd}
          onDelete={handleIngredientDelete}
          onChange={handleIngredientChange}
        />
      )}
    </Stack>
  );
}
