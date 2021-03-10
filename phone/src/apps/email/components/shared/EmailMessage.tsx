import { Box, Card, CardContent } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IEmailMessage } from '../../../../common/typings/email';

export const EmailMessage = ({ message }: { message: IEmailMessage }) => {
  const { t } = useTranslation();
  return (
    <Box px={2}>
      <Card>
        <CardContent>
          {t('GENERIC_FROM')}: <i>{message.sender}</i>
        </CardContent>
        <CardContent>
          {t('GENERIC_TO')}: <i>{message.receivers.join(', ')}</i>
        </CardContent>

        <CardContent>
          {t('APPS_EMAIL_SUBJECT')}: <i>{message.subject || '( - )'}</i>
        </CardContent>
      </Card>
      <Box mt={2}>
        <Card>
          <CardContent>{message.body}</CardContent>
        </Card>
      </Box>
    </Box>
  );
};
