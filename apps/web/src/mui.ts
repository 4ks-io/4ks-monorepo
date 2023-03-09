import { createTheme } from '@mui/material/styles';
import { grey, blueGrey } from '@mui/material/colors';

// https://mui.com/system/palette/
// https://m2.material.io/design/color/the-color-system.html
// https://mui.com/material-ui/customization/color/

export const theme = createTheme({
  palette: {
    primary: {
      main: grey[50],
      dark: 'black',
    },
    secondary: {
      main: blueGrey[900],
    },
  },
});
