import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import { models_Ingredient } from '@4ks/api-fetch';
import DragHandleIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';

interface RecipeIngredientProps {
  index: number;
  data: models_Ingredient;
  handleIngredientDelete: (index: number) => void;
  handleIngredientChange: (index: number, data: models_Ingredient) => void;
  isDragging: boolean;
}

export function RecipeIngredient({
  data,
  index,
  handleIngredientDelete,
  handleIngredientChange,
  isDragging,
}: RecipeIngredientProps) {
  const [quantity, setQuantity] = useState(data.quantity || '');
  const [name, setName] = useState(data.name || '');
  const [active, setActive] = useState(false);

  function handleQuantityChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuantity(`${event.target.value}`);
  }

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(`${event.target.value}`);
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

  // todo : remove readonly
  const inputProps = { disableUnderline: true, readOnly: false };

  return (
    <Stack style={isDragging ? { backgroundColor: '#E65100' } : {}}>
      <Stack direction="row">
        {active ? (
          <DragHandleIcon sx={{ fontSize: 20, marginTop: 1, marginLeft: 1 }} />
        ) : (
          <Checkbox size="small" />
        )}
        <TextField
          fullWidth
          size="small"
          variant="standard"
          placeholder="-"
          value={quantity}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleQuantityChange}
          multiline
          InputProps={inputProps}
          sx={{ paddingLeft: 1, width: '96px', paddingTop: '0.5em' }}
          inputProps={{ style: { fontSize: 20 } }}
        />
        <TextField
          fullWidth
          size="small"
          variant="standard"
          placeholder="-"
          value={name}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleNameChange}
          multiline
          InputProps={inputProps}
          sx={{ paddingLeft: 1, paddingTop: '8px' }}
          inputProps={{ style: { fontSize: 20 } }}
        />
        {active && (
          <IconButton aria-label="delete">
            <DeleteIcon fontSize="small" onClick={handleDelete} />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );
}
