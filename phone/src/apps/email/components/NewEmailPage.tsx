import React from 'react';
import { Box, makeStyles, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  search: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    position: 'absolute',
    width: '100%',
    top: 0,
  },
}));

export const NewEmailPage = () => {
  const classes = useStyles();
  // const [subject, setSubject] = useState<string>('');
  // const [receivers, setReceivers] = useState<string>('');

  const handleSubject = (e) => {
    // setSubject(e.target.value || '');
  };

  const handleReceiver = (e) => {
    // setReceivers(e.target.value || '');
  };

  return (
    <Box height="100%" pt="120px">
      <Box p={2} className={classes.search}>
        <TextField
          variant="outlined"
          placeholder="To"
          color="primary"
          helperText="Add receivers separated by a comma"
          fullWidth
          onChange={handleReceiver}
        />
        <TextField
          variant="outlined"
          placeholder="Subject"
          color="primary"
          fullWidth
          onChange={handleSubject}
        />
      </Box>
      <Box>New Email</Box>
    </Box>
  );
};
