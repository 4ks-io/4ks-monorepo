import React, { useCallback, useEffect } from 'react';
import { useSearchContext } from '../../providers';
import { useNavigate } from 'react-router-dom';
import type { UseSearchBoxProps } from 'react-instantsearch-hooks-web';
import { useSearchBox } from 'react-instantsearch-hooks-web';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search';

const queryHook: UseSearchBoxProps['queryHook'] = (query, search) => {
  search(query);
};

export default function SearchBox(props: UseSearchBoxProps) {
  // const { query, clear, isSearchStalled } = useSearchBox(props);
  const { handleClose, setValue, value } = useSearchContext();
  const navigate = useNavigate();

  useEffect(() => refine(value), [value]);

  const { refine } = useSearchBox({
    queryHook: queryHook,
  });

  function handleChange(event: any) {
    refine(event.target.value);
    setValue(event.target.value);
  }

  function handleSubmit() {
    handleClose();
    navigate('/r');
  }

  return (
    <TextField
      id="searchBox"
      variant="standard"
      value={value || ''}
      onChange={handleChange}
      onSubmit={handleSubmit}
      placeholder={'Search...'}
      sx={{ width: '100%' }}
      InputProps={{
        disableUnderline: true,
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <Chip label="esc" />
            <CloseIcon onClick={handleClose} sx={{ paddingLeft: 1 }} />
          </InputAdornment>
        ),
      }}
    />
  );
}
