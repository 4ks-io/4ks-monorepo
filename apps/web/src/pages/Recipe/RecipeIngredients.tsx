import React, { useEffect, useState } from 'react';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { models_Ingredient } from '@4ks/api-fetch';
import { stackStyles, itemAlignmentsStackTokens } from './styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useRecipeContext } from '../../providers/recipe-context';
import { RecipeIngredient } from './RecipeIngredient';

interface RecipeIngredientsProps {}

const reorder = (
  list: models_Ingredient[],
  startIndex: number,
  endIndex: number
): models_Ingredient[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export function RecipeIngredients(props: RecipeIngredientsProps) {
  const rtx = useRecipeContext();

  const [ingredients, setIngredients] = useState(
    rtx?.recipe.currentRevision?.ingredients
  );

  useEffect(
    () => setIngredients(rtx?.recipe.currentRevision?.ingredients),
    [rtx?.recipe.currentRevision?.ingredients]
  );

  function onDragEnd(result: any) {
    if (!ingredients || !result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const ingreds = reorder(
      ingredients,
      result.source.index,
      result.destination.index
    );

    rtx?.setIngredients(ingreds);
    setIngredients(ingreds);
  }

  function cloneIngredients(): models_Ingredient[] {
    return Object.assign([], ingredients) as models_Ingredient[];
  }

  function handleIngredientAdd() {
    const i = cloneIngredients();
    i?.push({});
    setIngredients(i);
  }

  function handleIngredientDelete(index: number) {
    const i = cloneIngredients();
    i.splice(index, 1);
    setIngredients(i);
  }

  function handleIngredientChange(index: number, data: models_Ingredient) {
    const i = cloneIngredients();
    i[index] = data;
    rtx?.setIngredients(i);
    setIngredients(i);
  }

  return (
    <Stack styles={stackStyles} tokens={itemAlignmentsStackTokens}>
      <span>Ingredients</span>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="ingredients">
          {(provided) => (
            <ul
              style={{ listStyleType: 'none' }}
              className="ingredients"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {ingredients?.map((ingredient, index) => (
                <Draggable
                  key={`${index}+${ingredient.name}`}
                  draggableId={`${ingredient.name}`}
                  index={index}
                >
                  {(provided) => (
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
                      />
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <DefaultButton
        text="Add Ingredient"
        onClick={handleIngredientAdd}
        allowDisabledFocus
      />
    </Stack>
  );
}
