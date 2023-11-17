import React from 'react';
import logo from '../../logo.svg';
import { useNavigate } from 'react-router-dom';
import { useSearchContext } from '../../providers';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';

// https://www.algolia.com/doc/guides/building-search-ui/widgets/create-your-own-widgets/react-hooks/
export default function Landing() {
  const navigate = useNavigate();
  const search = useSearchContext();

  if (!search.client) {
    return <CircularProgress />;
  }

  function handleOpenSearch() {
    search.handleOpen();
  }

  function navigateNewRecipe() {
    navigate('/r/0');
  }

  function NewRecipeButton() {
    return (
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          margin: 0,
          top: 'auto',
          right: 20,
          bottom: 20,
          left: 'auto',
          position: 'fixed',
        }}
        onClick={navigateNewRecipe}
      >
        <AddIcon />
      </Fab>
    );
  }

  return (
    <Box height="92vh" display="flex" flexDirection="column">
      <NewRecipeButton />
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
          src={logo}
        />
        <TextField
          id="searchBox"
          value={search.value || ''}
          placeholder="Search..."
          onClick={handleOpenSearch}
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
