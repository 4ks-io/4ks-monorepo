import React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

export default async function DefaultPage() {
  return (
    <Box height="92vh" display="flex" flexDirection="column">
      <Stack
        height={'100%'}
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Box
          component="img"
          sx={{ height: 96, paddingRight: 1 }}
          alt="4ks.io"
          src={'/logo.svg'}
        />
        <TextField
          id="searchBox"
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Chip label="Ctrl+K" />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Box>
  );
}
