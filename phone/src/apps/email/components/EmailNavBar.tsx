import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { NavLink, useLocation } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SentIcon from '@material-ui/icons/LabelImportant';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.primary.main,
  },
  icon: {
    color: theme.palette.primary.contrastText,
    '&.Mui-selected': {
      color: theme.palette.primary.light,
    },
  },
}));

const EmailNavBar = () => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const [page, setPage] = useState(pathname);

  const handleChange = (_e, newPage) => {
    setPage(newPage);
  };

  return (
    <BottomNavigation value={page} onChange={handleChange} showLabels className={classes.root}>
      <BottomNavigationAction
        className={classes.icon}
        label="Inbox"
        value="/email"
        color="secondary"
        component={NavLink}
        icon={<AllInboxIcon />}
        to="/email"
      />
      <BottomNavigationAction
        className={classes.icon}
        label="New"
        value="/email/new"
        component={NavLink}
        icon={<DraftsIcon />}
        to="/email/new"
      />
      <BottomNavigationAction
        className={classes.icon}
        label="Sent"
        value="/email/sent"
        component={NavLink}
        icon={<SentIcon />}
        to="/email/sent"
      />
    </BottomNavigation>
  );
};

export default EmailNavBar;
