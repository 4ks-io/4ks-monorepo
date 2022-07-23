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

const stackTokens: IStackTokens = {
  childrenGap: 1,
};

interface RecipeIngredientProps {
  data: models_Ingredient;
}

function Ingredient(props: RecipeIngredientProps) {
  const [quantity, setQuantity] = useState(props.data.quantity);
  const [name, setName] = useState(props.data.name);

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

interface RecipeIngredientsProps {
  data: models_Ingredient[] | undefined;
}

export function RecipeIngredients({ data }: RecipeIngredientsProps) {
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
            {data?.map((ingredient, index) => (
              <Draggable
                key={ingredient.name}
                draggableId={ingredient.name}
                index={index}
              >
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Ingredient key={ingredient.name} data={ingredient} />
                  </li>
                )}
              </Draggable>
            ))}
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
