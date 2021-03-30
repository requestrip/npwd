import React, { useEffect, useState } from 'react';
import ReplyAllIcon from '@material-ui/icons/ReplyAll';
import ReplyIcon from '@material-ui/icons/Reply';
import { Box, Button, Card, CardActions, CardContent, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { IEmailMessage, EmailEvents, IEmail } from '../../../../../../typings/email';
import { useEmail } from '../../hooks/useEmail';
import { useNuiEventCallback } from '../../../../os/nui-events/hooks/useNuiEventCallback';
import { useHistory } from 'react-router';
import { TFunction } from 'i18next';

const mapParagraphs = (paragraph: string, t: TFunction) => {
  const isTranslate = paragraph.includes('--translate-');
  const [, tKey] = paragraph.split('--translate-');
  const text = isTranslate ? t(tKey) : paragraph;
  return (
    <Typography variant="caption" paragraph>
      {text}
    </Typography>
  );
};

export const EmailMessage = ({ message, subject }: { message: IEmailMessage; subject: string }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const { replyEmail } = useEmail();

  const [{ phoneActions, externalActions }, setActions] = useState<
    Pick<IEmailMessage, 'phoneActions' | 'externalActions'>
  >({});

  const [fetchEmailActions, { loading }] = useNuiEventCallback<
    { messageId: number },
    Pick<IEmailMessage, 'phoneActions' | 'externalActions'>
  >('EMAIL', EmailEvents.FETCH_MESSAGE_ACTIONS, setActions);

  useEffect(() => {
    if (message.hasActions) {
      fetchEmailActions({ messageId: message.id });
    }
  }, [fetchEmailActions, message.hasActions, message.id]);

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
          <CardContent>{message.body.split('\n').map((p) => mapParagraphs(p, t))}</CardContent>
        </Card>
        {message.hasActions && phoneActions && (
          <CardActions>
            <Box textAlign="right" width="100%">
              {phoneActions.map((action) => (
                <Button onClick={() => history.push(action.href)}>{action.label}</Button>
              ))}
            </Box>
          </CardActions>
        )}
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
