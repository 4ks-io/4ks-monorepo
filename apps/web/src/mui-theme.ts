import { createTheme } from '@mui/material/styles';
import { grey, green } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    primary: {
      main: grey[50],
    },
    secondary: {
      main: green[500],
    },
  },
});
