import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, makeStyles, TextField } from '@material-ui/core';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import { useEmail } from '../../hooks/useEmail';
import { EmailList } from '../shared/EmailList';

const useStyles = makeStyles((theme) => ({
  search: {
    zIndex: 5,
    position: 'absolute',
    backgroundColor: theme.palette.primary.light,
    top: 0,
  },
}));

export const InboxPage = () => {
  const classes = useStyles();

  const { inbox, fetchInbox, loading } = useEmail();
  const { autoSearch } = useQueryParams<{ autoSearch }>();

  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Box height="100%" pt="80px" position="relative">
      <Box width="100%" p={2} className={classes.search}>
        <TextField
          placeholder="Search e-mails"
          fullWidth
          variant="outlined"
          autoFocus={!!autoSearch}
          onChange={handleSearch}
          value={search}
        />
      </Box>
      {!inbox && loading ? (
        <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Box overflow="auto" maxHeight="100%">
          <EmailList emails={inbox} />
        </Box>
      )}
    </Box>
  );
};
