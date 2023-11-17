'use client';
import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import { models_Ingredient } from '@4ks/api-fetch';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { default as Droppable } from '@/components/StrictModeDroppable';
import { useRecipeContext } from '@/providers/recipe-context';
import { RecipeIngredient } from './RecipeIngredient';
import { SectionTitle } from '../SectionTitle';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';

import {
  handleListAdd,
  handleListChange,
  handleListDelete,
  handleListDragEnd,
} from './dnd-functions';

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

  return (
    <Stack>
      <Stack direction="row" spacing={2}>
        <SectionTitle value={'Ingredients'} />
        <IconButton aria-label="add" onClick={handleIngredientAdd}>
          <AddIcon />
        </IconButton>
      </Stack>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="ingredients">
          {(provided) => (
            <ul
              style={{ listStyleType: 'none', paddingInlineStart: '0px' }}
              className="ingredients"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {ingredients?.map((ingredient, index) => {
                const key = `ingredient_${index}_${ingredient.id}`;
                return (
                  <Draggable key={key} draggableId={key} index={index}>
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <RecipeIngredient
                          index={index}
                          key={ingredient.name}
                          data={ingredient}
                          handleIngredientDelete={handleIngredientDelete}
                          handleIngredientChange={handleIngredientChange}
                          isDragging={snapshot.isDragging}
                        />
                      </li>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </Stack>
  );
}
