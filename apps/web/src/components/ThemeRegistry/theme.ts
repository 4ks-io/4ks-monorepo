import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// https://zenoo.github.io/mui-theme-creator/
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#333333',
    },
    secondary: {
      main: '#E65100',
    },
  },
  // typography: {
  //   fontFamily: roboto.style.fontFamily,
  // },
});

export default theme;
