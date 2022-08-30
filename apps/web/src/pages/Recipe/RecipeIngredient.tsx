import React, { useState } from 'react';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { models_Ingredient } from '@4ks/api-fetch';
import { stackStyles, stackItemStyles } from './styles';
import { Icon } from '@fluentui/react/lib/Icon';

const stackTokens: IStackTokens = {
  childrenGap: 1,
};

interface RecipeIngredientProps {
  index: number;
  data: models_Ingredient;
  handleIngredientDelete: (index: number) => void;
  handleIngredientChange: (index: number, data: models_Ingredient) => void;
}

export function RecipeIngredient({
  data,
  index,
  handleIngredientDelete,
  handleIngredientChange,
}: RecipeIngredientProps) {
  const [quantity, setQuantity] = useState(data.quantity);
  const [name, setName] = useState(data.name);
  const [active, setActive] = useState(false);

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

  function handleDelete() {
    handleIngredientDelete(index);
  }

  function handleFocus() {
    setActive(true);
  }

  function handleBlur() {
    setActive(false);
    handleIngredientChange(index, {
      id: data.id,
      type: data.type,
      name,
      quantity,
    } as models_Ingredient);
  }

  return (
    <Stack.Item align="start" styles={stackItemStyles}>
      <Stack horizontal styles={stackStyles} tokens={stackTokens}>
        <Stack.Item>
          <Icon
            iconName="DragObject"
            style={{ paddingTop: '10px', paddingRight: '4px' }}
          />
        </Stack.Item>
        <Stack.Item grow={2}>
          <TextField
            style={{ width: '96px' }}
            borderless
            readOnly={false}
            value={quantity}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleQuantityChange}
          />
        </Stack.Item>
        <Stack.Item grow={8}>
          <TextField
            borderless
            value={name}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleNameChange}
          />
        </Stack.Item>
        {active && (
          <Stack.Item>
            <Icon
              iconName="Delete"
              onClick={handleDelete}
              style={{ paddingTop: '10px', paddingLeft: '4px' }}
            />
          </Stack.Item>
        )}
      </Stack>
    </Stack.Item>
  );
}
