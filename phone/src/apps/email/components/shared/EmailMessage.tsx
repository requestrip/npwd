import React, { useEffect, useState } from 'react';
import ReplyAllIcon from '@material-ui/icons/ReplyAll';
import ReplyIcon from '@material-ui/icons/Reply';
import { Box, Button, Card, CardActions, CardContent, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  IEmailMessage,
  EmailEvents,
  IEmailExternalAction,
  IEmailPhoneAction,
} from '../../../../../../typings/email';
import { useEmail } from '../../hooks/useEmail';
import { useHistory } from 'react-router';
import { TFunction } from 'i18next';
import { useNuiCallback, useNuiRequest } from 'fivem-nui-react-lib';
import { usePhone } from '../../../../os/phone/hooks/usePhone';

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
  const { closePhone } = usePhone();

  const [{ phoneActions, externalActions }, setActions] = useState<
    Pick<IEmailMessage, 'phoneActions' | 'externalActions'>
  >({});

  const [fetchEmailActions] = useNuiCallback<
    { messageId: number },
    Pick<IEmailMessage, 'phoneActions' | 'externalActions'>
  >('EMAIL', EmailEvents.FETCH_MESSAGE_ACTIONS, setActions);

  const { send } = useNuiRequest();

  const actionSideEffects = (action: IEmailPhoneAction | IEmailExternalAction) => {
    if (action.deleteEmail) {
      send(EmailEvents.DELETE_EMAIL, { messageId: message.id, emailId: message.emailId });
    }
    if (action.closePhone) {
      closePhone();
    }
  }

  const triggerExternalAction = (action: IEmailExternalAction) => {
    send(EmailEvents.TRIGGER_EXTERNAL_ACTION, { event: action.callbackArg, arg: action.callbackArg });
    actionSideEffects(action);
  };

  const triggerPhoneAction = (action: IEmailPhoneAction) => {
    history.push(action.href);
    actionSideEffects(action);
  }

  useEffect(() => {
    if (message.hasActions) {
      fetchEmailActions({ messageId: message.id });
    }
  }, [fetchEmailActions, message.hasActions, message.id]);

  const receivers = message.receivers.join(', ');

  return (
    <Box px={2}>
      <Card>
        <CardContent>
          {t('GENERIC_FROM')}: <i>{message.sender}</i>
        </CardContent>
        <CardContent>
          {t('GENERIC_TO')}: <i>{receivers}</i>
        </CardContent>

        <CardContent>
          {t('APPS_EMAIL_SUBJECT')}: <i>{subject || '( - )'}</i>
        </CardContent>
      </Card>
      <Box mt={2}>
        <Card>
          <CardContent>{message.body.split('\n').map((p) => mapParagraphs(p, t))}</CardContent>
          {message.hasActions && phoneActions && (
            <CardActions>
              <Box textAlign="right" width="100%">
                {phoneActions.map((action) => (
                  <Button color="primary" onClick={() => triggerPhoneAction(action)}>
                    {action.label}
                  </Button>
                ))}
              </Box>
            </CardActions>
          )}
          {message.hasActions && externalActions && (
            <CardActions>
              <Box textAlign="right" width="100%">
                {externalActions.map((action) => (
                  <Button color="primary" onClick={() => triggerExternalAction(action)}>
                    {action.label}
                  </Button>
                ))}
              </Box>
            </CardActions>
          )}
        </Card>
        {!message.sender.includes('no-reply') && (
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
        )}
      </Box>
    </Box>
  );
};
