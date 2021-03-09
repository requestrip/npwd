import React from 'react';
import { Box } from '@material-ui/core';
import { useEmail } from '../hooks/useEmail';
import { EmailList } from './EmailList';

export const SentPage = () => {
  const { sent } = useEmail();
  return (
    <Box height="100%">
      <Box overflow="auto" maxHeight="100%">
        <EmailList emails={sent} />
      </Box>
    </Box>
  );
};
