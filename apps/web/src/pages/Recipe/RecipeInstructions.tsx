import React, { useEffect, useState } from 'react';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { models_Instruction } from '@4ks/api-fetch';
import { stackStyles, itemAlignmentsStackTokens } from './styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useRecipeContext } from '../../providers/recipe-context';
import { RecipeInstruction } from './RecipeInstruction';
import { SectionTitle } from './components/SectionTitle';

const reorder = (
  list: models_Instruction[],
  startIndex: number,
  endIndex: number
): models_Instruction[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export function RecipeInstructions() {
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

  function cloneInstructions(): models_Instruction[] {
    return Object.assign([], instructions) as models_Instruction[];
  }

  function handleInstructionAdd() {
    const i = cloneInstructions();
    i?.push({});
    setInstructions(i);
  }

  function handleInstructionDelete(index: number) {
    const i = cloneInstructions();
    i.splice(index, 1);
    setInstructions(i);
  }

  function handleInstructionChange(index: number, data: models_Instruction) {
    const i = cloneInstructions();
    i[index] = data;
    rtx?.setInstructions(i);
    setInstructions(i);
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
      <DefaultButton
        text="Add Instruction"
        onClick={handleInstructionAdd}
        allowDisabledFocus
      />
    </Stack>
  );
}
