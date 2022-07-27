import React, { useState } from 'react';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { models_Ingredient } from '@4ks/api-fetch';
import {
  stackStyles,
  stackItemStyles,
  itemAlignmentsStackTokens,
} from './styles';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useRecipeContext } from '../../providers/recipe-context';

const stackTokens: IStackTokens = {
  childrenGap: 1,
};

interface RecipeIngredientProps {
  index: number;
  data: models_Ingredient;
}

function Ingredient({ data, index }: RecipeIngredientProps) {
  const [quantity, setQuantity] = useState(data.quantity);
  const [name, setName] = useState(data.name);

  function handleQuantityChange(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) {
    setQuantity(newValue);
  }

  function handleNameChange(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) {
    setName(newValue);
  }

  return (
    <Stack.Item align="start" styles={stackItemStyles}>
      <Stack horizontal styles={stackStyles} tokens={stackTokens}>
        <Stack.Item>
          <TextField
            style={{ width: '32px' }}
            borderless
            readOnly={true}
            value={`${index}`}
          />
        </Stack.Item>
        <Stack.Item grow={2}>
          <TextField
            onChange={handleQuantityChange}
            style={{ width: '64px' }}
            borderless
            readOnly={false}
            value={quantity}
          />
        </Stack.Item>
        <Stack.Item grow={8}>
          <TextField onChange={handleNameChange} borderless value={name} />
        </Stack.Item>
      </Stack>
    </Stack.Item>
  );
}

interface RecipeIngredientsProps {}

export function RecipeIngredients(props: RecipeIngredientsProps) {
  const rtx = useRecipeContext();

  return (
    <Stack styles={stackStyles} tokens={itemAlignmentsStackTokens}>
      <span>Ingredients</span>
      <Droppable droppableId="ingredients">
        {(provided) => (
          <ul
            className="ingredients"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {rtx?.recipe?.currentRevision?.ingredients?.map(
              (ingredient, index) => (
                <Draggable
                  key={ingredient.name}
                  draggableId={`${ingredient.name}`}
                  index={index}
                >
                  {(provided) => (
                    <li
                      // style={{ listStyleType: 'none' }}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Ingredient
                        index={index}
                        key={ingredient.name}
                        data={ingredient}
                      />
                    </li>
                  )}
                </Draggable>
              )
            )}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
      <DefaultButton
        text="Add Ingredient"
        onClick={() => {}}
        allowDisabledFocus
      />
    </Stack>
  );
}
