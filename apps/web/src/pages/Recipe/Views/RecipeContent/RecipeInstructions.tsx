import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import { models_Instruction } from '@4ks/api-fetch';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useRecipeContext } from '../../../../providers';
import { RecipeInstruction } from './RecipeInstruction';
import { SectionTitle } from '../components';
import Button from '@mui/material/Button';
import {
  handleListAdd,
  handleListChange,
  handleListDelete,
  handleListDragEnd,
} from './dnd-functions';

export function RecipeInstructions() {
  const rtx = useRecipeContext();

  const [instructions, setInstructions] = useState(
    rtx?.recipe.currentRevision?.instructions
  );

  useEffect(
    () => setInstructions(rtx?.recipe.currentRevision?.instructions),
    [rtx?.recipe.currentRevision?.instructions]
  );

  function refreshInstructions(i: models_Instruction[]) {
    rtx?.setInstructions(i);
    setInstructions(i);
  }

  function onDragStart() {
    console.log('drag start: change color!');
  }

  const onDragEnd = handleListDragEnd<models_Instruction>(
    instructions,
    refreshInstructions
  );

  const handleInstructionAdd = () =>
    handleListAdd<models_Instruction>(instructions, refreshInstructions);

  const handleInstructionDelete = (index: number) =>
    handleListDelete<models_Instruction>(
      index,
      instructions,
      refreshInstructions
    );

  const handleInstructionChange = handleListChange<models_Instruction>(
    instructions,
    refreshInstructions
  );

  return (
    <Stack>
      <SectionTitle value={'Instructions'} />

      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <Droppable droppableId="instructions">
          {(provided) => (
            <ul
              style={{ listStyleType: 'none', paddingInlineStart: '0px' }}
              className="instructions"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {instructions?.map((instruction, index) => {
                const key = `instruction_${index}_${instruction.id}`;
                return (
                  <Draggable
                    key={key}
                    draggableId={key}
                    index={index}
                    isDragDisabled={!rtx?.editing}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <RecipeInstruction
                          index={index}
                          key={instruction.text}
                          data={instruction}
                          editing={rtx?.editing || false}
                          handleInstructionDelete={handleInstructionDelete}
                          handleInstructionChange={handleInstructionChange}
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
      {rtx?.editing && (
        <Button variant="outlined" onClick={handleInstructionAdd}>
          Add Instruction
        </Button>
      )}
    </Stack>
  );
}
