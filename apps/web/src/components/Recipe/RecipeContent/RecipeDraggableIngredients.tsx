'use client';
import React, { useEffect, useState, Suspense } from 'react';
import Stack from '@mui/material/Stack';
import { models_Ingredient } from '@4ks/api-fetch';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { default as Droppable } from '@/components/StrictModeDroppable';
import { useRecipeContext } from '@/providers/recipe-context';
import { RecipeIngredient } from './RecipeIngredient';
import { SectionTitle } from '../SectionTitle';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { DropResult } from 'react-beautiful-dnd';

import {
  handleListAdd,
  handleListChange,
  handleListDelete,
  handleListDragEnd,
} from './dnd-functions';

type RecipeIngredientsProps = {
  data: models_Ingredient[];
  onDragEnd: (result: DropResult) => void;
  onChange: (index: number, data: models_Ingredient) => void;
  onDelete: (index: number) => void;
};

export default function RecipeDraggableIngredients({
  data,
  onDragEnd,
  onChange,
  onDelete,
}: RecipeIngredientsProps) {
  // const [ingredients, setIngredients] = useState(data);
  // const rtx = useRecipeContext();

  // useEffect(() => {
  //   // skip if undefined
  //   if (!rtx?.recipe.currentRevision?.ingredients) {
  //     return;
  //   }
  //   // skip if no change
  //   if (rtx?.recipe.currentRevision?.ingredients == ingredients) {
  //     return;
  //   }
  //   setIngredients(rtx?.recipe.currentRevision?.ingredients);
  // }, [ingredients, rtx?.recipe.currentRevision?.ingredients]);

  // function refreshIngredients(i: models_Ingredient[]) {
  //   rtx?.setIngredients(i);
  //   setIngredients(i);
  // }

  // const onDragEnd = handleListDragEnd<models_Ingredient>(
  //   ingredients,
  //   refreshIngredients
  // );

  // const handleIngredientAdd = () =>
  //   handleListAdd<models_Ingredient>(ingredients, refreshIngredients);

  // const handleIngredientDelete = (index: number) =>
  //   handleListDelete<models_Ingredient>(index, ingredients, refreshIngredients);

  // const handleIngredientChange = handleListChange<models_Ingredient>(
  //   ingredients,
  //   refreshIngredients
  // );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="ingredients">
        {(provided) => (
          <ul
            style={{ listStyleType: 'none', paddingInlineStart: '0px' }}
            className="ingredients"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {data?.map((ingredient, index) => {
              const key = `ingredient_${index}_${ingredient.id}`;
              return (
                <Draggable key={key} draggableId={key} index={index}>
                  {(provided, snapshot) => (
                    <li
                      key={ingredient.name}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <RecipeIngredient
                        index={index}
                        data={ingredient}
                        isDragging={snapshot.isDragging}
                        handleIngredientDelete={onDelete}
                        handleIngredientChange={onChange}
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
  );
}
