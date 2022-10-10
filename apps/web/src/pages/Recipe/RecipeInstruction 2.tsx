import React, { useState } from 'react';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { models_Instruction } from '@4ks/api-fetch';
import { stackStyles, stackItemStyles } from './styles';
import { Icon } from '@fluentui/react/lib/Icon';

const stackTokens: IStackTokens = {
  childrenGap: 1,
};

interface RecipeInstructionProps {
  index: number;
  data: models_Instruction;
  handleInstructionDelete: (index: number) => void;
  handleInstructionChange: (index: number, data: models_Instruction) => void;
}

export function RecipeInstruction({
  data,
  index,
  handleInstructionDelete,
  handleInstructionChange,
}: RecipeInstructionProps) {
  const [active, setActive] = useState(false);
  const [text, setText] = useState(data.text);

  function handleTextChange(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) {
    setText(newValue);
  }

  function handleDelete() {
    handleInstructionDelete(index);
  }

  function handleFocus() {
    setActive(true);
  }

  function handleBlur() {
    setActive(false);
    handleInstructionChange(index, {
      id: data.id,
      type: data.type,
      name: '',
      text,
    } as models_Instruction);
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
            borderless
            readOnly={false}
            value={text}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleTextChange}
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
