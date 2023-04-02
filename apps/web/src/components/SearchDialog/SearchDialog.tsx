import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useSearchContext } from '../../providers';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import {
  InstantSearch,
  SearchBox,
  useHits,
  Hits,
} from 'react-instantsearch-hooks-web';
import Skeleton from '@mui/material/Skeleton';

interface Hit {
  // typesense
  objectID: string;
  // text_match: number;
  // text_match_info: any;
  _highlightResult: any;
  //   {
  //     "author": {
  //         "value": "4ks-bot",
  //         "matchLevel": "none",
  //         "matchedWords": []
  //     },
  //     "ingredients": [
  //         {
  //             "value": " very thin spaghetti",
  //             "matchLevel": "none",
  //             "matchedWords": []
  //         },
  //         {
  //             "value": "1/2 bottle McCormick <mark>Salad</mark> Supreme (seasoning)",
  //             "matchLevel": "full",
  //             "matchedWords": [
  //                 "Salad"
  //             ]
  //         },
  //         {
  //             "value": "1 bottle Zesty Italian dressing",
  //             "matchLevel": "none",
  //             "matchedWords": []
  //         }
  //     ],
  //     "name": {
  //         "value": "Summer Spaghetti",
  //         "matchLevel": "none",
  //         "matchedWords": []
  //     }
  // }
  // 4ks
  id: string;
  author: string;
  name: string;
  imageUrl: string;
  ingredients: string[];
}
export default function SearchDialog() {
  const { open, handleClose } = useSearchContext();
  const navigate = useNavigate();

  // todo: true for mobile
  const [fullScreen, setFullScreen] = React.useState(true);
  // else
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('xl');

  function handleSubmit() {
    handleClose();
    navigate('/r');
  }

  function CustomHit(h: any) {
    // console.log(h);
    function handleRecipeNav() {
      handleClose();
      navigate(`r/${h['id']}`);
    }

    return (
      <Card sx={{ display: 'flex' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h6">
              {h['name'] as string}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              onClick={handleRecipeNav}
            >
              {h['author'] as string}
            </Typography>
          </CardContent>
        </Box>
        <CardMedia
          component="img"
          sx={{ width: 100 }}
          image={h['imageUrl']}
          // alt="Live from space album cover"
        />
      </Card>
    );
  }

  function CustomHits() {
    const { hits, results } = useHits();
    return hits.length > 1 ? (
      <Stack spacing={1}>{hits.map((h) => CustomHit(h))}</Stack>
    ) : (
      <>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </>
    );
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
        <TextField
          id="searchBox"
          variant="standard"
          defaultValue={'Search...'}
          // onClick={handleOpenSearch}
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
              </InputAdornment>
            ),
          }}
        />
        <SearchBox placeholder="Search . . ." onSubmit={handleSubmit} />
      </DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText>Results</DialogContentText>
        <Box
          noValidate
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            m: 'auto',
          }}
        >
          <CustomHits />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
