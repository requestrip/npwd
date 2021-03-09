import React from 'react';
import { Box, IconButton, makeStyles } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SearchIcon from '@material-ui/icons/Search';
import { useApp } from '../../../os/apps/hooks/useApps';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  back: {
    color: theme.palette.primary.contrastText,
    position: 'absolute',
    left: '12px',
  },
  search: {
    color: theme.palette.primary.contrastText,
    position: 'absolute',
    right: '12px',
  },
}));

export const EmailAppHeader = () => {
  const classes = useStyles();
  const history = useHistory();
  const { icon } = useApp('EMAIL');

  return (
    <Box
      className={classes.root}
      height="60px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <IconButton onClick={() => history.goBack()} className={classes.back}>
        <ArrowBackIcon />
      </IconButton>
      {icon}
      <IconButton onClick={() => history.push('/email/?autoSearch=1')} className={classes.search}>
        <SearchIcon />
      </IconButton>
    </Box>
  );
};
