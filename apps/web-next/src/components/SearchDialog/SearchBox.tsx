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

const queryHook: UseSearchBoxProps['queryHook'] = (query, search) => {
  search(query);
};

export default function SearchBox(props: UseSearchBoxProps) {
  // const { query, clear, isSearchStalled } = useSearchBox(props);
  const { handleClose, setValue, value } = useSearchContext();
  const router = useRouter();

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
    router.push('/explore');
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
