import React from 'react';
import ReplyAllIcon from '@material-ui/icons/ReplyAll';
import ReplyIcon from '@material-ui/icons/Reply';
import { Box, Button, Card, CardActions, CardContent, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { IEmailMessage } from '../../../../../../typings/email';
import { useEmail } from '../../hooks/useEmail';

export const EmailMessage = ({ message, subject }: { message: IEmailMessage; subject: string }) => {
  const { t } = useTranslation();
  const { replyEmail } = useEmail();
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
          {t('APPS_EMAIL_SUBJECT')}: <i>{subject || '( - )'}</i>
        </CardContent>
      </Card>
      <Box mt={2}>
        <Card>
          <CardContent>
            {message.body.split('\n').map((paragraph) => (
              <Typography variant="caption" paragraph>
                {paragraph}
              </Typography>
            ))}
          </CardContent>
        </Card>
        <CardActions>
          <Box textAlign="right" width="100%">
            <Button
              onClick={() => replyEmail({ ...message, subject })}
              color="primary"
              startIcon={<ReplyAllIcon />}
            >
              {t('GENERIC_REPLY_ALL')}
            </Button>
            <Button
              onClick={() => replyEmail({ ...message, subject, receivers: [message.sender] })}
              color="primary"
              startIcon={<ReplyIcon />}
            >
              {t('GENERIC_REPLY')}
            </Button>
          </Box>
        </CardActions>
      </Box>
    </Box>
  );
};
