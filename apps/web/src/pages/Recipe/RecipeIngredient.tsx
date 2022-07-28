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
}

export function RecipeIngredient({ data, index }: RecipeIngredientProps) {
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
          <Icon iconName="DragObject" />
        </Stack.Item>
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
