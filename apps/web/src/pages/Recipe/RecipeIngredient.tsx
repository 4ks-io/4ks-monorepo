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
    // console.log(`delete ${index}`);
    handleIngredientDelete(index);
  }

  function handleValidationComplete() {
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
            onChange={handleQuantityChange}
            style={{ width: '96px' }}
            borderless
            readOnly={false}
            value={quantity}
            validateOnFocusOut={true}
            onNotifyValidationResult={handleValidationComplete}
          />
        </Stack.Item>
        <Stack.Item grow={8}>
          <TextField
            onChange={handleNameChange}
            borderless
            value={name}
            validateOnFocusOut={true}
            onNotifyValidationResult={handleValidationComplete}
          />
        </Stack.Item>
        <Stack.Item>
          <Icon
            iconName="Delete"
            onClick={handleDelete}
            style={{ paddingTop: '10px', paddingLeft: '4px' }}
          />
        </Stack.Item>
      </Stack>
    </Stack.Item>
  );
}
