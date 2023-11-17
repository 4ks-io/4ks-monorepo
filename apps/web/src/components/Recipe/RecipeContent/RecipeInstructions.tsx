'use client';
import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import { models_Instruction } from '@4ks/api-fetch';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { default as Droppable } from '@/components/StrictModeDroppable';
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

type RecipeInstructionsProps = {
  instructions: models_Instruction[];
};

export default function RecipeInstructions(props: RecipeInstructionsProps) {
  const [instructions, setInstructions] = useState(props.instructions);
  const rtx = useRecipeContext();

  useEffect(() => {
    // skip if undefined
    if (!rtx?.recipe.currentRevision?.instructions) {
      return;
    }
    // skip if no change
    if (rtx?.recipe.currentRevision?.instructions == instructions) {
      return;
    }
    setInstructions(rtx?.recipe.currentRevision?.instructions);
  }, [instructions, rtx?.recipe.currentRevision?.instructions]);

  function refreshInstructions(i: models_Instruction[]) {
    rtx?.setInstructions(i);
    setInstructions(i);
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

      <DragDropContext onDragEnd={onDragEnd}>
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
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <RecipeInstruction
                          isDragging={snapshot.isDragging}
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
