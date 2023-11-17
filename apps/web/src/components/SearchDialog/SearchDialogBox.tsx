'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchContext } from '@/providers/search-context';
import type { UseSearchBoxProps } from 'react-instantsearch';
import { useSearchBox } from 'react-instantsearch';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';

const queryHook: UseSearchBoxProps['queryHook'] = (query, search) => {
  search(query);
};

export default function SearchDialogBox(props: UseSearchBoxProps) {
  // const { query, clear, isSearchStalled } = useSearchBox(props);
  const { handleClose, setValue, value, clear } = useSearchContext();
  const router = useRouter();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => refine(value), [value]);

  const { refine } = useSearchBox({
    queryHook: queryHook,
  });

  function handleChange(event: any) {
    refine(event.target.value);
    setValue(event.target.value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key == 'Enter') {
      handleClose();
      router.push('/search?q=' + value);
    }
  }

  return (
    <TextField
      autoFocus
      inputRef={(input) => input && input.focus()}
      id="searchBox"
      variant="standard"
      value={value || ''}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
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
            {value && value != '' && (
              <Tooltip title="Clear">
                <CloseIcon
                  fontSize="small"
                  sx={{ cursor: 'pointer', marginRight: 1 }}
                  onClick={clear}
                />
              </Tooltip>
            )}
            <Tooltip title="Close">
              <Chip
                label="esc"
                onClick={handleClose}
                sx={{ cursor: 'pointer' }}
              />
            </Tooltip>
          </InputAdornment>
        ),
      }}
    />
  );
}
