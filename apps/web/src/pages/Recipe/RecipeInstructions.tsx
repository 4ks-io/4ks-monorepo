import React, { useEffect, useState, useCallback } from 'react';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { models_Instruction } from '@4ks/api-fetch';
import { stackStyles, itemAlignmentsStackTokens } from './styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useRecipeContext } from '../../providers/recipe-context';
import { RecipeInstruction } from './RecipeInstruction';
import { SectionTitle } from './components/SectionTitle';
import {
  handleListAdd,
  handleListChange,
  handleListDelete,
  handleListDragEnd,
} from './dnd-functions';

export function RecipeInstructions() {
  const rtx = useRecipeContext();

  const onDragEnd = handleListDragEnd<models_Instruction>(
    rtx?.recipe.currentRevision?.instructions,
    rtx?.setInstructions
  );

  const handleInstructionAdd = () =>
    handleListAdd<models_Instruction>(
      rtx?.recipe.currentRevision?.instructions,
      rtx?.setInstructions
    );

  const handleInstructionDelete = (index: number) =>
    handleListDelete<models_Instruction>(
      index,
      rtx?.recipe.currentRevision?.instructions,
      rtx?.setInstructions
    );

  const handleInstructionChange = handleListChange<models_Instruction>(
    rtx?.recipe.currentRevision?.instructions,
    rtx?.setInstructions
  );

  if (!rtx?.recipe.currentRevision?.instructions) {
    return null;
  }

  return (
    <Stack styles={stackStyles} tokens={itemAlignmentsStackTokens}>
      <SectionTitle value={'Instructions'} />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="instructions">
          {(provided) => (
            <ul
              style={{ listStyleType: 'none', paddingInlineStart: '0px' }}
              className="instructions"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {rtx?.recipe.currentRevision?.instructions?.map(
                (instruction, index) => {
                  const key = `instruction_${index}_${instruction.name}`;
                  return (
                    <Draggable key={key} draggableId={key} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <RecipeInstruction
                            index={index}
                            key={key}
                            data={instruction}
                            handleInstructionDelete={handleInstructionDelete}
                            handleInstructionChange={handleInstructionChange}
                          />
                        </li>
                      )}
                    </Draggable>
                  );
                }
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <DefaultButton
        text="Add Instruction"
        onClick={handleInstructionAdd}
        allowDisabledFocus
      />
    </Stack>
  );
}
