import React from 'react';
import { Stack, Image, ImageFit, TextField, Spinner } from '@fluentui/react';
import {
  InstantSearch,
  SearchBox,
  useHits,
  Hits,
} from 'react-instantsearch-hooks-web';
import Logo from '../../logo.svg';
import { useSearchContext } from '../../providers';

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
    return <Spinner />;
  }

  return (
    <div
      style={{
        height: '80vh',
        width: '100%',
        display: 'flex',
        alignContent: 'center',
      }}
    >
      <Stack
        verticalAlign="center"
        horizontalAlign="center"
        style={{ width: '100%', rowGap: 10 }}
      >
        <Image src={Logo} width={100} imageFit={ImageFit.contain}></Image>
        <SearchBox placeholder="Search . . ." />
        {/* <CustomHits /> */}
        {/* <TextField
          placeholder="Search . . ."
          styles={{
            fieldGroup: {
              height: '40px',
              borderColor: 'lightgray',
            },
            field: {
              fontSize: 16,
              height: '40px',
            },
          }}
        /> */}
      </Stack>
    </div>
  );
};

export default Landing;
