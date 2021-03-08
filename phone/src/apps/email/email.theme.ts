import { common, grey } from '@material-ui/core/colors';

export const EMAIL_APP_DEFAULT_PRIMARY_COLOR = '#00695c';
export const EMAIL_APP_DEFAULT_TEXT_COLOR = common.white;

const theme = {
  palette: {
    primary: {
      main: EMAIL_APP_DEFAULT_PRIMARY_COLOR,
      dark: '#004940',
      light: '#99d5cf',
      contrastText: EMAIL_APP_DEFAULT_TEXT_COLOR,
    },
    text: {
      primary: grey[900],
      secondary: grey[700],
      disabled: grey[600],
      hint: grey[800],
    },
    divider: '#99d5cf',
    background: {
      default: grey[100],
      paper: grey[50],
    },
  },
};

export default theme;
