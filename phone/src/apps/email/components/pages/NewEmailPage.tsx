import React, { useState } from 'react';
import SendIcon from '@material-ui/icons/Send';
import { Box, Fab, makeStyles, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  search: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    position: 'absolute',
    width: '100%',
    top: 0,
  },
  sendBtn: {
    position: 'absolute',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
}));

export const NewEmailPage = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [subject, setSubject] = useState<string>('');
  const [receivers, setReceivers] = useState<string>('');
  const [body, setBody] = useState<string>('');

  const handleSubject = (e) => {
    setSubject(e.target.value || '');
  };

  const handleReceiver = (e) => {
    setReceivers(e.target.value || '');
  };

  const handleBody = (e) => {
    setBody(e.target.value || '');
  };

  return (
    <Box height="100%" pt="180px">
      <Box p={2} className={classes.search}>
        <TextField
          variant="outlined"
          placeholder="To"
          color="primary"
          helperText="Add receivers separated by a comma"
          fullWidth
          value={receivers}
          onChange={handleReceiver}
        />
        <TextField
          variant="outlined"
          placeholder="Subject"
          color="primary"
          fullWidth
          value={subject}
          onChange={handleSubject}
        />
      </Box>
      <Box px={1}>
        <TextField
          label={t('GENERIC_CONTENT')}
          multiline
          fullWidth
          rows={16}
          variant="outlined"
          value={body}
          onChange={handleBody}
        />
        <Fab disabled={!body || !receivers} className={classes.sendBtn} color="primary">
          <SendIcon />
        </Fab>
      </Box>
    </Box>
  );
};
