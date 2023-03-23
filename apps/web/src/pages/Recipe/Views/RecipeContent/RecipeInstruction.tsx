import React, { useState } from 'react';
import { models_Instruction } from '@4ks/api-fetch';
import Stack from '@mui/material/Stack';
import DragHandleIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';

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

  function handleTextChange(event: React.ChangeEvent<HTMLInputElement>) {
    setText(`${event.target.value}`);
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

  const inputProps = { disableUnderline: true, readOnly: !editing };

  return (
    <Stack>
      <Stack direction="row">
        {!editing && (
          <TextField
            variant="standard"
            value={index + 1}
            InputProps={{ disableUnderline: true, readOnly: true }}
            sx={{ width: 16 }}
          />
        )}
        {editing && !active && (
          <TextField
            variant="standard"
            value={index + 1}
            InputProps={{ disableUnderline: true, readOnly: true }}
            sx={{ width: 20 }}
          />
        )}
        {editing && active && (
          <DragHandleIcon sx={{ fontSize: 16, marginTop: 1 }} />
        )}
        <TextField
          fullWidth
          variant="standard"
          value={text}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleTextChange}
          multiline
          InputProps={inputProps}
          sx={{ paddingLeft: 1 }}
        />
        {editing && active && (
          <DeleteIcon
            sx={{ fontSize: 16, marginTop: 1 }}
            onClick={handleDelete}
          />
        )}
      </Stack>
    </Stack>
  );
}
