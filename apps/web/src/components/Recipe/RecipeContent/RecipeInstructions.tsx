'use client';
import React, { useEffect, useState } from 'react';
import { isSSR } from '@/libs/navigation';
import Stack from '@mui/material/Stack';
import { models_Instruction } from '@4ks/api-fetch';
import { useRecipeContext } from '@/providers/recipe-context';
import RecipeDraggableInstructions from './RecipeDraggableInstructions';
import RecipeInstruction from './RecipeInstruction';
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

  const fallback = (
    <ul
      style={{ listStyleType: 'none', paddingInlineStart: '0px' }}
      className="Instructions"
    >
      {props.instructions.map((instruction, index) => (
        <li key={`instruction_${index}_${instruction.id}`}>
          <RecipeInstruction
            index={index}
            data={instruction}
            isDragging={false}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <Stack>
      <Stack direction="row" spacing={2}>
        <SectionTitle value={'Instructions'} />
        <IconButton aria-label="add" onClick={handleInstructionAdd}>
          <AddIcon />
        </IconButton>
      </Stack>

      {isSSR ? (
        fallback
      ) : (
        <RecipeDraggableInstructions
          data={instructions}
          onDragEnd={onDragEnd}
          onDelete={handleInstructionDelete}
          onChange={handleInstructionChange}
        />
      )}
    </Stack>
  );
}
