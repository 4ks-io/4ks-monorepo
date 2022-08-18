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
}

export function RecipeInstruction({ data, index }: RecipeInstructionProps) {
  const [text, setText] = useState(data.text);
  const [name, setName] = useState(data.name);

  function handleTextChange(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) {
    setText(newValue);
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
        <Stack.Item grow={8}>
          <TextField onChange={handleNameChange} borderless value={name} />
        </Stack.Item>
        <Stack.Item grow={2}>
          <TextField
            onChange={handleTextChange}
            style={{ width: '64px' }}
            borderless
            readOnly={false}
            value={text}
          />
        </Stack.Item>
      </Stack>
    </Stack.Item>
  );
}
