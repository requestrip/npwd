import React, { useEffect, useState } from 'react';
import SendIcon from '@material-ui/icons/Send';
import { Box, CircularProgress, Fab, makeStyles, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useEmail } from '../../hooks/useEmail';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';

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
  const { sendEmail, loading } = useEmail();
  const [subject, setSubject] = useState<string>('');
  const [receivers, setReceivers] = useState<string>('');
  const [body, setBody] = useState<string>('');

  const {
    messageId: queryMessageId,
    subject: querySubject,
    emailId: queryEmailId,
    receivers: queryReceivers,
    body: queryBody,
  } = useQueryParams({
    subject: '',
    emailId: null,
    receivers: '',
    messageId: null,
    body: '',
  });

  useEffect(() => {
    if (queryEmailId) {
      setSubject(querySubject);
      setReceivers(queryReceivers);
      setBody(queryBody);
    }
  }, [queryEmailId, querySubject, queryReceivers, queryBody]);

  const handleSubject = (e) => {
    setSubject(e.target.value || '');
  };

  const handleReceiver = (e) => {
    setReceivers(e.target.value || '');
  };

  const handleBody = (e) => {
    setBody(e.target.value || '');
  };

  const handleSubmit = () => {
    sendEmail({
      subject,
      receivers,
      body,
      email_id: Number(queryEmailId) || undefined,
      parent_id: Number(queryMessageId) || undefined,
    });
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
          disabled={!!queryEmailId}
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
        <Fab
          onClick={handleSubmit}
          disabled={!body || !receivers}
          className={classes.sendBtn}
          color="primary"
        >
          {loading ? <CircularProgress color="secondary" size={1} /> : <SendIcon />}
        </Fab>
      </Box>
    </Box>
  );
};
