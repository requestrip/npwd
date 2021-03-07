import { red, common, grey } from '@material-ui/core/colors';

export const EMAIL_APP_DEFAULT_PRIMARY_COLOR = '#00695c';
export const EMAIL_APP_DEFAULT_TEXT_COLOR = common.white;

const theme = {
  palette: {
    primary: {
      main: EMAIL_APP_DEFAULT_PRIMARY_COLOR,
      dark: '#004940',
      light: '#33877c',
      contrastText: EMAIL_APP_DEFAULT_TEXT_COLOR,
    },
    text: {
      primary: grey[900],
    },
    background: {
      default: grey[100],
      paper: grey[50],
    },
  },
};

export default theme;
