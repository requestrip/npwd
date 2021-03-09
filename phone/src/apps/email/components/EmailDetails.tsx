import { Box, Card, CardContent, CardHeader, Container } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useEmail } from '../hooks/useEmail';

export const EmailDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { getEmailById } = useEmail();

  const email = getEmailById(Number(id));

  if (!email) {
    return (
      <Box width="100%" textAlign="center">
        404
      </Box>
    );
  }

  return (
    <Container>
      <Card>
        <CardContent>
          {t('GENERIC_FROM')}: <i>{email.sender}</i>
        </CardContent>
        <CardContent>
          {t('GENERIC_TO')}: <i>{email.receivers.join(', ')}</i>
        </CardContent>

        <CardContent>
          {t('APPS_EMAIL_SUBJECT')}: <i>{email.subject || '( - )'}</i>
        </CardContent>
      </Card>
      <Box mt={2}>
        <Card>
          <CardContent>{email.body}</CardContent>
        </Card>
      </Box>
    </Container>
  );
};
