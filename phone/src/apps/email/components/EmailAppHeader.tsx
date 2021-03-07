import React from 'react';
import { Box, IconButton, makeStyles } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SearchIcon from '@material-ui/icons/Search';
import { useApp } from '../../../os/apps/hooks/useApps';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  back: {
    position: 'absolute',
    left: '12px',
  },
  search: {
    position: 'absolute',
    right: '12px',
  },
}));

export const EmailAppHeader = () => {
  const classes = useStyles();
  const { icon } = useApp('EMAIL');

  return (
    <Box
      className={classes.root}
      height="60px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <IconButton className={classes.back}>
        <ArrowBackIcon />
      </IconButton>
      {icon}
      <IconButton className={classes.search}>
        <SearchIcon />
      </IconButton>
    </Box>
  );
};
