import React, { useEffect, useState } from 'react';
import { TextField } from '@fluentui/react/lib/TextField';
import { models_Instruction } from '@4ks/api-fetch';
import { stackStyles, stackItemStyles } from './../../styles';
import { Icon } from '@fluentui/react/lib/Icon';
import {
  Stack,
  IStackProps,
  IStackStyles,
  IStackTokens,
  IStackItemStyles,
} from '@fluentui/react/lib/Stack';

const stackTokens: IStackTokens = {
  childrenGap: 1,
};

interface RecipeInstructionProps {
  index: number;
  data: models_Instruction;
  editing: boolean;
  handleInstructionDelete: (index: number) => void;
  handleInstructionChange: (index: number, data: models_Instruction) => void;
}

export function RecipeInstruction({
  data,
  index,
  editing,
  handleInstructionDelete,
  handleInstructionChange,
}: RecipeInstructionProps) {
  const [active, setActive] = useState(false);
  const [text, setText] = useState(data.text || '');
  const [isMultiline, setIsMultiline] = useState(false);

  useEffect(() => setIsMultiline(text?.length > 36), [text]);

  function handleTextChange(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) {
    setText(`${newValue}`);
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
            borderless
            autoAdjustHeight
            resizable={false}
            multiline={isMultiline}
            readOnly={!editing}
            value={text}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleTextChange}
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
