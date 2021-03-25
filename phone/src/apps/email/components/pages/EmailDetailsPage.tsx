import { Box, Button, CircularProgress, makeStyles } from '@material-ui/core';
import LeftIcon from '@material-ui/icons/ChevronLeft';
import RightIcon from '@material-ui/icons/ChevronRight';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { IEmailMessage } from '../../../../../../typings/email'; // :)
import { useEmail } from '../../hooks/useEmail';
import { EmailMessage } from '../shared/EmailMessage';

const useStyles = makeStyles((theme) => ({
  search: {
    zIndex: 5,
    position: 'absolute',
    backgroundColor: theme.palette.primary.light,
    top: 0,
  },
}));

export const EmailDetailsPage = () => {
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  const { getEmailById, head } = useEmail();
  const email = getEmailById(Number(id));
  const [currMessage, setCurrMessage] = useState<number>(0);
  const [message, setMessage] = useState<IEmailMessage>(null);

  useEffect(() => {
    if (!message && email) {
      if (head(email.messages)) {
        return;
      }
      setCurrMessage(0);
    }
  }, [email, head, message]);

  useEffect(() => {
    if (email) {
      setMessage(email.messages[currMessage]);
    }
  }, [currMessage, email, message]);

  const disableNextPage = currMessage === email?.messages.length - 1;
  const disablePrevPage = currMessage === 0;

  return (
    <Box height="100%" pt="80px" position="relative">
      <Box width="100%" p={2} className={classes.search}>
        <Box width="100%" display="flex" justifyContent="space-between">
          <Button
            fullWidth
            startIcon={<LeftIcon />}
            color="primary"
            onClick={() => setCurrMessage((curr) => curr + 1)}
            disabled={disableNextPage}
          >
            Previous
          </Button>
          <Button
            fullWidth
            endIcon={<RightIcon />}
            color="primary"
            onClick={() => setCurrMessage((curr) => curr - 1)}
            disabled={disablePrevPage}
          >
            Newest
          </Button>
        </Box>
      </Box>
      {!message || !email ? (
        <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <EmailMessage message={message} subject={email.subject} />
      )}
    </Box>
  );
};
