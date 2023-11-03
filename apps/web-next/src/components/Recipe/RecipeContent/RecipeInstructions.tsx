'use client';
import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import { models_Instruction } from '@4ks/api-fetch';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useRecipeContext } from '@/providers/recipe-context';
import { RecipeInstruction } from './RecipeInstruction';
import { SectionTitle } from '../SectionTitle';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import {
  handleListAdd,
  handleListChange,
  handleListDelete,
  handleListDragEnd,
} from './dnd-functions';

export default function RecipeInstructions() {
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
      <Stack direction="row" spacing={2}>
        <SectionTitle value={'Instructions'} />
        <IconButton aria-label="add" onClick={handleInstructionAdd}>
          <AddIcon />
        </IconButton>
      </Stack>

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
                  <Draggable key={key} draggableId={key} index={index}>
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
    </Stack>
  );
}
