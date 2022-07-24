import React, { useState } from 'react';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { models_Instruction } from '@4ks/api-fetch';
import {
  stackStyles,
  stackItemStyles,
  itemAlignmentsStackTokens,
} from './styles';
import { useRecipeContext } from '../../providers/recipe-context';

const stackTokens: IStackTokens = {
  childrenGap: 1,
};

interface RecipeInstructionProps {
  data: models_Instruction;
}

function Instruction(props: RecipeInstructionProps) {
  const [text, setText] = useState(props.data.text);
  const [name, setName] = useState(props.data.name);

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
        <Stack.Item grow={2}>
          <TextField
            style={{ width: '64px' }}
            onChange={handleNameChange}
            borderless
            value={name}
          />
        </Stack.Item>
        <Stack.Item grow={8}>
          <TextField
            onChange={handleTextChange}
            borderless
            readOnly={false}
            value={text}
          />
        </Stack.Item>
      </Stack>
    </Stack.Item>
  );
}

interface RecipeInstructionsProps {}

export function RecipeInstructions(props: RecipeInstructionsProps) {
  const rtx = useRecipeContext();

  return (
    <Stack styles={stackStyles} tokens={itemAlignmentsStackTokens}>
      <span>Instructions</span>
      {rtx?.recipe?.currentRevision?.instructions?.map((i) => (
        <Instruction key={i.name} data={i} />
      ))}
      <DefaultButton
        text="Add Instruction"
        onClick={() => {}}
        allowDisabledFocus
      />
    </Stack>
  );
}
