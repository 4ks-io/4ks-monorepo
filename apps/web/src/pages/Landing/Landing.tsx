import React from 'react';
import logo from '../../logo.svg';
import { useSearchContext } from '../../providers';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
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
const Landing = () => {
  const search = useSearchContext();

  if (!search.client) {
    return <CircularProgress />;
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
        <SearchBox placeholder="Search . . ." />
        {/* <CustomHits /> */}
      </Stack>
    </Box>
  );
};

export default Landing;
