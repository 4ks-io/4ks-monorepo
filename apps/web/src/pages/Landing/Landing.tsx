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

import {
  InstantSearch,
  SearchBox,
  useHits,
  Hits,
} from 'react-instantsearch-hooks-web';

// function CustomHits() {
//   const { hits, results, sendEvent } = useHits();

//   return (
//     <ul>
//       {hits.map((h) => {
//         return (
//           <li key={h.objectID}>
//             {' '}
//             <a href={`r/${h['id']}`}>
//               @{h['author'] as string} / {h['name'] as string}
//             </a>
//           </li>
//         );
//       })}
//     </ul>
//   );
// }

// https://www.algolia.com/doc/guides/building-search-ui/widgets/create-your-own-widgets/react-hooks/
export default function Landing() {
  const search = useSearchContext();
  const navigate = useNavigate();

  if (!search.client) {
    return <CircularProgress />;
  }

  function handleOpenSearch() {
    search.handleOpen();
  }

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
          src={logo}
        />
        {/* <SearchBox placeholder="Search . . ." onSubmit={() => navigate('/r')} />
        <CustomHits /> */}
        <TextField
          id="searchBox"
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
