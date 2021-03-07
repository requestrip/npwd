import React, { useState } from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { SearchField } from '../../../ui/components/SearchField';
import { useQueryParams } from '../../../common/hooks/useQueryParams';

const useStyles = makeStyles({
  search: {
    position: 'absolute',
    top: 0,
    margin: '0 auto',
  },
});

export const InboxPage = () => {
  const classes = useStyles();
  const [search, setSearch] = useState<string>('');

  const { autoSearch } = useQueryParams<{ autoSearch }>();

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Box height="100%" pt="60px">
      <Box className={classes.search}>
        <SearchField autoFocus={!!autoSearch} onChange={handleSearch} value={search} />
      </Box>
    </Box>
  );
};
