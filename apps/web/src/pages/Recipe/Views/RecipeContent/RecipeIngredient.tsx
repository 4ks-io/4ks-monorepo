import React, { useEffect, useState } from 'react';
import {
  Stack,
  IStackTokens,
  IStackItemStyles,
} from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { models_Ingredient } from '@4ks/api-fetch';
import { stackStyles } from './../../styles';
import { Icon } from '@fluentui/react/lib/Icon';

const stackTokens: IStackTokens = {
  childrenGap: 1,
};

interface RecipeIngredientProps {
  index: number;
  data: models_Ingredient;
  editing: boolean;
  handleIngredientDelete: (index: number) => void;
  handleIngredientChange: (index: number, data: models_Ingredient) => void;
}

export function RecipeIngredient({
  data,
  index,
  editing,
  handleIngredientDelete,
  handleIngredientChange,
}: RecipeIngredientProps) {
  const [quantity, setQuantity] = useState(data.quantity || '');
  const [name, setName] = useState(data.name || '');
  const [active, setActive] = useState(false);
  const [isNameMultiline, setIsNameMultiline] = useState(false);
  const [isQuantityMultiline, setIsQuantityMultiline] = useState(false);

  useEffect(() => setIsNameMultiline(name?.length >= 24), [name]);
  useEffect(() => setIsQuantityMultiline(quantity?.length >= 8), [quantity]);

  function handleQuantityChange(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) {
    setQuantity(`${newValue}`);
  }

  function handleNameChange(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) {
    setName(`${newValue}`);
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

  const dragItemStyles: IStackItemStyles = {
    root: {
      background: 'rgb(243, 242, 241)',
      padding: 2,
    },
  };

  return (
    <Stack.Item align="start" styles={dragItemStyles}>
      <Stack horizontal styles={stackStyles} tokens={stackTokens}>
        <Stack.Item>
          <Icon
            iconName="ToggleBorder"
            style={{ paddingTop: '10px', paddingRight: '12px' }}
          />
        </Stack.Item>
        <Stack.Item grow={2}>
          <TextField
            className="contentResizer"
            style={{ width: '96px' }}
            borderless
            multiline={isQuantityMultiline}
            autoAdjustHeight
            resizable={false}
            readOnly={!editing}
            value={quantity}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleQuantityChange}
          />
        </Stack.Item>
        <Stack.Item grow={8}>
          <TextField
            className="contentResizer"
            borderless
            multiline={isNameMultiline}
            autoAdjustHeight
            resizable={false}
            readOnly={!editing}
            value={name}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleNameChange}
          />
        </Stack.Item>
        {editing && active && (
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
