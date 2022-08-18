import React, { useEffect, useState } from 'react';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { models_Ingredient } from '@4ks/api-fetch';
import { stackStyles, itemAlignmentsStackTokens } from './styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useRecipeContext } from '../../providers/recipe-context';
import { RecipeInstruction } from './RecipeInstruction';

interface RecipeInstructionsProps {}

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

export function RecipeInstructions(props: RecipeInstructionsProps) {
  const rtx = useRecipeContext();

  const [instructions, setInstructions] = useState(
    rtx?.recipe.currentRevision?.instructions
  );

  useEffect(
    () => setInstructions(rtx?.recipe.currentRevision?.instructions),
    [rtx?.recipe.currentRevision?.instructions]
  );

  function onDragEnd(result: any) {
    if (!instructions || !result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const ingreds = reorder(
      instructions,
      result.source.index,
      result.destination.index
    );

    rtx?.setInstructions(ingreds);
    setInstructions(ingreds);
  }

  return (
    <Stack styles={stackStyles} tokens={itemAlignmentsStackTokens}>
      <span>Instructions</span>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="instructions">
          {(provided) => (
            <ul
              style={{ listStyleType: 'none' }}
              className="instructions"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {instructions?.map((instruction, index) => (
                <Draggable
                  key={instruction.name}
                  draggableId={`${instruction.name}`}
                  index={index}
                >
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <RecipeInstruction
                        index={index}
                        key={instruction.name}
                        data={instruction}
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
        text="Add Instruction"
        onClick={() => {}}
        allowDisabledFocus
      />
    </Stack>
  );
}
